import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import {
    Container,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import { useSnackbar } from "../context/SnackbarContext";
import { AuthContext } from "../context/AuthContext";


const OrderDetail = () => {
    const { id } = useParams();
    const [foods, setFoods] = useState([]);
    const [order, setOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [foodId, setFoodId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const { showMessage } = useSnackbar();
    const { user } = useContext(AuthContext);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${id}`);
            showMessage("Order berhasil dimuat", "success");
            setOrder(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchFoods = async () => {
        try {
            const res = await api.get("/foods");
            setFoods(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrder();
        fetchFoods();
    }, [id]);

    const handleAddItem = async () => {
        if (!foodId) {
            showMessage("Pilih makanan dulu", "error");
            return;
        }
        if (quantity <= 0) {
            showMessage("Quantity harus lebih dari 0", "error");
            return;
        }
        try {
            await api.post(`/orders/${id}/add-item`, {
                food_id: foodId,
                quantity: Number(quantity),
            });
            showMessage("Item berhasil ditambahkan", "success");
            setOpenDialog(false);
            fetchOrder();
        } catch (err) {
            showMessage("Gagal menambah item", "error");
        }
    };

    const handleCloseOrder = async () => {
        try {
            await api.post(`/orders/${id}/close`);
            showMessage("Order berhasil ditutup", "success");
            fetchOrder();
        } catch (err) {
            showMessage("Gagal menutup order", "error");
        }
    };

    const handleReceipt = () => {
        window.open(`http://localhost:8000/api/orders/${id}/receipt`, "_blank");
    };

    if (!order) return <Typography>Loading...</Typography>;


    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Detail Order #{order.id}
            </Typography>
            <Typography>Meja: {order.table.table_number}</Typography>
            <Typography>Status: {order.status}</Typography>
            <Typography>Total: Rp {parseInt(order.total_price).toLocaleString()}</Typography>

            <Table sx={{ mt: 2 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Makanan</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Harga</TableCell>
                        <TableCell>Subtotal</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {order.items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.food.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>Rp {parseInt(item.price).toLocaleString()}</TableCell>
                            <TableCell>Rp {parseInt(item.subtotal).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {order.status === "open" && user.role === "pelayan" && (
                <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={() => setOpenDialog(true)}>
                    Tambah Item
                </Button>
            )}

            {order.status === "open" && user.role === "kasir" && (
                <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={handleCloseOrder}>
                    Tutup Order
                </Button>
            )}

            {order.status === "closed" && user.role === "kasir" && (
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleReceipt}>
                    Cetak Struk
                </Button>
            )}


            {/* Dialog Tambah Item */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Tambah Item</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="food-label">Pilih Makanan</InputLabel>
                        <Select
                            labelId="food-label"
                            value={foodId}
                            onChange={(e) => setFoodId(e.target.value)}
                        >
                            {foods.map((food) => (
                                <MenuItem key={food.id} value={food.id}>
                                    {food.name} - Rp {parseInt(food.price).toLocaleString()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Batal</Button>
                    <Button onClick={handleAddItem} variant="contained">
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

export default OrderDetail;
