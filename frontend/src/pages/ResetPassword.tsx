import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import icon from "../assets/images/icon.ico";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Ajustar Contraseña";
    
    // Verificar si el token es válido
    fetch(`${import.meta.env.VITE_API_URL}/api/reset-password/${token}`)
      .then(res => {
        if (!res.ok) {
          navigate("/error"); // Redirigir a pantalla de error si el token ya se usó o no existe
        }
      })
      .catch(() => navigate("/error"));
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !confirmPassword.trim()) {
      setError("Llena todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
        setError("La contraseña debe ser de al menos 8 caracteres.");
        return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password })
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else {
        setSuccess("Contraseña restablecida con éxito. Redirigiendo al Login...");
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 animate-page-transition">
      <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-md w-full">
        {/* ICONO */}
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={icon} className="w-16 cursor-pointer" alt="Logo SICPES" />
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-700 mb-2">Nueva Contraseña</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Crea una nueva contraseña segura para tu cuenta.
        </p>

        {success ? (
          <div className="p-4 bg-green-50 text-green-700 font-medium text-sm border border-green-200 rounded-lg text-left">
            ✅ {success}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-green-600 font-medium">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Nueva contraseña"
                  className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    error ? "border-red-500 focus:ring-red-400" : "border-green-500 focus:ring-green-400"
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-sm text-gray-600">
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-green-600 font-medium">Confirmar Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                placeholder="Repite la contraseña"
                className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  error ? "border-red-500 focus:ring-red-400" : "border-green-500 focus:ring-green-400"
                }`}
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition mt-2"
            >
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
