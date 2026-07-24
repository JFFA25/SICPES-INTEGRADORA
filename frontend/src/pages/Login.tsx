import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import icon from "../assets/images/icon.ico";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import { useTimedMessage } from "../hooks/useTimedMessage";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message, showError, clear } = useTimedMessage();

  useEffect(() => {
    document.title = "Login";
  }, []);

  // ESTADOS
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasError = message?.type === "error";

  // INPUTS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    clear();
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      showError("Todos los campos son obligatorios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showError("Por favor, ingresa un correo válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Utiliza el proxy configurado en Vite
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || data.detail || "Credenciales incorrectas");
        setIsSubmitting(false);
        return;
      }

      const sessionRes = await fetch("/api/session", {
        credentials: "include",
      });

      if (!sessionRes.ok) {
        showError("Error al validar la sesión del usuario.");
        setIsSubmitting(false);
        return;
      }

      const sessionData = await sessionRes.json();

      login(
        {
          id: sessionData.id,
          nombre: sessionData.nombre,
          email: sessionData.sub,
          rol: sessionData.rol,
        },
        ""
      );

      if (sessionData.rol === "admin") {
        navigate("/admin/reservations");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error al conectar:", err);
      showError("Error al conectar con el servidor central.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 animate-page-transition transition-colors relative">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center transition-colors">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={icon} alt="icono" className="w-16 cursor-pointer" />
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-green-600 mb-6">
          Inicia sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
          <div>
            <label htmlFor="login-email" className="text-green-600 font-medium">
              Correo
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ingresa tu correo electrónico"
              aria-invalid={hasError}
              className={`w-full mt-1 px-4 py-2 border rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                hasError
                  ? "border-red-500 focus:ring-red-400"
                  : "border-green-500 focus:ring-green-400"
              }`}
            />
          </div>

          <div>
            <label htmlFor="login-password" className="text-green-600 font-medium">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                aria-invalid={hasError}
                className={`w-full mt-1 px-4 py-2 pr-11 border rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  hasError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-green-500 focus:ring-green-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2} /> : <Eye className="w-5 h-5" strokeWidth={2} />}
              </button>
            </div>
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
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-700">
          <p>
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-green-600 hover:underline">
              Regístrate
            </Link>
          </p>

          <Link
            to="/forgot-password"
            className="text-green-600 mt-2 block cursor-pointer hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
