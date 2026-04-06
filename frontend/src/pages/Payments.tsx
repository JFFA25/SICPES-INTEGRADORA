import { useEffect } from "react";
import { Link } from "react-router-dom";
import icon from "../assets/images/icon.png";
const Payments = () => {

    useEffect(() => {
        document.title = "Pagos";
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">

            {/* NAVBAR */}
            <nav className="bg-green-600 text-white px-8 py-4 flex justify-between items-center">

                <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                    <img
                        src={icon}
                        alt="logo"
                        className="w-8"
                    />
                    SICPES
                </Link>

                <div className="flex gap-8 items-center">
                    <Link to="/dashboard" className="hover:underline">Inicio</Link>
                    <Link to="/reservation" className="hover:underline">Peticiones</Link>
                    <Link to="/payments" className="hover:underline">Pagos</Link>

                    <button className="bg-black px-4 py-1 rounded hover:bg-gray-800">
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            {/* CONTENIDO */}
            <div className="text-center mt-10 px-4">

                <h1 className="text-3xl font-bold text-gray-700">
                    Gestión de Pagos
                </h1>

                <p className="text-gray-500 mt-2">
                    Aquí puedes ver tus pagos pendientes y el historial de transacciones.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-5xl mx-auto">

                    {/* PRÓXIMO PAGO */}
                    <div className="bg-white p-6 rounded-xl shadow text-left">

                        <h3 className="font-bold text-gray-700 mb-4">
                            Tu Próximo Pago
                        </h3>

                        <p>
                            Monto Pendiente: <strong>$900.00</strong>
                        </p>

                        <p>
                            Fecha de Vencimiento: <strong>1/12/2025</strong>
                        </p>

                        <p>
                            Estado:{" "}
                            <strong className="text-yellow-600">
                                Pendiente de solicitud
                            </strong>
                        </p>

                        <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition shadow">
                            Solicitar Pago
                        </button>

                    </div>

                    {/* HISTORIAL */}
                    <div className="bg-white p-6 rounded-xl shadow text-left">

                        <h3 className="font-bold text-gray-700 mb-4">
                            Historial de Pagos
                        </h3>

                        <p className="text-gray-500 flex items-center gap-2">
                            No hay registros de pagos anteriores.
                        </p>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Payments;