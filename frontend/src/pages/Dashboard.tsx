import { useEffect } from "react";
import { Link } from "react-router-dom";
import icon from "../assets/images/icon.png";

const Dashboard = () => {

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* NAVBAR */}
      <nav className="bg-green-600 text-white px-8 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <img
            src={icon}
            alt="logo"
            className="w-8"
          />
          SICPES
        </Link>

        {/* MENÚ */}
        <div className="flex gap-8 items-center">
          <Link to="/dashboard" className="hover:underline">Inicio</Link>
          <Link to="/reservation" className="hover:underline">Peticiones</Link>
          <Link to="/payments" className="hover:underline">Pagos</Link>

          <button className="bg-black px-4 py-1 rounded hover:bg-gray-800">
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <div className="text-center mt-10 px-4">
        
        {/* BIENVENIDA */}
        <h1 className="text-3xl font-bold text-gray-700">
          ¡Bienvenido, Luis Humberto!
        </h1>

        <p className="text-gray-500 mt-2">
          Accede a la información de tu cuenta y tus reservaciones.
        </p>

        {/* TARJETAS */}
        <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
          
          {/* RESERVACIÓN */}
          <div className="bg-white p-6 rounded-xl shadow text-left">
            <h3 className="font-bold text-gray-700 mb-3">
              Tu reservación
            </h3>

            <p>Piso: <strong>1</strong></p>
            <p>Tipo: <strong>individual</strong></p>
            <p>Habitación: <strong>101</strong></p>
            <p>Estado: <strong className="text-green-600">aceptada</strong></p>
          </div>

          {/* PAGO */}
          <div className="bg-white p-6 rounded-xl shadow text-left">
            <h3 className="font-bold text-gray-700 mb-3">
              Próximo pago
            </h3>

            <p>Monto: <strong>$900.00</strong></p>
            <p>Vence: <strong>1/12/2025</strong></p>
            <p>
              Estado:{" "}
              <strong className="text-yellow-600">
                Pendiente de solicitud
              </strong>
            </p>
          </div>

          {/* AVISOS */}
          <div className="bg-white p-6 rounded-xl shadow text-left">
            <h3 className="font-bold text-gray-700 mb-3">
              Avisos
            </h3>

            <ol className="list-decimal ml-5 space-y-1 text-gray-600">
              <li>Recuerda hacer tu pago mensual</li>
              <li>Hoy es un día soleado</li>
              <li>¿Alguien lee estas cosas?</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;