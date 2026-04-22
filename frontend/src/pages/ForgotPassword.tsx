import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import icon from "../assets/images/icon.ico";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Recuperar Contraseña";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Debes ingresar un correo electrónico.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else setMessage(data.message);
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

        <h2 className="text-2xl font-bold text-gray-700 mb-2">Recuperar Contraseña</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Ingresa tu correo electrónico asociado a la cuenta. Te enviaremos un enlace de recuperación.
        </p>

        {message ? (
          <div>
            <div className="p-4 bg-green-50 text-green-700 font-medium text-sm border border-green-200 rounded-lg mb-6 text-left">
              ✅ {message}
            </div>
            <Link to="/login">
              <button className="bg-gray-800 text-white w-full px-6 py-2 rounded-md hover:bg-gray-900 transition">
                Volver al inicio
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-green-600 font-medium">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo asociado"
                className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  error ? "border-red-500 focus:ring-red-400" : "border-green-500 focus:ring-green-400"
                }`}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
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
