const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 bg-gradient-to-r from-[#00b15d] to-[#007c3f] text-white min-h-[80vh]">
      
      {/* TEXTO */}
      <div className="max-w-xl mb-10 md:mb-0">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Encuentra tu espacio ideal <br />
          para vivir y estudiar.
        </h1>

        <p className="text-lg md:text-xl">
          Explora opciones de alojamiento, administra tu renta y mantente
          conectado con tu entorno estudiantil. Todo desde un solo lugar.
        </p>
      </div>

      {/* IMAGEN */}
      <div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/69/69524.png"
          alt="edificio"
          className="w-[250px] md:w-[350px] drop-shadow-lg"
        />
      </div>
    </section>
  );
};

export default Hero;