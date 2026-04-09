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

  const isFinalizada = reservation?.estado === "finalizada";
  const isRechazada = reservation?.estado === "rechazada" || reservation?.estado === "cancelada";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-page-transition">

      {/* NAVBAR */}
      <nav className="bg-green-600 text-white px-8 py-4 flex justify-between items-center shadow-md z-10">

        <Link to="/dashboard" className="flex items-center gap-3 font-bold text-lg tracking-wide">
          <img
            src={icon}
            alt="logo"
            className="w-8 drop-shadow-sm"
          />
          SICPES
        </Link>

        <div className="flex gap-8 items-center text-sm font-medium">
          <Link to="/dashboard" className="text-green-100 border-b-2 border-white pb-1">Inicio</Link>
          <Link to="/reservation" className="hover:text-green-200 transition">Peticiones</Link>
          <Link to="/payments" className="hover:text-green-200 transition">Pagos</Link>

          <button
            className="bg-gray-900 border border-gray-800 text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition shadow-sm ml-2"
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
          <div className={`p-6 rounded-xl shadow text-left relative overflow-hidden transition-all duration-300 ${isFinalizada ? 'bg-gray-50 border border-gray-200' : 'bg-white'}`}>
            {isFinalizada && (
              <div className="absolute top-0 right-0 bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-bl-lg tracking-wide">
                HISTORIAL
              </div>
            )}

            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              {isFinalizada ? "Última estancia" : "Tu reservación"}
              {isFinalizada && (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </h3>

            {reservation ? (
              <>
                <div className="space-y-1 mb-4">
                  <p className="text-gray-600">Piso: <strong className="text-gray-800">{reservation.piso || "N/A"}</strong></p>
                  <p className="text-gray-600">Tipo: <strong className="text-gray-800">{reservation.tipo || "N/A"}</strong></p>
                  <p className="text-gray-600">Habitación: <strong className="text-gray-800">{reservation.habitacion || "N/A"}</strong></p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 font-medium">
                    Estado:{" "}
                    <strong
                      className={`px-3 py-1 rounded-full text-xs uppercase tracking-wide ml-1 ${reservation.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : reservation.estado === "aceptada"
                            ? "bg-green-100 text-green-700"
                            : reservation.estado === "cancelada" || reservation.estado === "rechazada"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {reservation.estado || "N/A"}
                    </strong>
                  </p>
                </div>

                {(isFinalizada || isRechazada) && (
                  <div className="mt-6 pt-5 border-t border-gray-200 text-center">
                    {isRechazada && reservation.motivo_rechazo && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-left text-sm text-red-700">
                        <strong className="block mb-1"> Motivo del rechazo:</strong>
                        {reservation.motivo_rechazo}
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mb-4">
                      {isFinalizada
                        ? "Tu estancia ha concluido. Puedes solicitar una nueva habitación."
                        : "Tu solicitud ha sido rechazada o cancelada."}
                    </p>
                    <Link
                      to="/reservation"
                      className="inline-block bg-white border border-green-600 text-green-600 hover:bg-green-50 px-5 py-2.5 rounded-lg text-sm font-semibold transition w-full shadow-sm"
                    >
                      Solicitar nueva reservación
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="py-6 text-center">
                <p className="text-gray-500 mb-5">No tienes ninguna reservación activa.</p>
                <Link
                  to="/reservation"
                  className="bg-green-600 text-white hover:bg-green-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm inline-block"
                >
                  Solicitar habitación
                </Link>
              </div>
            )}
          </div>

          {/* PAGO */}
          <div className={`p-6 rounded-xl shadow text-left transition-all duration-300 ${isFinalizada ? 'bg-gray-50 opacity-80 border border-gray-100' : 'bg-white'}`}>
            <h3 className="font-bold text-gray-700 mb-4">
              Próximo pago
            </h3>

            {isFinalizada || isRechazada || !reservation ? (
              <div className="h-full flex items-center justify-center pb-8">
                <p className="text-gray-400 text-sm italic text-center">No hay pagos pendientes.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">Monto: <strong className="text-gray-800">N/A</strong></p>
                <p className="text-gray-600">Vence: <strong className="text-gray-800">N/A</strong></p>
                <p className="text-gray-600 mt-2">
                  Estado:{" "}
                  <strong className="text-gray-500 ml-1">
                    N/A
                  </strong>
                </p>
              </div>
            )}
          </div>

          {/* AVISOS */}
          <div className="bg-white p-6 rounded-xl shadow text-left">
            <h3 className="font-bold text-gray-700 mb-4">
              Avisos
            </h3>

            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5">
              <ol className="list-decimal ml-4 space-y-2.5 text-gray-600 text-sm marker:text-blue-500 font-medium">
                {isFinalizada ? (
                  <>
                    <li>Gracias por hospedarte en residencias SICPES.</li>
                    <li>Por favor, retira todos tus objetos personales de la habitación.</li>
                    <li>Entrega las llaves en administración.</li>
                  </>
                ) : isRechazada ? (
                  <>
                    <li>Puedes intentar enviar una nueva solicitud de habitación.</li>
                    <li>Revisa que los datos enviados sean correctos.</li>
                  </>
                ) : (
                  <>
                    <li>Bienvenido al sistema SICPES.</li>
                    <li>Recuerda hacer tu pago mensual a tiempo.</li>
                    {reservation?.estado === "pendiente" && <li>Tu reservación está siendo evaluada.</li>}
                  </>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;