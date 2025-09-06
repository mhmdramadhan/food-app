import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

const Dashboard = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const fetchTables = async () => {
    try {
      const res = await api.get("/tables");
      setTables(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTableClick = async (table) => {
    if (table.status === "available") {
      try {
        const res = await api.post("/orders/open", { table_id: table.id });
        setSnackbar({ open: true, message: "Order berhasil dibuka!", severity: "success" });
        navigate(`/orders/${res.data.id}`);
      } catch (err) {
        setSnackbar({ open: true, message: err.response?.data?.message || "Gagal membuka order", severity: "error" });
      }
    } else {
      navigate(`/orders/${table.id}`); // redirect ke detail order meja yang sudah occupied
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard - List Meja
      </Typography>

      <Grid container spacing={2}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={3} key={table.id}>
            <Card>
              <CardActionArea onClick={() => handleTableClick(table)}>
                <CardContent
                  sx={{
                    backgroundColor: table.status === "available" ? "lightgreen" : "lightcoral",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">{table.table_number}</Typography>
                  <Typography variant="body2">
                    {table.status === "available" ? "Kosong" : "Terisi"}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

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

export default Dashboard;
