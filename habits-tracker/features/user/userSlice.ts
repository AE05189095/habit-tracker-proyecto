import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRegisterUser, fetchLoginUser } from "./userAPI";

interface UserThunk {
  username: string;
  password: string;
}

type User = {
  token: string;
};

type UserState = {
  user: User | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
  message: string | null;
};

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
  message: null
};

// Thunk para registrar un usuario
export const fetchRegisterUserThunk = createAsyncThunk<
  void,
  UserThunk,
  { rejectValue: string }
>("user/fetchRegisterUser", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await fetchRegisterUser(username, password);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Error desconocido en el registro.");
  }
});

// Thunk para hacer login
export const fetchLoginUserThunk = createAsyncThunk<
  string,
  UserThunk,
  { rejectValue: string }
>("user/fetchLoginUser", async ({ username, password }, { rejectWithValue }) => {
  try {
    const responseJson = await fetchLoginUser(username, password);
    if (responseJson.token) {
      return responseJson.token;
    } else {
      return rejectWithValue("No se recibió un token.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Error desconocido en el login.");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = { token: action.payload };  // Aseguramos que el token esté correctamente formateado
    },
    clearUser: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUserThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRegisterUserThunk.fulfilled, (state) => {
        state.status = "success";
        state.error = null;
        state.message = "Usuario registrado correctamente";
      })
      .addCase(fetchRegisterUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(fetchLoginUserThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLoginUserThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.user = { token: action.payload }; // Guardar el token al hacer login
        state.error = null;
        state.message = "Inicio de sesión exitoso";
      })
      .addCase(fetchLoginUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload as string;
        state.message = null;
      });
  },
});

export const { addUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
