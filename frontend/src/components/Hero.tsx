import departamento from "../assets/images/departament.webp";

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
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={departamento}
          alt="edificio"
          className="w-[350px] md:w-[500px] lg:w-[600px] drop-shadow-xl"
        />
      </div>
    </section>
  );
};

export default Hero;