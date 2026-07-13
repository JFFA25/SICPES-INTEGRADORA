import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

const Contact = () => {
    // Coordenadas fijas de la Pensión (UT Xicotepec de Juárez)
    const PENSION_LAT = 20.237911;
    const PENSION_LON = -97.958499;

    // Estados para controlar los datos devueltos por la API de OSRM
    const [distance, setDistance] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);
    const [loadingRoute, setLoadingRoute] = useState(false);

    useEffect(() => {
        document.title = "Contacto";
    }, []);

    // FUNCIÓN DEL WEB SERVICE CORREGIDA MATEMÁTICAMENTE
    const calcularDistanciaAPension = () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        setLoadingRoute(true);

        navigator.geolocation.getCurrentPosition(async (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            try {
                // Consumo del Web Service de OSRM
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/foot/${userLon},${userLat};${PENSION_LON},${PENSION_LAT}?overview=false`
                );
                const data = await response.json();

                if (data.routes && data.routes.length > 0) {
                    const ruta = data.routes[0];
                    
                    // 1. Distancia exacta que devuelve el Web Service en kilómetros
                    const kilometrosNum = ruta.distance / 1000;
                    const kms = kilometrosNum.toFixed(2);
                    
                    // 2. CÁLCULO DE SEGURIDAD: 1 km a pie = ~12.5 minutos.
                    // Multiplicamos los km reales por 12.5 para sacar los minutos reales de caminata.
                    const totalMinutos = Math.round(kilometrosNum * 12.5);
                    
                    // 3. Formateo en horas y minutos si el trayecto es largo
                    let tiempoFormateado = "";
                    if (totalMinutos >= 60) {
                        const horas = Math.floor(totalMinutos / 60);
                        const minsRestantes = totalMinutos % 60;
                        tiempoFormateado = `${horas} h ${minsRestantes} min`;
                    } else {
                        tiempoFormateado = `${totalMinutos} min`;
                    }

                    setDistance(`${kms} km`);
                    setDuration(tiempoFormateado);
                } else {
                    alert("No se encontró una ruta factible a pie.");
                }
            } catch (error) {
                console.error("Error en el Web Service de mapas:", error);
            } finally {
                setLoadingRoute(false);
            }
        }, (error) => {
            alert("Por favor acepta los permisos de ubicación para calcular tu ruta.");
            setLoadingRoute(false);
        });
    };

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

            {/* BREADCRUMBS */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 mt-4">
                <Breadcrumbs />
            </div>

            {/* CONTENIDO */}
            <div className="grid md:grid-cols-2 gap-6 p-6 md:p-10 max-w-7xl mx-auto">

                {/* IZQUIERDA */}
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

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
                        <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" className="w-8 cursor-pointer hover:scale-110 transition-transform duration-200" alt="Facebook" />
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" className="w-8 cursor-pointer hover:scale-110 transition-transform duration-200" alt="Twitter" />
                        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" className="w-8 cursor-pointer hover:scale-110 transition-transform duration-200" alt="Instagram" />
                    </div>

                    {/* MAPA E INTERFAZ DE RUTA */}
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-green-700">
                            ¿Dónde estamos?
                        </h3>
                        <button 
                            onClick={calcularDistanciaAPension}
                            className="bg-green-700 text-white text-xs px-3 py-1.5 rounded-md hover:bg-green-800 transition shadow"
                            disabled={loadingRoute}
                        >
                            {loadingRoute ? "Calculando..." : "⚡ ¿Qué tan lejos estoy?"}
                        </button>
                    </div>

                    {/* Alerta dinámica con la respuesta del Web Service */}
                    {distance && duration && (
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-3 text-sm text-green-800">
                            📍 Te encuentras a <strong>{distance}</strong> de la pensión (Aprox. <strong>{duration} caminando</strong>).
                        </div>
                    )}

                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1316.8096511691192!2d-97.95849956359777!3d20.23791173649569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d08602491e37a1%3A0x4bbea4aede57d500!2sUniversidad%20Tecnol%C3%B3gica%20de%20Xicotepec%20de%20Ju%C3%A1rez!5e0!3m2!1ses!2smx!4v1749846297499!5m2!1ses!2smx"
                        className="w-full h-64 rounded-lg border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* DERECHA */}
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">

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