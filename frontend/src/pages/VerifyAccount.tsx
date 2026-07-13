import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import icon from "../assets/images/icon.ico";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Verificar cuenta";
    const queryEmail = new URLSearchParams(location.search).get("email") || "";
    setEmail(queryEmail);
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo verificar la cuenta");
      } else {
        setMessage(data.message || "Cuenta verificada correctamente");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resend-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "Correo reenviado");
    } catch {
      setError("No se pudo reenviar el correo");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 animate-page-transition">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={icon} className="w-16 cursor-pointer" />
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Verifica tu cuenta</h2>
        <p className="text-sm text-gray-600 mb-6">Ingresa el código de 6 dígitos que te enviamos por WhatsApp/SMS o, si prefieres, usa el enlace de confirmación en tu correo.</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-green-600 font-medium">Correo</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300" placeholder="tu@email.com" />
          </div>
          <div>
            <label className="text-green-600 font-medium">Código de verificación</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-md border-gray-300" placeholder="123456" maxLength={6} />
          </div>
          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400">
            {loading ? "Verificando..." : "Verificar cuenta"}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600 space-y-2">
          <button type="button" onClick={handleResend} className="text-green-600 hover:underline">Reenviar correo de confirmación</button>
          <div>
            <Link to="/login" className="text-green-600 hover:underline">Volver a iniciar sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
