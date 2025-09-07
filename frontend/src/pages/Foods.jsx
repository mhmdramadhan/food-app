import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useSnackbar } from "../context/SnackbarContext";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", category: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(true);
  const { showMessage } = useSnackbar();
  const { user } = useContext(AuthContext);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await api.get("/foods");
      showMessage("Makanan berhasil ditambahkan", "success");
      setFoods(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  if (user.role !== "pelayan") {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">Anda tidak punya akses ke halaman ini.</Typography>
      </Container>
    );
  }


  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Memuat daftar makanan...</Typography>
      </Container>
    );
  }

  const handleOpenDialog = (food = null) => {
    setEditingFood(food);
    setForm(food ? { ...food } : { name: "", price: "", category: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFood(null);
    setForm({ name: "", price: "", category: "" });
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      showMessage("Nama dan harga wajib diisi", "error");
      return;
    }
    try {
      if (editingFood) {
        await api.put(`/foods/${editingFood.id}`, form);
        setSnackbar({ open: true, message: "Makanan berhasil diupdate", severity: "success" });
      } else {
        await api.post("/foods", form);
        setSnackbar({ open: true, message: "Makanan berhasil ditambahkan", severity: "success" });
      }
      fetchFoods();
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: "Gagal menyimpan makanan", severity: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus makanan ini?")) return;
    try {
      await api.delete(`/foods/${id}`);
      setSnackbar({ open: true, message: "Makanan berhasil dihapus", severity: "success" });
      fetchFoods();
    } catch (err) {
      setSnackbar({ open: true, message: "Gagal menghapus makanan", severity: "error" });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Master Foods
      </Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Tambah Makanan
      </Button>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Nama</TableCell>
            <TableCell>Harga</TableCell>
            <TableCell>Kategori</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {foods.map((food) => (
            <TableRow key={food.id}>
              <TableCell>{food.name}</TableCell>
              <TableCell>Rp {parseInt(food.price).toLocaleString()}</TableCell>
              <TableCell>{food.category}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpenDialog(food)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(food.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog Form */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingFood ? "Edit Makanan" : "Tambah Makanan"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nama"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Harga"
            type="number"
            fullWidth
            margin="normal"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <TextField
            label="Kategori"
            fullWidth
            margin="normal"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Foods;
