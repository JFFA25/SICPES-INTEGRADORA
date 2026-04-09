import { useEffect } from "react";
import { Link } from "react-router-dom";

const Contact = () => {

    useEffect(() => {
        document.title = "Contacto";
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 animate-page-transition">

            {/* NAVBAR */}
            <div className="flex justify-between items-center px-10 py-4 bg-gray-100 shadow-sm">
                <Link to="/" className="text-xl font-bold text-green-700">
                    SICPES
                </Link>

                <div className="flex gap-6 items-center">
                    <Link to="/">Inicio</Link>
                    <Link to="/contact">Contacto</Link>
                    <Link to="/register">Regístrate</Link>
                    <Link to="/login">
                        <button className="border border-green-700 px-4 py-1 rounded hover:bg-green-700 hover:text-white transition">
                            Iniciar sesión
                        </button>
                    </Link>
                </div>
            </div>

            {/* CONTENIDO */}
            <div className="grid md:grid-cols-2 gap-6 p-6 md:p-10">

                {/* IZQUIERDA */}
                <div className="bg-white p-6 rounded-xl shadow">

                    <h2 className="text-xl font-bold text-green-700 mb-4">
                        Datos de contacto
                    </h2>

                    <p><strong>Email:</strong> sicpes.soporte@gmail.com</p>
                    <p><strong>Teléfono:</strong> 776-104-3056</p>

                    {/* REDES */}
                    <h3 className="text-lg font-bold text-green-700 mt-6 mb-2">
                        Redes Sociales
                    </h3>

                    <div className="flex gap-4 mb-6">
                        <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" className="w-8 cursor-pointer" />
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" className="w-8 cursor-pointer" />
                        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" className="w-8 cursor-pointer" />
                    </div>

                    {/* MAPA */}
                    <h3 className="text-lg font-bold text-green-700 mb-2">
                        ¿Dónde estamos?
                    </h3>

                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1316.8096511691192!2d-97.95849956359777!3d20.23791173649569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d08602491e37a1%3A0x4bbea4aede57d500!2sUniversidad%20Tecnol%C3%B3gica%20de%20Xicotepec%20de%20Ju%C3%A1rez!5e0!3m2!1ses!2smx!4v1749846297499!5m2!1ses!2smx"
                        className="w-full h-64 rounded-lg border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* DERECHA */}
                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <img
                        src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28"
                        alt="soporte"
                        className="w-full h-52 object-cover"
                    />

                    <div className="p-6 text-center">
                        <h3 className="text-xl font-bold text-green-700 mb-4">
                            Horarios de atención
                        </h3>

                        <p><strong>Lunes a Viernes:</strong> 9:00 AM - 6:00 PM</p>
                        <p><strong>Sábados:</strong> 10:00 AM - 2:00 PM</p>
                        <p><strong>Domingos:</strong> Cerrado</p>

                        <p className="mt-4">
                            <strong>Llámanos al:</strong> 776-104-3056
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;