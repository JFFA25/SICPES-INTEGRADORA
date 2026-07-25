import { Link, useNavigate } from "react-router-dom";
import icon from "../assets/images/icon.png";

type UserSection = "dashboard" | "reservation" | "payments";

const LINKS: { key: UserSection; to: string; label: string }[] = [
  { key: "dashboard", to: "/dashboard", label: "Inicio" },
  { key: "reservation", to: "/reservation", label: "Peticiones" },
  { key: "payments", to: "/payments", label: "Pagos" },
];

interface UserNavbarProps {
  active: UserSection;
}

// Barra de navegación compartida del área de usuario - antes este markup
// estaba copiado y pegado (casi idéntico) en Dashboard.tsx, Reservation.tsx y Payments.tsx.
const UserNavbar = ({ active }: UserNavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  return (
    <nav className="bg-green-600 text-white px-8 py-4 flex justify-between items-center shadow-md z-10">
      <Link to="/dashboard" className="flex items-center gap-3 font-bold text-lg tracking-wide">
        <img src={icon} alt="logo" className="w-8 drop-shadow-sm" />
        SICPES
      </Link>

      <div className="flex gap-8 items-center text-sm font-medium">
        {LINKS.map((link) => (
          <Link
            key={link.key}
            to={link.to}
            className={
              active === link.key
                ? "text-green-100 border-b-2 border-white pb-1"
                : "hover:text-green-200 transition"
            }
          >
            {link.label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="bg-gray-900 border border-gray-800 text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition shadow-sm ml-2"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default UserNavbar;
