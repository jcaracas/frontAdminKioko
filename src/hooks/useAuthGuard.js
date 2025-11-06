import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function useAuthGuard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/login", { replace: true });
  };

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return logout();

    try {
      const { exp } = jwtDecode(token);
      const now = Date.now() / 1000;

      if (exp < now) logout();
    } catch {
      logout();
    }
  };

  useEffect(() => {
    // ✅ Check instantáneo
    checkAuth();

    // ✅ Check cada 20 segundos por si expira sin navegar
    const interval = setInterval(checkAuth, 20000);

    // ✅ Escuchar logout en otras pestañas
    window.addEventListener("storage", checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate]);
}
