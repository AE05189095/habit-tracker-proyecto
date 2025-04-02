import { useSelector, useDispatch } from "react-redux";
import { markAsDoneThunk, fetchHabitsThunk, fetchAddHabitThunk } from "@/features/habit/habitSlice";
import { AppState, AppDispatch } from "../Redux/store";
import { useState } from 'react';
import { getCookie } from 'cookies-next';

interface Habit {
    _id: string;
    title: string;
    description: string;
    createdAT: string;
    days: number;
    lastDone: string | null;
    lastUpdate: string;
}

type HabitsProps = {
    habits: Habit[];
};

export default function Habits({ habits }: HabitsProps) {
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: AppState) => state.habit.status);
    const error = useSelector((state: AppState) => state.habit.error);
    const user = useSelector((state: AppState) => state.user.user);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [markedDone, setMarkedDone] = useState<{ [key: string]: boolean }>({}); // Estado local para rastrear hábitos marcados

    const token = user ? user.token : getCookie('habitToken') as string;

    if (!token) {
        console.error("Token no disponible o inválido");
        return <div>No tienes un token válido. Por favor, inicia sesión nuevamente.</div>;
    }

    const calculateProgress = (days: number): number => {
        if (isNaN(days) || days === null || days === undefined) {
            return 0;
        }
        return Math.min((days / 66) * 100, 100);
    };

    const handleAddHabit = () => {
        if (title && description && token) {
            dispatch(fetchAddHabitThunk({ token, title, description }))
                .catch(err => console.error("Error al agregar hábito:", err));
            setTitle('');
            setDescription('');
            dispatch(fetchHabitsThunk(token));
        }
    };

    const handleMarkAsDone = (habitId: string) => {
        if (token) {
            dispatch(markAsDoneThunk({ habitId }))
                .catch(err => console.error("Error al marcar hábito como hecho:", err));
            dispatch(fetchHabitsThunk(token));
            setMarkedDone({ ...markedDone, [habitId]: true }); // Actualizar el estado local
        }
    };

    return (
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
            <h1 className="text-2xl font-bold mb-4">My Habits</h1>
            <ul className="space-y-4">
                {habits.map((habit: Habit) => (
                    <li className="flex items-center justify-between" key={habit._id}>
                        <span className="text-black">{habit.title}</span>
                        <div className="flex items-center space-x-2">
                            <progress className="w-24" value={calculateProgress(habit.days)} max="100"></progress>
                            {markedDone[habit._id] ? (
                                <span className="text-green-500">Already marked as done!</span> // Cambio aquí
                            ) : (
                                <button
                                    className="px-2 py-1 text-sm text-white bg-blue-500 rounded"
                                    onClick={() => handleMarkAsDone(habit._id)}
                                >
                                    {status === "loading" ? "Processing" : "Mark as Done"}
                                </button>
                            )}
                            {error && <span className="text-red-500">{error}</span>}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-black">Add New Habit</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                </div>
                <button
                    onClick={handleAddHabit}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                    Add Habit
                </button>
            </div>
        </div>
    );
}