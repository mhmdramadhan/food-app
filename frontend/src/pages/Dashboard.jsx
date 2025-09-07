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
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

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
                navigate(`/orders/${res.data.id}`); // pakai order.id dari response open
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: err.response?.data?.message || "Gagal membuka order",
                    severity: "error",
                });
            }
        } else {
            if (table.current_order_id) {
                navigate(`/orders/${table.current_order_id}`); // pakai current_order_id
            } else {
                setSnackbar({ open: true, message: "Tidak ada order aktif di meja ini", severity: "error" });
            }
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

    if (user.role === "kasir") {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography variant="h5">
                    Halo {user.name}, silakan buka menu Orders untuk mengelola pesanan.
                </Typography>
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
