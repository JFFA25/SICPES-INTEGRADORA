import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../assets/images/icon.png";
import individualImg from "../assets/images/individual.png";
import compartidaImg from "../assets/images/compartido.png";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("es", es);

const CustomDropdown = ({ options, value, onChange, placeholder, disabled }: any) => {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const handleClickOutside = () => setOpen(false);
    if(open) {
      setTimeout(() => document.addEventListener('click', handleClickOutside), 10);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full">
      <div
        onClick={() => {
          if (!disabled) {
            setOpen(!open);
          }
        }}
        className={`w-full px-4 py-3 border text-left bg-gray-50 rounded-2xl flex justify-between items-center transition ${
          disabled ? "opacity-60 cursor-not-allowed border-gray-200" : "cursor-pointer border-gray-200 hover:border-green-300 focus:ring-2 focus:ring-green-500/50 bg-white"
        } ${open ? "border-green-500 ring-2 ring-green-500/50" : ""}`}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value ? options.find((o:any) => o.value === value)?.label : placeholder}
        </span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${open ? "rotate-180 text-green-500" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-page-transition max-h-60 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No hay opciones</div>
          ) : (
            options.map((o: any) => (
              <div
                key={o.value}
                onClick={() => {
                  if (!o.disabled) {
                    onChange(o.value);
                  }
                }}
                className={`px-4 py-3 text-sm transition ${
                  o.disabled
                    ? "opacity-50 cursor-not-allowed bg-slate-50 text-slate-400"
                    : "cursor-pointer hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium"
                }`}
              >
                {o.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const Reservation = () => {

  useEffect(() => {
    document.title = "Reservación";
  }, []);

  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    fecha_ingreso: today,
    piso: "",
    habitacion: "",
  });

  const [tipo, setTipo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasReservation, setHasReservation] = useState(false);
  const [prices, setPrices] = useState({ individual: 2000, compartida: 1200 });
  const [occupiedRooms, setOccupiedRooms] = useState<string[]>([]);
  const [habitacionesPorPiso, setHabitacionesPorPiso] = useState<any>({});

  // CARGAR HABITACIONES DESDE API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms`);
        if (res.ok) {
          const data = await res.json();
          const rows = Array.isArray(data) ? data : data.lista || [];
          const formatted: any = {};
          rows.forEach((row: any) => {
            formatted[row.piso] = row.habitaciones.split(', ');
          });
          setHabitacionesPorPiso(data.agrupado || formatted);
        } else {
          console.error("Error cargando habitaciones: respuesta inválida", res.status);
        }
      } catch (error) {
        console.error("Error cargando habitaciones:", error);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          setPrices({
            individual: data.precioIndividual || 2000,
            compartida: data.precioCompartida || 1200,
          });
        }
      } catch (error) {
        console.error("Error cargando precios de configuración:", error);
      }
    };

    fetchRooms();
    fetchSettings();
  }, []);

  // MONTO
  const monto =
    tipo === "individual"
      ? prices.individual
      : tipo === "compartida"
        ? prices.compartida
        : 0;

  // VERIFICAR SI YA TIENE RESERVACIÓN
  useEffect(() => {
    const checkReservation = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservation/me`, {
          credentials: "include",
        });

        const data = await res.json();

        if (data && !["finalizada", "cancelada", "rechazada"].includes(data.estado)) {
           setHasReservation(true);
        }

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
          `${import.meta.env.VITE_API_URL}/api/reservation/occupied?piso=${form.piso}`
        );

        const data = await res.json();

      
        setOccupiedRooms(data || []);

      } catch {
        console.log("Error al cargar habitaciones ocupadas");
      }
    };

    fetchOccupied();
  }, [form.piso]);

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservation`, {
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
    <div className="min-h-screen bg-gray-50 flex flex-col animate-page-transition">

      {/* NAVBAR */}
      <nav className="bg-green-600 text-white px-8 py-4 flex justify-between items-center shadow-md z-10">
        <Link to="/dashboard" className="flex items-center gap-3 font-bold text-lg tracking-wide">
          <img src={icon} alt="logo" className="w-8 drop-shadow-sm" />
          SICPES
        </Link>

        <div className="flex gap-8 items-center text-sm font-medium">
          <Link to="/dashboard" className="hover:text-green-200 transition">Inicio</Link>
          <Link to="/reservation" className="text-green-100 border-b-2 border-white pb-1">Peticiones</Link>
          <Link to="/payments" className="hover:text-green-200 transition">Pagos</Link>

          <button
            className="bg-gray-900 border border-gray-800 text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition shadow-sm ml-2"
            onClick={async () => {
              await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
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
      <div className="flex justify-center items-center px-4 py-8">

        <div className="bg-white w-full max-w-2xl p-6 md:p-8 rounded-2xl shadow-xl shadow-green-100/50 border border-green-50">

          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
            Registro de Estudiantes
          </h1>

          <p className="text-center text-gray-500 mb-6 text-sm">
            Completa el formulario para enviar una solicitud de cuarto.
          </p>

          {/* YA TIENE RESERVACIÓN */}
          {hasReservation && (
            <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl text-center mb-5 border border-red-100">
              Ya tienes una reservación registrada
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FECHA Y MONTO */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Fecha de ingreso *</label>
                <DatePicker
                  selected={form.fecha_ingreso ? new Date(form.fecha_ingreso + "T12:00:00") : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, '0');
                      const dd = String(date.getDate()).padStart(2, '0');
                      setForm({ ...form, fecha_ingreso: `${yyyy}-${mm}-${dd}` });
                    }
                  }}
                  minDate={new Date()}
                  disabled={hasReservation}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecciona una fecha"
                  className="w-full px-4 py-3 border border-gray-200 text-gray-700 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 focus:bg-white transition cursor-pointer"
                  wrapperClassName="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Monto a pagar</label>
                <input
                  value={monto ? `$${monto} MXN` : "Selecciona un tipo"}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-100 text-gray-700 font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* TIPO */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Tipo de Habitación *</label>

              <div className="grid grid-cols-2 gap-3">

                <div
                  onClick={() => !hasReservation && setTipo("individual")}
                  className={`border-2 p-3 rounded-2xl cursor-pointer text-center transition-all ${tipo === "individual" ? "border-green-500 bg-green-50/50 shadow-sm" : "border-gray-100 hover:border-gray-200"
                    } ${hasReservation && "opacity-50 cursor-not-allowed"}`}
                >
                  <img src={individualImg} className="w-12 mx-auto mb-1.5 opacity-80" />
                  <p className="font-bold text-gray-800 text-sm">Individual</p>
                  <p className="text-xs text-gray-500">Solo para ti</p>
                </div>

                <div
                  onClick={() => !hasReservation && setTipo("compartida")}
                  className={`border-2 p-3 rounded-2xl cursor-pointer text-center transition-all ${tipo === "compartida" ? "border-green-500 bg-green-50/50 shadow-sm" : "border-gray-100 hover:border-gray-200"
                    } ${hasReservation && "opacity-50 cursor-not-allowed"}`}
                >
                  <img src={compartidaImg} className="w-12 mx-auto mb-1.5 opacity-80" />
                  <p className="font-bold text-gray-800 text-sm">Compartida</p>
                  <p className="text-xs text-gray-500">2-6 estudiantes</p>
                </div>

              </div>
            </div>

            {/* SELECTS */}
            <div className="grid md:grid-cols-2 gap-3">

              {/* PISO */}
              <div className="relative">
                <CustomDropdown 
                  options={Object.keys(habitacionesPorPiso).sort().map((pisoNum) => ({
                    value: pisoNum,
                    label: `Piso ${pisoNum}`,
                  }))}
                  value={form.piso}
                  onChange={(val: string) => {
                    setForm({ ...form, piso: val, habitacion: "" });
                  }}
                  placeholder="Selecciona un piso"
                  disabled={hasReservation}
                />
              </div>

              {/* HABITACIÓN */}
              <div className="relative">
                <CustomDropdown 
                  options={
                    form.piso
                      ? (habitacionesPorPiso[form.piso] || []).map((hab: string) => {
                          const isOccupied = occupiedRooms
                            .map((r: any) => String(r))
                            .includes(String(hab));
                          return {
                            value: hab,
                            label: isOccupied ? `Habitación ${hab} (Ocupada)` : `Habitación ${hab}`,
                            disabled: isOccupied
                          };
                        })
                      : []
                  }
                  value={form.habitacion}
                  onChange={(val: string) => {
                    setForm({ ...form, habitacion: val });
                  }}
                  placeholder={form.piso ? "Selecciona una habitación" : "Primero selecciona un piso"}
                  disabled={!form.piso || hasReservation}
                />
              </div>

            </div>

            {/* MENSAJE GENERAL */}
            {form.piso && occupiedRooms.length > 0 && (
              <p className="text-yellow-600 text-xs mt-1 italic">
                Las habitaciones marcadas como "ocupadas" no estarán disponibles para reservar.
              </p>
            )}

            {/* 🔴 MENSAJE ESPECÍFICO */}
            {form.habitacion && occupiedRooms.includes(form.habitacion) && (
              <p className="text-red-500 text-xs mt-1">
                Esta habitación ya está ocupada. Selecciona otra.
              </p>
            )}



            {/* MENSAJES */}
            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>
            )}

            {success && (
              <p className="text-green-700 text-sm font-semibold text-center bg-green-50 p-2 rounded-lg border border-green-100">{success}</p>
            )}

            {/* BOTÓN */}
            <button
              disabled={hasReservation}
              className={`w-full py-3.5 rounded-2xl font-bold text-white transition-all shadow-md focus:ring-4 focus:ring-green-500/30 ${hasReservation
                ? "bg-gray-400 cursor-not-allowed shadow-none"
                : "bg-green-600 hover:bg-green-700 hover:-translate-y-0.5"
                }`}
            >
              Confirmar Reservación
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Reservation; 