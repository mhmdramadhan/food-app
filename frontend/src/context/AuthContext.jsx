import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if (token) {
            // optional: fetch user info dari /me
            fetchUser();
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                logout();
            }
        } catch {
            logout();
        }
    };

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
