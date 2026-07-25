interface StatCardProps {
  label: string;
  value: string | number;
  active?: boolean;
  onClick?: () => void;
}

// Tarjeta de métrica clicable: además de mostrar el conteo, funciona como filtro rápido
// (antes esta información y los botones de filtro estaban duplicados en la pantalla).
const StatCard = ({ label, value, active, onClick }: StatCardProps) => {
  const clickable = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl border p-6 shadow-sm transition-all duration-200 ${
        clickable ? "cursor-pointer hover:-translate-y-1" : ""
      } ${
        active
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
          : "border-slate-100 bg-white hover:-translate-y-1"
      }`}
    >
      <p className={`text-sm ${active ? "text-blue-600 font-medium" : "text-slate-500"}`}>
        {label}
      </p>
      <p className={`mt-4 text-3xl font-semibold ${active ? "text-blue-700" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;
