import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../assets/images/icon.png";

const Dashboard = () => {

  const navigate = useNavigate();

  // USUARIO
  const [user, setUser] = useState<any>(null);

  // RESERVACIÓN
  const [reservation, setReservation] = useState<any>(null);

  useEffect(() => {
    document.title = "Dashboard";

    // SESIÓN
    const getSession = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/session", {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data);

      } catch {
        navigate("/login");
      }
    };

    // RESERVACIÓN
    const getReservation = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/reservation/me", {
          credentials: "include",
        });

        const data = await res.json();
        setReservation(data);

      } catch {
        console.log("Error al obtener reservación");
      }
    };

    // LLAMADAS
    getSession();
    getReservation();

  }, []);

  // evita parpadeo
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-green-600 text-white px-8 py-4 flex justify-between items-center">

        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <img src={icon} alt="logo" className="w-8" />
          SICPES
        </Link>

        <div className="flex gap-8 items-center">
          <Link to="/dashboard">Inicio</Link>
          <Link to="/reservation">Peticiones</Link>
          <Link to="/payments">Pagos</Link>

          <button
            className="bg-black px-4 py-1 rounded hover:bg-gray-800"
            onClick={async () => {
              await fetch("http://localhost:3000/api/logout", {
                method: "POST",
                credentials: "include",
              });

              navigate("/login");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <div className="text-center mt-10 px-4">

        {/* BIENVENIDA */}
        <h1 className="text-3xl font-bold text-gray-700">
          ¡Bienvenido, {user?.nombre || "Usuario"}!
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

            <p>Piso: <strong>{reservation?.piso || "N/A"}</strong></p>
            <p>Tipo: <strong>{reservation?.tipo || "N/A"}</strong></p>
            <p>Habitación: <strong>{reservation?.habitacion || "N/A"}</strong></p>

            <p>
              Estado:{" "}
              <strong
                className={
                  reservation?.estado === "pendiente"
                    ? "text-yellow-600"
                    : reservation?.estado === "aceptada"
                    ? "text-green-600"
                    : reservation?.estado === "cancelada"
                    ? "text-red-600"
                    : "text-gray-500"
                }
              >
                {reservation?.estado || "N/A"}
              </strong>
            </p>
          </div>

          {/* PAGO (LO DEJAMOS COMO N/A) */}
          <div className="bg-white p-6 rounded-xl shadow text-left">
            <h3 className="font-bold text-gray-700 mb-3">
              Próximo pago
            </h3>

            <p>Monto: <strong>N/A</strong></p>
            <p>Vence: <strong>N/A</strong></p>
            <p>
              Estado:{" "}
              <strong className="text-gray-500">
                N/A
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
              <li>Bienvenido al sistema SICPES</li>
              <li>Tu reservación aparecerá aquí</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;