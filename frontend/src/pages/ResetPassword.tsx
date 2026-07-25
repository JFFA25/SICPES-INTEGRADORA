import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import icon from "../assets/images/icon.ico";
import Alert from "../components/Alert";
import { useTimedMessage } from "../hooks/useTimedMessage";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { message, showError, clear } = useTimedMessage();

  useEffect(() => {
    document.title = "Ajustar Contraseña";

    // Verificar si el token es válido
    fetch(`/api/reset-password/${token}`)
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
      showError("Llena todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      showError("La contraseña debe ser de al menos 8 caracteres.");
      return;
    }

    setIsSubmitting(true);
    clear();

    try {
      const res = await fetch(`/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password })
      });
      const data = await res.json();
      if (!res.ok) showError(data.error || "No se pudo restablecer la contraseña.");
      else {
        setSuccessMessage("Contraseña restablecida con éxito. Redirigiendo al Login...");
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch {
      showError("Error al conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 animate-page-transition transition-colors relative">
      <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-md w-full transition-colors">
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

        {successMessage ? (
          <div className="text-left">
            <Alert type="success">{successMessage}</Alert>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
            <div>
              <label htmlFor="reset-password" className="text-green-600 font-medium">Contraseña</label>
              <div className="relative">
                <input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clear(); }}
                  placeholder="Nueva contraseña"
                  aria-invalid={message?.type === "error"}
                  className={`w-full mt-1 px-4 py-2 pr-11 border rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                    message?.type === "error" ? "border-red-500 focus:ring-red-400" : "border-green-500 focus:ring-green-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2} /> : <Eye className="w-5 h-5" strokeWidth={2} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reset-confirm-password" className="text-green-600 font-medium">Confirmar Contraseña</label>
              <input
                id="reset-confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clear(); }}
                placeholder="Repite la contraseña"
                aria-invalid={message?.type === "error"}
                className={`w-full mt-1 px-4 py-2 border rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  message?.type === "error" ? "border-red-500 focus:ring-red-400" : "border-green-500 focus:ring-green-400"
                }`}
              />
            </div>

            {message && <Alert type={message.type} onClose={clear}>{message.text}</Alert>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition mt-2"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" strokeWidth={2.25} />
                  Guardando...
                </>
              ) : (
                "Actualizar contraseña"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
