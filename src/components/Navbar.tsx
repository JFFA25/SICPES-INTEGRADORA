const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-gray-100 shadow-sm">
      
      {/* Logo */}
      <h1 className="text-xl font-bold text-green-700">SICPES</h1>

      {/* Links */}
      <div className="flex items-center gap-6 text-gray-700">
        <a href="#" className="hover:text-green-700 transition">Inicio</a>
        <a href="#" className="hover:text-green-700 transition">Contacto</a>
        <a href="#" className="hover:text-green-700 transition">Regístrate</a>

        <button className="border border-green-700 px-4 py-1 rounded-md hover:bg-green-700 hover:text-white transition">
          Iniciar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;