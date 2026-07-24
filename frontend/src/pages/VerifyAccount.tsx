import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import icon from "../assets/images/icon.ico";
import Alert from "../components/Alert";
import { useTimedMessage } from "../hooks/useTimedMessage";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { message, showError, showSuccess, clear } = useTimedMessage();

  useEffect(() => {
    document.title = "Verificar cuenta";
    const queryEmail = new URLSearchParams(location.search).get("email") || "";
    setEmail(queryEmail);
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clear();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || "No se pudo verificar la cuenta");
      } else {
        showSuccess(data.message || "Cuenta verificada correctamente");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch {
      showError("No se pudo conectar con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    clear();
    try {
      const res = await fetch(`/api/resend-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) showError(data.error || "No se pudo reenviar el correo");
      else showSuccess(data.message || "Correo reenviado");
    } catch {
      showError("No se pudo reenviar el correo");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 animate-page-transition transition-colors relative">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center transition-colors">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={icon} className="w-16 cursor-pointer" alt="Logo SICPES" />
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Verifica tu cuenta</h2>
        <p className="text-sm text-gray-600 mb-6">Ingresa el código de 6 dígitos que te enviamos por WhatsApp/SMS o, si prefieres, usa el enlace de confirmación en tu correo.</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
          <div>
            <label htmlFor="verify-email" className="text-green-600 font-medium">Correo</label>
            <input
              id="verify-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clear(); }}
              className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="verify-code" className="text-green-600 font-medium">Código de verificación</label>
            <input
              id="verify-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => { setCode(e.target.value); clear(); }}
              className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="123456"
              maxLength={6}
            />
          </div>

          {message && <Alert type={message.type} onClose={clear}>{message.text}</Alert>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" strokeWidth={2.25} />
                Verificando...
              </>
            ) : (
              "Verificar cuenta"
            )}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600 space-y-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-2 text-green-600 hover:underline disabled:opacity-60"
          >
            {isResending && <LoaderCircle className="w-4 h-4 animate-spin" strokeWidth={2.25} />}
            o confirmar con correo electrónico
          </button>
          <div>
            <Link to="/login" className="text-green-600 hover:underline">Volver a iniciar sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
