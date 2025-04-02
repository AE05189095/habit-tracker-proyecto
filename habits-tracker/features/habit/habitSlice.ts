import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHabits, fetchAddHabit } from '../habit/habitAPI';

interface Habit {
    _id: string;
    title: string;
    description: string;
    createdAT: string;
    days: number;
    lastDone: string | null;
    lastUpdate: string;
}

interface HabitState {
    habits: Habit[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: HabitState = {
    habits: [],
    status: 'idle',
    error: null,
};

export const fetchHabitsThunk = createAsyncThunk(
    'habits/fetchHabits',
    async (token: string) => {
        const response = await fetchHabits(token);
        return response;
    }
);

export const fetchAddHabitThunk = createAsyncThunk(
    'habits/fetchAddHabit',
    async ({ token, title, description }: { token: string, title: string, description: string }) => {
        const response = await fetchAddHabit(token, title, description);
        return response;
    }
);

export const markAsDoneThunk = createAsyncThunk(
    'habits/markAsDone',
    async ({ habitId }: { habitId: string }) => {
        return { habitId };
    }
);

const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHabitsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchHabitsThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.habits = action.payload;
            })
            .addCase(fetchHabitsThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Error desconocido';
            })
            .addCase(fetchAddHabitThunk.fulfilled, (state, action) => {
                state.habits.push(action.payload);
            })
            .addCase(markAsDoneThunk.fulfilled, (state, action) => {
                state.habits = state.habits.map((habit) => {
                    if (habit._id === action.payload.habitId) {
                        habit.lastDone = new Date().toISOString();
                    }
                    return habit;
                });
            });
    }
});

export default habitSlice.reducer;


