import { Link, useLocation } from "react-router-dom";

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  reservation: "Reservaciones",
  payments: "Pagos",
  admin: "Administración",
  reservations: "Gestión de Reservaciones",
  settings: "Configuración",
  contact: "Contacto"
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0 || pathnames[0] === "") return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 py-2">
      <Link to="/" className="hover:text-green-600 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Inicio
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const name = routeNames[value] || value;

        return (
          <div key={to} className="flex items-center space-x-2">
            <span className="text-gray-400">/</span>
            {last ? (
              <span className="text-green-700 font-semibold">{name}</span>
            ) : (
              <Link to={to} className="hover:text-green-600">
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
