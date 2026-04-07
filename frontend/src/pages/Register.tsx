import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import icon from "../assets/images/icon.ico";

const Register = () => {

  useEffect(() => {
    document.title = "Registro";
  }, []);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // VALIDACIÓN SIMPLE (UX)
  const validate = (name: string, value: string) => {
    let error = "";

    if (name === "nombre") {
      if (value.length < 2) {
        error = "Ingresa un nombre válido";
      }
    }

    if (name === "email") {
      if (!value.includes("@")) {
        error = "Correo inválido";
      }
    }

    if (name === "password") {
      if (value.length < 8) {
        error = "Mínimo 8 caracteres";
      }
    }

    setErrors((prev: any) => ({
      ...prev,
      [name]: error,
    }));
  };

  // INPUTS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
    setError("");
    validate(name, value);
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (errors.nombre || errors.email || errors.password) return;

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError(
          "El correo electrónico ya está registrado. Intenta con otro o inicia sesión"
        );
      } else {
        setSuccess("Usuario registrado correctamente. Revisa tu correo para confirmar tu cuenta.");
        setForm({ nombre: "", email: "", password: "" });
      }

    } catch {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">

        {/* ICONO */}
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={icon} className="w-16 cursor-pointer" />
          </Link>
        </div>

        {/* TÍTULO */}
        <h2 className="text-2xl font-bold text-green-600 mb-6">
          Crear tu cuenta
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">

          {/* NOMBRE */}
          <div>
            <label className="text-green-600 font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ingresa tu nombre completo"
              value={form.nombre}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-md
                ${errors.nombre
                  ? "border-red-500"
                  : form.nombre
                    ? "border-green-500"
                    : "border-gray-300"
                }
              `}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm">{errors.nombre}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-green-600 font-medium">Correo</label>
            <input
              type="email"
              name="email"
              placeholder="Ingresa tu correo electrónico"
              value={form.email}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-md
                ${errors.email
                  ? "border-red-500"
                  : form.email
                    ? "border-green-500"
                    : "border-gray-300"
                }
              `}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-green-600 font-medium">Contraseña</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Crea una contraseña"
                value={form.password}
                onChange={handleChange}
                className={`w-full mt-1 px-4 py-2 border rounded-md
                  ${errors.password
                    ? "border-red-500"
                    : form.password
                      ? "border-green-500"
                      : "border-gray-300"
                  }
                `}
              />

              {/* VER / OCULTAR */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-600"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* MENSAJE ÉXITO */}
          {success && (
            <p className="text-green-600 text-sm">{success}</p>
          )}
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={
              errors.nombre || errors.email || errors.password
            }
            className={`w-full py-2 rounded-md text-white
              ${errors.nombre || errors.email || errors.password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            Registrarse
          </button>
        </form>

        {/* LINK */}
        <p className="mt-4 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Inicia sesión
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;