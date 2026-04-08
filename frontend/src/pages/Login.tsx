import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../assets/images/icon.ico";

const Login = () => {
  useEffect(() => {
    document.title = "Login";
  }, []);

  const navigate = useNavigate();

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

    setForm({
      ...form,
      [name]: value,
    });

    setError(""); // limpiar error al escribir
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // incluir cookies
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // LOGIN CORRECTO
      navigate("/dashboard");

    } catch (error) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">

        {/* ICONO */}
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img
              src={icon}
              alt="icono"
              className="w-16 cursor-pointer"
            />
          </Link>
        </div>

        {/* TÍTULO */}
        <h2 className="text-2xl font-bold text-green-600 mb-6">
          Inicia sesión
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">

          {/* CORREO */}
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

          {/* CONTRASEÑA */}
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

              {/* BOTÓN VER */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-600"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* BOTÓN */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Entrar
          </button>
        </form>

        {/* LINKS */}
        <div className="mt-4 text-sm">
          <p>
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-green-600 hover:underline">
              Regístrate
            </Link>
          </p>

          <p className="text-green-600 mt-2 cursor-pointer hover:underline">
            ¿Olvidaste tu contraseña?
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;