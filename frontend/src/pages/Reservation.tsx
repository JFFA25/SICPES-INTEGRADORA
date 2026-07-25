import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LoaderCircle } from "lucide-react";
import UserNavbar from "../components/UserNavbar";
import individualImg from "../assets/images/individual.png";
import compartidaImg from "../assets/images/compartido.png";
import DatePicker, { registerLocale } from "react-datepicker";

import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import Alert from "../components/Alert";
import { useTimedMessage } from "../hooks/useTimedMessage";

registerLocale("es", es);

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  label: string;
}

const CustomDropdown = ({ options, value, onChange, placeholder, disabled, label }: CustomDropdownProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setOpen(false);
    if (open) {
      setTimeout(() => document.addEventListener('click', handleClickOutside), 10);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (!disabled) {
            setOpen(!open);
          }
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        className={`w-full px-4 py-3 border text-left bg-gray-50 rounded-2xl flex justify-between items-center transition ${
          disabled ? "opacity-60 cursor-not-allowed border-gray-200" : "cursor-pointer border-gray-200 hover:border-green-300 focus:ring-2 focus:ring-green-500/50 bg-white"
        } ${open ? "border-green-500 ring-2 ring-green-500/50" : ""}`}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value ? options.find((o) => o.value === value)?.label : placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? "rotate-180 text-green-500" : ""}`} strokeWidth={2} />
      </div>

      {open && (
        <div role="listbox" className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-page-transition max-h-60 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No hay opciones</div>
          ) : (
            options.map((o) => (
              <div
                key={o.value}
                role="option"
                aria-selected={value === o.value}
                onClick={() => {
                  if (!o.disabled) {
                    onChange(o.value);
                    setOpen(false);
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
  const [hasReservation, setHasReservation] = useState(false);
  const [prices, setPrices] = useState({ individual: 2000, compartida: 1200 });
  const [occupiedRooms, setOccupiedRooms] = useState<string[]>([]);
  const [habitacionesPorPiso, setHabitacionesPorPiso] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message, showError, showSuccess, clear } = useTimedMessage();

  // CARGAR HABITACIONES DESDE API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`/api/rooms`);
        if (res.ok) {
          const data = await res.json();
          const rows = Array.isArray(data) ? data : data.lista || [];
          const formatted: Record<string, string[]> = {};
          rows.forEach((row: { piso: string; habitaciones: string }) => {
            formatted[row.piso] = row.habitaciones.split(', ');
          });
          setHabitacionesPorPiso(data.agrupado || formatted);
        } else {
          console.error("Error cargando habitaciones: respuesta inválida", res.status);
        }
      } catch (err) {
        console.error("Error cargando habitaciones:", err);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/settings`);
        if (res.ok) {
          const data = await res.json();
          setPrices({
            individual: data.precioIndividual || 2000,
            compartida: data.precioCompartida || 1200,
          });
        }
      } catch (err) {
        console.error("Error cargando precios de configuración:", err);
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
        const res = await fetch(`/api/reservation/me`, {
          credentials: "include",
        });

        const data = await res.json();

        if (data && !["finalizada", "cancelada", "rechazada"].includes(data.estado)) {
          setHasReservation(true);
        }

      } catch (err) {
        console.error("Error al verificar reservación:", err);
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
          `/api/reservation/occupied?piso=${form.piso}`
        );

        const data = await res.json();

        setOccupiedRooms(data || []);

      } catch (err) {
        console.error("Error al cargar habitaciones ocupadas:", err);
      }
    };

    fetchOccupied();
  }, [form.piso]);

  // VALIDACIÓN EXTRA
  useEffect(() => {
    if (form.habitacion && occupiedRooms.includes(form.habitacion)) {
      showError("Esta habitación ya está ocupada. Elige otra.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.habitacion, occupiedRooms]);

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasReservation) {
      showError("Ya tienes una reservación registrada");
      return;
    }

    if (!form.fecha_ingreso || !tipo || !form.piso || !form.habitacion) {
      showError("Todos los campos son obligatorios");
      return;
    }

    if (occupiedRooms.includes(form.habitacion)) {
      showError("Esta habitación ya está ocupada. Elige otra.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/reservation`, {
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
        showError(data.error || "No se pudo registrar la reservación.");
        setIsSubmitting(false);
        return;
      }

      showSuccess("Reservación enviada correctamente.");
      setHasReservation(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch {
      showError("Error al conectar con el servidor");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-page-transition transition-colors">

      {/* NAVBAR */}
      <UserNavbar active="reservation" />

      {/* CONTENIDO */}
      <div className="flex flex-col items-center px-4 py-8 max-w-5xl mx-auto w-full">

        <div className="bg-white w-full max-w-2xl p-6 md:p-8 rounded-2xl shadow-xl shadow-green-100/50 border border-green-50 transition-colors">

          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
            Registro de Estudiantes
          </h1>

          <p className="text-center text-gray-500 mb-6 text-sm">
            Completa el formulario para enviar una solicitud de cuarto.
          </p>

          {/* YA TIENE RESERVACIÓN */}
          {hasReservation && (
            <div className="mb-5">
              <Alert type="info">Ya tienes una reservación registrada.</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* FECHA Y MONTO */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reservation-fecha" className="text-sm font-semibold text-gray-700 block mb-1.5">Fecha de ingreso *</label>
                <DatePicker
                  id="reservation-fecha"
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
                <label htmlFor="reservation-monto" className="text-sm font-semibold text-gray-700 block mb-1.5">Monto a pagar</label>
                <input
                  id="reservation-monto"
                  value={monto ? `$${monto} MXN` : "Selecciona un tipo"}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-100 text-gray-700 font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* TIPO */}
            <div>
              <span className="text-sm font-semibold text-gray-700 block mb-2">Tipo de Habitación *</span>

              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Tipo de habitación">

                <div
                  role="radio"
                  aria-checked={tipo === "individual"}
                  tabIndex={hasReservation ? -1 : 0}
                  onClick={() => !hasReservation && setTipo("individual")}
                  onKeyDown={(e) => {
                    if (!hasReservation && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setTipo("individual");
                    }
                  }}
                  className={`border-2 p-3 rounded-2xl cursor-pointer text-center transition-all ${tipo === "individual" ? "border-green-500 bg-green-50/50 shadow-sm" : "border-gray-100 hover:border-gray-200"
                    } ${hasReservation && "opacity-50 cursor-not-allowed"}`}
                >
                  <img src={individualImg} alt="" className="w-12 mx-auto mb-1.5 opacity-80" />
                  <p className="font-bold text-gray-800 text-sm">Individual</p>
                  <p className="text-xs text-gray-500">Solo para ti</p>
                </div>

                <div
                  role="radio"
                  aria-checked={tipo === "compartida"}
                  tabIndex={hasReservation ? -1 : 0}
                  onClick={() => !hasReservation && setTipo("compartida")}
                  onKeyDown={(e) => {
                    if (!hasReservation && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setTipo("compartida");
                    }
                  }}
                  className={`border-2 p-3 rounded-2xl cursor-pointer text-center transition-all ${tipo === "compartida" ? "border-green-500 bg-green-50/50 shadow-sm" : "border-gray-100 hover:border-gray-200"
                    } ${hasReservation && "opacity-50 cursor-not-allowed"}`}
                >
                  <img src={compartidaImg} alt="" className="w-12 mx-auto mb-1.5 opacity-80" />
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
                  label="Piso"
                  options={Object.keys(habitacionesPorPiso).sort().map((pisoNum) => ({
                    value: pisoNum,
                    label: `Piso ${pisoNum}`,
                  }))}
                  value={form.piso}
                  onChange={(val) => {
                    setForm({ ...form, piso: val, habitacion: "" });
                  }}
                  placeholder="Selecciona un piso"
                  disabled={hasReservation}
                />
              </div>

              {/* HABITACIÓN */}
              <div className="relative">
                <CustomDropdown
                  label="Habitación"
                  options={
                    form.piso
                      ? (habitacionesPorPiso[form.piso] || []).map((hab) => {
                        const isOccupied = occupiedRooms
                          .map((r) => String(r))
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
                  onChange={(val) => {
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

            {/* MENSAJES */}
            {message && <Alert type={message.type} onClose={clear}>{message.text}</Alert>}

            {/* BOTÓN */}
            <button
              type="submit"
              disabled={hasReservation || isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white transition-all shadow-md focus:ring-4 focus:ring-green-500/30 ${hasReservation || isSubmitting
                ? "bg-gray-400 cursor-not-allowed shadow-none"
                : "bg-green-600 hover:bg-green-700 hover:-translate-y-0.5"
                }`}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" strokeWidth={2.25} />
                  Enviando...
                </>
              ) : (
                "Confirmar Reservación"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
