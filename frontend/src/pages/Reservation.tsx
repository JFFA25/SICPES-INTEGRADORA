import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../assets/images/icon.png";
import individualImg from "../assets/images/individual.png";
import compartidaImg from "../assets/images/compartido.png";

const Reservation = () => {

  useEffect(() => {
    document.title = "Reservación";
  }, []);

  const navigate = useNavigate();

  // ESTADOS
  const [form, setForm] = useState({
    fecha_ingreso: "",
    piso: "",
    habitacion: "",
  });

  const [tipo, setTipo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasReservation, setHasReservation] = useState(false);
  const [occupiedRooms, setOccupiedRooms] = useState<string[]>([]);

  // HABITACIONES
  const habitacionesPorPiso: any = {
    1: ["101", "102", "103", "104"],
    2: ["201", "202", "203", "204"],
  };

  // MONTO
  const monto =
    tipo === "individual"
      ? 2000
      : tipo === "compartida"
        ? 1200
        : 0;

  // VERIFICAR SI YA TIENE RESERVACIÓN
  useEffect(() => {
    const checkReservation = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/reservation/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (data) setHasReservation(true);

      } catch {
        console.log("Error al verificar reservación");
      }
    };

    checkReservation();
  }, []);

  // OBTENER HABITACIONES OCUPADAS
  useEffect(() => {
    if (!form.piso) return;

    const fetchOccupied = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/reservation/occupied?piso=${form.piso}`
        );

        const data = await res.json();

      
        setOccupiedRooms(data || []);

      } catch {
        console.log("Error al cargar habitaciones ocupadas");
      }
    };

    fetchOccupied();
  }, [form.piso]);

  // INPUTS
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // VALIDAR HABITACIÓN OCUPADA
    if (name === "habitacion" && occupiedRooms.includes(value)) {
      setError("Esta habitación ya está ocupada. Elige otra.");
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });

    setError("");
  };

  // VALIDACIÓN EXTRA
  useEffect(() => {
    if (form.habitacion && occupiedRooms.includes(form.habitacion)) {
      setError("Esta habitación ya está ocupada. Elige otra.");
    }
  }, [form.habitacion, occupiedRooms]);

  // 🚀 SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (hasReservation) {
      setError("Ya tienes una reservación registrada");
      return;
    }

    if (!form.fecha_ingreso || !tipo || !form.piso || !form.habitacion) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (occupiedRooms.includes(form.habitacion)) {
      setError("Esta habitación ya está ocupada. Elige otra.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          tipo,
          monto,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess("Reservación enviada correctamente 🎉");
      setHasReservation(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch {
      setError("Error al conectar con el servidor");
    }
  };

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
      <div className="flex justify-center items-center px-4 py-10">

        <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg border">

          <h1 className="text-2xl font-bold text-center text-gray-700 mb-2">
            Registro de Estudiantes
          </h1>

          <p className="text-center text-gray-500 mb-6">
            Completa el formulario para enviar una solicitud de cuarto.
          </p>

          {/* YA TIENE RESERVACIÓN */}
          {hasReservation && (
            <p className="text-red-500 text-center mb-4">
              Ya tienes una reservación registrada
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* FECHA */}
            <div>
              <label className="font-medium">Fecha de ingreso *</label>
              <input
                type="date"
                name="fecha_ingreso"
                value={form.fecha_ingreso}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                disabled={hasReservation}
                className="w-full mt-1 px-4 py-2 border border-green-500 rounded-md"
              />
            </div>

            {/* TIPO */}
            <div>
              <label className="font-medium">Tipo de Habitación *</label>

              <div className="grid grid-cols-2 gap-4 mt-2">

                <div
                  onClick={() => !hasReservation && setTipo("individual")}
                  className={`border p-4 rounded-lg cursor-pointer text-center ${tipo === "individual" ? "border-green-600 bg-green-50" : ""
                    } ${hasReservation && "opacity-50 cursor-not-allowed"}`}
                >
                  <img src={individualImg} className="w-16 mx-auto mb-2" />
                  <p className="font-semibold">Individual</p>
                  <p className="text-sm text-gray-500">Solo para ti</p>
                </div>

                <div
                  onClick={() => !hasReservation && setTipo("compartida")}
                  className={`border p-4 rounded-lg cursor-pointer text-center ${tipo === "compartida" ? "border-green-600 bg-green-50" : ""
                    } ${hasReservation && "opacity-50 cursor-not-allowed"}`}
                >
                  <img src={compartidaImg} className="w-16 mx-auto mb-2" />
                  <p className="font-semibold">Compartida</p>
                  <p className="text-sm text-gray-500">2-6 estudiantes</p>
                </div>

              </div>
            </div>

            {/* SELECTS */}
            <div className="grid md:grid-cols-2 gap-4">

              {/* PISO */}
              <select
                name="piso"
                value={form.piso}
                onChange={(e) => {
                  handleChange(e);
                  setForm({ ...form, piso: e.target.value, habitacion: "" });
                }}
                disabled={hasReservation}
                className="px-4 py-2 border rounded-md"
              >
                <option value="">Selecciona un piso</option>
                <option value="1">Piso 1</option>
                <option value="2">Piso 2</option>
              </select>

              {/* HABITACIÓN */}
              <select
                name="habitacion"
                value={form.habitacion}
                onChange={handleChange}
                disabled={!form.piso || hasReservation}
                className="px-4 py-2 border rounded-md"
              >
                <option value="">
                  {form.piso
                    ? "Selecciona una habitación"
                    : "Primero selecciona un piso"}
                </option>

                {form.piso &&
                  habitacionesPorPiso[form.piso].map((hab: string) => {
                    const isOccupied = occupiedRooms
                      .map((r: any) => String(r))
                      .includes(String(hab));

                    return (
                      <option
                        key={hab}
                        value={hab}
                        disabled={isOccupied}
                      >
                        {isOccupied
                          ? `Habitación ${hab} (Ocupada)`
                          : `Habitación ${hab}`}
                      </option>
                    );
                  })}
              </select>

            </div>

            {/* MENSAJE GENERAL */}
            {form.piso && occupiedRooms.length > 0 && (
              <p className="text-yellow-600 text-sm mt-2">
                Las habitaciones que esten marcadas como "ocupadas" no estarán disponibles para selección.
              </p>
            )}

            {/* 🔴 MENSAJE ESPECÍFICO */}
            {form.habitacion && occupiedRooms.includes(form.habitacion) && (
              <p className="text-red-500 text-sm mt-2">
                Esta habitación ya está ocupada. Selecciona otra.
              </p>
            )}

            {/* MONTO */}
            <input
              value={monto ? `$${monto} MXN` : ""}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />

            {/* MENSAJES */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}

            {/* BOTÓN */}
            <button
              disabled={hasReservation}
              className={`w-full py-3 rounded-md text-white ${hasReservation
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
                }`}
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