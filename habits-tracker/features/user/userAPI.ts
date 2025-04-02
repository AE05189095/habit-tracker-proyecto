// userAPI.ts

export const fetchRegisterUser = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Para enviar cookies si es necesario
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // Si la respuesta no es exitosa, lanzamos un error con el mensaje del backend
        throw new Error(errorData.error || 'Error desconocido');
      }
  
      const data = await response.json();
      return data; // Devolver los datos completos que se reciben del backend, como el token
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error; // Propagar el error para que sea capturado en el thunk
    }
  };
  
  export const fetchLoginUser = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Para enviar cookies si es necesario
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // Si la respuesta no es exitosa, lanzamos un error con el mensaje del backend
        throw new Error(errorData.error || 'Error desconocido');
      }
  
      const data = await response.json();
      return data; // Devolver los datos completos que se reciben del backend
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error; // Propagar el error para que sea capturado en el thunk
    }
  };
  