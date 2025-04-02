"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHabitsThunk } from "@/features/habit/habitSlice";
import { fetchRegisterUserThunk, fetchLoginUserThunk, addUser } from "@/features/user/userSlice";
import { AppState, AppDispatch } from "@/Redux/store";
import Habits from "@/app/habits";
import { getCookie } from "cookies-next";

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const habits = useSelector((state: AppState) => state.habit.habits);
    const user = useSelector((state: AppState) => state.user.user);
    const error = useSelector((state: AppState) => state.user.error);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const token = getCookie("habitToken");
        if (token) {
            console.log("Token encontrado en cookies:", token);
            dispatch(addUser(token));  // Guardar el token en el estado
        }
        if (user && user.token) {
            console.log("Usuario logueado, cargando hábitos:", user);
            dispatch(fetchHabitsThunk(user.token));  // Usar user.token para enviar el token
        }
    }, [dispatch, user]);

    const handleLogin = async () => { // Marcar como async
        console.log("Intentando iniciar sesión con:", { username, password });
        try {
            await dispatch(fetchLoginUserThunk({ username, password }));
        } catch (err) {
            console.error("Error en handleLogin:", err); // Depuración de errores
        }
    };

    const handleRegister = async () => { // Marcar como async
        console.log("Intentando registrar usuario:", { username, password });
        try {
            await dispatch(fetchRegisterUserThunk({ username, password }));
            alert("Usuario registrado correctamente");
        } catch (err) {
            console.error("Error en handleRegister:", err); // Depuración de errores
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-8 pb-20 sm:px-28 font-sans bg-gray-100">
            {!user && (
                <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Login / Register</h1>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                            Login
                        </button>

                        <button onClick={handleRegister} className="px-4 py-2 bg-green-500 text-white rounded-md">
                            Register
                        </button>
                    </div>
                    {error && <p className="text-red-500 mt-2">Error: {error}</p>}
                </div>
            )}
            {user && <Habits habits={habits} />}
        </div>
    );
}
