import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <h1 className="text-9xl font-extrabold text-green-600 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Página no encontrada</h2>
                <p className="text-gray-600 mb-8">
                    Lo sentimos, no pudimos encontrar la página que estás buscando. Es posible que el enlace sea incorrecto o que la página haya sido eliminada.
                </p>
                <div className="space-y-3">
                    <Link
                        to="/"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
