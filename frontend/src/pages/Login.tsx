import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../assets/images/icon.ico";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login";
  }, []);

  // ESTADOS
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // INPUTS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(""); 
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.detail || "Credenciales incorrectas");
        return;
      }

      const token = data.access_token;
      
      // Validar sesión y obtener datos del usuario
      const sessionRes = await fetch(`${apiUrl}/api/session`, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        
        login({
          id: sessionData.id,
          nombre: sessionData.nombre,
          email: sessionData.sub,
          rol: sessionData.rol
        }, token);

        // Redirección basada en rol
        if (sessionData.rol === "admin") {
          navigate("/admin/reservations");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Error al validar la sesión del usuario.");
      }

    } catch (err) {
      setError("Error al conectar con el servidor central.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 animate-page-transition">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={icon} alt="icono" className="w-16 cursor-pointer" />
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-green-600 mb-6">Inicia sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-green-600 font-medium">Correo</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ingresa tu correo electrónico"
              className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error ? "border-red-500 focus:ring-red-400" : "border-green-500 focus:ring-green-400"
              }`}
            />
          </div>

          <div>
            <label className="text-green-600 font-medium">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  error ? "border-red-500 focus:ring-red-400" : "border-green-500 focus:ring-green-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-600"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 text-sm">
          <p>¿No tienes una cuenta? <Link to="/register" className="text-green-600 hover:underline">Regístrate</Link></p>
          <Link to="/forgot-password" className="text-green-600 mt-2 block cursor-pointer hover:underline">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;