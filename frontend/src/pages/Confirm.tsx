import { useEffect } from "react";
import { Link } from "react-router-dom";

const Confirmado = () => {

  useEffect(() => {
    document.title = "Cuenta confirmada";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      
      <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-md w-full">
        
        {/* ICONO */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <span className="text-green-600 text-3xl">✔</span>
          </div>
        </div>

        {/* TÍTULO */}
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Éxito
        </h2>

        {/* TEXTO */}
        <p className="text-gray-500 mb-6">
          Registro finalizado. Ya puedes iniciar sesión.
        </p>

        {/* BOTÓN */}
        <Link to="/login">
          <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
            Iniciar sesión
          </button>
        </Link>

      </div>
    </div>
  );
};

export default Confirmado;