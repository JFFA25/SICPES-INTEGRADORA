import { Link, useNavigate } from "react-router-dom";
import icon from "../../assets/images/icon.ico";

type AdminSection = "reservations" | "payments" | "reports" | "settings";

const LINKS: { key: AdminSection; to: string; label: string }[] = [
  { key: "reservations", to: "/admin/reservations", label: "Reservaciones" },
  { key: "payments", to: "/admin/payments", label: "Pagos" },
  { key: "reports", to: "/admin/reports", label: "Reportes" },
  { key: "settings", to: "/admin/settings", label: "Configuración" },
];

interface AdminNavbarProps {
  active: AdminSection;
}

// Barra de navegación compartida del panel admin - antes este markup (~25 líneas)
// estaba copiado y pegado en AdminReservation.tsx, AdminPayments.tsx y AdminSettings.tsx.
const AdminNavbar = ({ active }: AdminNavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 shadow-sm transition-colors">
      <div className="flex items-center gap-3">
        <img src={icon} alt="SICPES" className="w-10 h-10 object-contain" />
        <span className="text-2xl font-bold text-blue-700 tracking-tight">SICPES</span>
      </div>

      <div className="flex items-center gap-2">
        {LINKS.map((link) => (
          <Link
            key={link.key}
            to={link.to}
            className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-sm transition ${
              active === link.key
                ? "bg-blue-50 text-blue-700"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 border border-pink-200 text-pink-500 font-semibold rounded-xl text-sm hover:bg-pink-50 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
