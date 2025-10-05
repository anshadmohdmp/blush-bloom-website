import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      login(token); // ✅ store JWT in context & localStorage
      navigate("/"); // redirect to homepage
    } else {
      navigate("/login"); // fallback
    }
  }, [searchParams, login, navigate]);

  return <p>Logging you in with Google...</p>;
};

export default GoogleSuccess;
