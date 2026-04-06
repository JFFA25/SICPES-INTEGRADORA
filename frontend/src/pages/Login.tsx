import { useEffect } from "react";
import { Link } from "react-router-dom";
import icon from "../assets/images/icon.ico";

const Login = () => {
    useEffect(() => {
        document.title = "Login";
    }, []);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">

                {/* ICONO */}
                <div className="flex justify-center mb-4">
                    <Link to="/">
                        <img
                            src={icon}
                            alt="icono"
                            className="w-16 cursor-pointer"
                        />
                    </Link>
                </div>

                {/* TÍTULO */}
                <h2 className="text-2xl font-bold text-green-600 mb-6">
                    Inicia sesión
                </h2>

                {/* FORM */}
                <form className="space-y-4 text-left">

                    {/* CORREO */}
                    <div>
                        <label className="text-green-600 font-medium">Correo</label>
                        <input
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                            className="w-full mt-1 px-4 py-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    {/* CONTRASEÑA */}
                    <div>
                        <label className="text-green-600 font-medium">Contraseña</label>
                        <input
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            className="w-full mt-1 px-4 py-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    {/* BOTÓN */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    >
                        Entrar
                    </button>
                </form>

                {/* LINKS */}
                <div className="mt-4 text-sm">
                    <p>
                        ¿No tienes una cuenta?{" "}
                        <Link to="/register" className="text-green-600 hover:underline">
                            Regístrate
                        </Link>
                    </p>

                    <p className="text-green-600 mt-2 cursor-pointer hover:underline">
                        ¿Olvidaste tu contraseña?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;