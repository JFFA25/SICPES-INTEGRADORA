import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';

const Sitemap = () => {
    useEffect(() => {
        document.title = "Mapa del Sitio - SICPES";
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-grow max-w-4xl mx-auto w-full px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Mapa del Sitio</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* General */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-green-700 mb-4 border-b pb-2">Páginas Generales</h2>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-700 hover:text-green-600 hover:underline">Inicio</Link></li>
                            <li><Link to="/contact" className="text-gray-700 hover:text-green-600 hover:underline">Contacto</Link></li>
                            <li><Link to="/login" className="text-gray-700 hover:text-green-600 hover:underline">Iniciar Sesión</Link></li>
                            <li><Link to="/register" className="text-gray-700 hover:text-green-600 hover:underline">Registrarse</Link></li>
                            <li><Link to="/forgot-password" className="text-gray-700 hover:text-green-600 hover:underline">Recuperar Contraseña</Link></li>
                        </ul>
                    </div>

                    {/* Usuarios */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-green-700 mb-4 border-b pb-2">Portal de Usuarios</h2>
                        <ul className="space-y-3">
                            <li><Link to="/dashboard" className="text-gray-700 hover:text-green-600 hover:underline">Dashboard</Link></li>
                            <li><Link to="/reservation" className="text-gray-700 hover:text-green-600 hover:underline">Hacer Reservación</Link></li>
                            <li><Link to="/payments" className="text-gray-700 hover:text-green-600 hover:underline">Pagos</Link></li>
                        </ul>
                    </div>

                    {/* Administradores */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
                        <h2 className="text-xl font-semibold text-green-700 mb-4 border-b pb-2">Portal de Administración</h2>
                        <ul className="space-y-3 md:columns-2">
                            <li><Link to="/admin/reservations" className="text-gray-700 hover:text-green-600 hover:underline">Gestión de Reservaciones</Link></li>
                            <li><Link to="/admin/payments" className="text-gray-700 hover:text-green-600 hover:underline">Gestión de Pagos</Link></li>
                            <li><Link to="/admin/settings" className="text-gray-700 hover:text-green-600 hover:underline">Configuración del Sistema</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Sitemap;
