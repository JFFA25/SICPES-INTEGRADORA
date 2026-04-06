import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import icon from "../assets/images/icon.png";

const Reservation = () => {

  useEffect(() => {
    document.title = "Reservación";
  }, []);

 
  const [tipo, setTipo] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR SIMPLE */}
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
      <div className="flex justify-center items-center px-4 py-10">

        <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg border">


          {/* TÍTULO */}
          <h1 className="text-2xl font-bold text-center text-gray-700 mb-2">
            Registro de Estudiantes
          </h1>

          <p className="text-center text-gray-500 mb-6">
            Completa el formulario para enviar una solicitud de cuarto.
          </p>

          {/* FORM */}
          <form className="space-y-5">

            {/* FECHA */}
            <div>
              <label className="font-medium">Fecha de ingreso *</label>
              <input
                type="date"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            {/* TIPO HABITACIÓN */}
            <div>
              <label className="font-medium">Tipo de Habitación *</label>

              <div className="grid grid-cols-2 gap-4 mt-2">

                <div
                  onClick={() => setTipo("individual")}
                  className={`border p-4 rounded-lg cursor-pointer text-center transition ${
                    tipo === "individual"
                      ? "border-green-600 bg-green-50 shadow"
                      : "hover:border-green-400"
                  }`}
                >
                  <p className="font-semibold">Individual</p>
                  <p className="text-sm text-gray-500">Solo para ti</p>
                </div>

                <div
                  onClick={() => setTipo("compartida")}
                  className={`border p-4 rounded-lg cursor-pointer text-center transition ${
                    tipo === "compartida"
                      ? "border-green-600 bg-green-50 shadow"
                      : "hover:border-green-400"
                  }`}
                >
                  <p className="font-semibold">Compartida</p>
                  <p className="text-sm text-gray-500">2-6 estudiantes</p>
                </div>

              </div>
            </div>

            {/* SELECTS */}
            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="font-medium">Piso *</label>
                <select className="w-full mt-1 px-4 py-2 border rounded-md">
                  <option>Selecciona un piso</option>
                  <option>Piso 1</option>
                  <option>Piso 2</option>
                  <option>Piso 3</option>
                </select>
              </div>

              <div>
                <label className="font-medium">Habitación *</label>
                <select className="w-full mt-1 px-4 py-2 border rounded-md">
                  <option>Selecciona una habitación</option>
                  <option>Habitación 101</option>
                  <option>Habitación 102</option>
                </select>
              </div>

            </div>

            {/* MONTO */}
            <div>
              <label className="font-medium">Monto mensual *</label>
              <input
                type="text"
                value={
                  tipo === "individual"
                    ? "$2000 MXN"
                    : tipo === "compartida"
                    ? "$1200 MXN"
                    : ""
                }
                readOnly
                className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-100"
              />
            </div>

            {/* BOTÓN */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition font-semibold shadow"
            >
              Reservar
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Reservation;