import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import icon from "../assets/images/icon.ico";
import Alert from "../components/Alert";
import { useTimedMessage } from "../hooks/useTimedMessage";

interface FieldErrors {
  nombre?: string;
  email?: string;
  password?: string;
  telefono?: string;
}

const Register = () => {

  useEffect(() => {
    document.title = "Registro";
  }, []);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message, showError, showSuccess, clear } = useTimedMessage();
  const [verifyEmail, setVerifyEmail] = useState("");

  // VALIDACIÓN SIMPLE (UX)
  const validate = (name: string, value: string) => {
    let fieldError = "";

    if (name === "nombre") {
      if (value.length < 2) {
        fieldError = "Ingresa un nombre válido";
      }
    }

    if (name === "email") {
      if (!value.includes("@")) {
        fieldError = "Correo inválido";
      }
    }

    if (name === "password") {
      if (value.length < 8) {
        fieldError = "Mínimo 8 caracteres";
      }
    }

    if (name === "telefono") {
      if (value.trim() && !/^\+?[0-9]{10,15}$/.test(value.trim())) {
        fieldError = "Formato inválido (Ej: +5215512345678)";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  // INPUTS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
    clear();
    validate(name, value);
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clear();
    setVerifyEmail("");

    if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) {
      showError("Todos los campos son obligatorios.");
      return;
    }

    if (errors.nombre || errors.email || errors.password || errors.telefono) return;

    setIsSubmitting(true);

    try {
      let phoneInput = form.telefono.trim();
      if (phoneInput) {
        const digits = phoneInput.replace(/\D/g, "");
        if (digits.length === 10) {
          phoneInput = `+521${digits}`;
        } else if (digits.length === 12 && digits.startsWith("52")) {
          phoneInput = `+521${digits.substring(2)}`;
        } else if (digits.length === 13 && digits.startsWith("521")) {
          phoneInput = `+${digits}`;
        } else if (!phoneInput.startsWith("+")) {
          phoneInput = `+${phoneInput}`;
        }
      }
      const formattedPhone = phoneInput ? `whatsapp:${phoneInput}` : "";

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          telefono: formattedPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || "El correo electrónico ya está registrado. Intenta con otro o inicia sesión");
      } else {
        showSuccess(data.message || "Usuario registrado correctamente. Revisa tu correo o WhatsApp para confirmar tu cuenta.");
        setVerifyEmail(form.email);
        setForm({ nombre: "", email: "", password: "", telefono: "" });
        if (data.requiresVerification) {
          window.location.href = `/verify-account?email=${encodeURIComponent(form.email)}`;
        }
      }

    } catch {
      showError("Error al conectar con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormInvalid = Boolean(errors.nombre || errors.email || errors.password || errors.telefono);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 animate-page-transition transition-colors relative">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center transition-colors">

        {/* ICONO */}
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={icon} alt="icono" className="w-16 cursor-pointer" />
          </Link>
        </div>

        {/* TÍTULO */}
        <h2 className="text-2xl font-bold text-green-600 mb-6">
          Crear tu cuenta
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>

          {/* NOMBRE */}
          <div>
            <label htmlFor="register-nombre" className="text-green-600 font-medium">Nombre</label>
            <input
              id="register-nombre"
              type="text"
              name="nombre"
              autoComplete="name"
              placeholder="Ingresa tu nombre completo"
              value={form.nombre}
              onChange={handleChange}
              aria-invalid={Boolean(errors.nombre)}
              className={`w-full mt-1 px-4 py-2 border rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400
                ${errors.nombre
                  ? "border-red-500"
                  : form.nombre
                    ? "border-green-500"
                    : "border-gray-300"
                }
              `}
            />
            {errors.nombre && (
              <p role="alert" className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label htmlFor="register-email" className="text-green-600 font-medium">Correo</label>
            <input
              id="register-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Ingresa tu correo electrónico"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              className={`w-full mt-1 px-4 py-2 border rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400
                ${errors.email
                  ? "border-red-500"
                  : form.email
                    ? "border-green-500"
                    : "border-gray-300"
                }
              `}
            />
            {errors.email && (
              <p role="alert" className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label htmlFor="register-password" className="text-green-600 font-medium">Contraseña</label>

            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="Crea una contraseña"
                value={form.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                className={`w-full mt-1 px-4 py-2 pr-11 border rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400
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
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2} /> : <Eye className="w-5 h-5" strokeWidth={2} />}
              </button>
            </div>

            {errors.password && (
              <p role="alert" className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* TELÉFONO (WHATSAPP) */}
          <div>
            <label htmlFor="register-telefono" className="text-green-600 font-medium">Teléfono</label>
            <input
              id="register-telefono"
              type="text"
              name="telefono"
              autoComplete="tel"
              placeholder="Ej: +5215512345678"
              value={form.telefono}
              onChange={handleChange}
              aria-invalid={Boolean(errors.telefono)}
              className={`w-full mt-1 px-4 py-2 border rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400
                ${errors.telefono
                  ? "border-red-500"
                  : form.telefono
                    ? "border-green-500"
                    : "border-gray-300"
                }
              `}
            />
            {errors.telefono ? (
              <p role="alert" className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">Con código de país para confirmación vía WhatsApp.</p>
            )}
          </div>

          {/* MENSAJE ÉXITO / ERROR */}
          {message && (
            <div className="space-y-2">
              <Alert type={message.type} onClose={clear}>{message.text}</Alert>
              {message.type === "success" && verifyEmail && (
                <a
                  href={`/verify-account?email=${encodeURIComponent(verifyEmail)}`}
                  className="block text-sm text-green-700 underline text-center"
                >
                  Verificar con mi correo
                </a>
              )}
            </div>
          )}

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={isFormInvalid || isSubmitting}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-white transition
              ${isFormInvalid || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" strokeWidth={2.25} />
                Registrando...
              </>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        {/* LINK */}
        <p className="mt-4 text-sm text-gray-700">
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
