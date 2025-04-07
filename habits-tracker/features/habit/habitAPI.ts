const API_URL = 'https://habits-tracker-backend-eight.vercel.app/api';

export const fetchHabits = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/habits`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener hábitos');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error al obtener hábitos:', error);
    throw error;
  }
};

export const fetchAddHabit = async (token: string, title: string, description: string) => {
  try {
    const response = await fetch(`${API_URL}/habits`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al agregar hábito');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error al agregar hábito:', error);
    throw error;
  }
};