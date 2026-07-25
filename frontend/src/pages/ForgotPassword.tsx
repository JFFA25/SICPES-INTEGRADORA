import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import icon from "../assets/images/icon.ico";
import Alert from "../components/Alert";
import { useTimedMessage } from "../hooks/useTimedMessage";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message, showError, clear } = useTimedMessage();

  useEffect(() => {
    document.title = "Recuperar Contraseña";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showError("Debes ingresar un correo electrónico.");
      return;
    }
    setIsSubmitting(true);
    clear();
    setSuccessMessage("");

    try {
      const res = await fetch(`/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) showError(data.error || "No se pudo procesar la solicitud.");
      else setSuccessMessage(data.message);
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

        <h2 className="text-2xl font-bold text-gray-700 mb-2">Recuperar Contraseña</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Ingresa tu correo electrónico asociado a la cuenta. Te enviaremos un enlace de recuperación.
        </p>

        {successMessage ? (
          <div>
            <div className="mb-6 text-left">
              <Alert type="success">{successMessage}</Alert>
            </div>
            <Link to="/login">
              <button className="bg-gray-800 text-white w-full px-6 py-2 rounded-md hover:bg-gray-900 transition">
                Volver al inicio
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
            <div>
              <label htmlFor="forgot-email" className="text-green-600 font-medium">Correo electrónico</label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clear(); }}
                placeholder="Ingresa tu correo asociado"
                aria-invalid={message?.type === "error"}
                className={`w-full mt-1 px-4 py-2 border rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${message?.type === "error" ? "border-red-500 focus:ring-red-400" : "border-green-500 focus:ring-green-400"
                  }`}
              />
            </div>
            {message && <Alert type={message.type} onClose={clear}>{message.text}</Alert>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" strokeWidth={2.25} />
                  Enviando...
                </>
              ) : (
                "Enviar enlace"
              )}
            </button>

            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 underline">
                Cancelar y regresar
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
