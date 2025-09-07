import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">RestourantPOS</Typography>
        <div>
          {user && (
            <>
              {user.role === "pelayan" && (
                <>
                  <Button color="inherit" component={Link} to="/">
                    Beranda
                  </Button>
                  <Button color="inherit" component={Link} to="/foods">
                    Makanan / Minuman
                  </Button>
                </>
              )}
              {user.role === "kasir" && (
                <>
                  <Button color="inherit" component={Link} to="/orders">
                    Orderan
                  </Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
