import { useEffect } from "react";
import { Link } from "react-router-dom";

const Register = () => {

  useEffect(() => {
    document.title = "Registro";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        
        {/* ICONO */}
        <div className="flex justify-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/69/69524.png"
            alt="icono"
            className="w-16"
          />
        </div>

        {/* TÍTULO */}
        <h2 className="text-2xl font-bold text-green-600 mb-6">
          Crear tu cuenta
        </h2>

        {/* FORM */}
        <form className="space-y-4 text-left">
          
          {/* NOMBRE */}
          <div>
            <label className="text-green-600 font-medium">Nombre</label>
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              className="w-full mt-1 px-4 py-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* CORREO */}
          <div>
            <label className="text-green-600 font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="w-full mt-1 px-4 py-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* CONTRASEÑA */}
          <div>
            <label className="text-green-600 font-medium">Contraseña</label>
            <input
              type="password"
              placeholder="Crear una contraseña"
              className="w-full mt-1 px-4 py-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Registrarse
          </button>
        </form>

        {/* LINK A LOGIN */}
        <div className="mt-4 text-sm">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-green-600 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;