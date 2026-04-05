const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#003d1f] to-[#002814] text-white px-8 md:px-16 py-8">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* IZQUIERDA */}
        <div className="text-center md:text-left space-y-1">
          <p className="hover:underline cursor-pointer">Aviso de privacidad</p>
          <p className="hover:underline cursor-pointer">Términos de uso</p>
          <p className="hover:underline cursor-pointer">Contacto</p>
        </div>

        {/* CENTRO */}
        <div className="text-center">
          <h3 className="text-lg font-bold">SICPES</h3>
          <p className="text-sm opacity-80">
            © 2026 SICPES. Todos los derechos reservados.
          </p>
        </div>

        {/* DERECHA */}
        <div className="text-center md:text-right space-y-1">
          <p className="hover:underline cursor-pointer">Blog</p>
          <p className="hover:underline cursor-pointer">FAQs</p>
          <p className="hover:underline cursor-pointer">Soporte</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;