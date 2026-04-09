import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/session`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.rol === "admin") {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-gray-100 shadow-sm">

      {/* Logo */}
      <h1 className="text-xl font-bold text-green-700">SICPES</h1>

      {/* Links */}
      <div className="flex items-center gap-6 text-gray-700">
        <Link to="/">Inicio</Link>
        <Link to="/contact">Contacto</Link>
        {isAdmin && (
          <Link to="/admin/reservations" className="font-bold text-green-700">
            Panel Admin
          </Link>
        )}
        <Link to="/register">Regístrate</Link>
        <Link to="/login">
          <button className="border border-green-700 px-4 py-1.5 rounded-md hover:bg-green-700 hover:text-white transition">
            Iniciar sesión
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;