import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const { exp } = jwtDecode(token);
      const now = Date.now() / 1000;

      if (exp < now) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        navigate("/login", { replace: true });
      }
    } catch {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      navigate("/login", { replace: true });
    }
  }, [navigate]);
}
