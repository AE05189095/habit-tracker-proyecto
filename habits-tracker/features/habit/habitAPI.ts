export const fetchHabits = async (token: string) => {
  console.log("📢 Token enviado en fetchHabits:", token); // DEBUG
  
  const response = await fetch("http://localhost:3001/habits", {
      headers: {
          Authorization: `Bearer ${token}`, 
      }
  });

  if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error en fetchHabits:", response.status, errorText); // DEBUG
      throw new Error("Failed to fetch habits");
  }
  return response.json();
};

export const fetchAddHabit = async (token: string, title: string, description: string) => {
  console.log("📢 Token enviado en fetchAddHabit:", token); // DEBUG
  
  const response = await fetch("http://localhost:3001/habits", {
      method: 'POST',
      headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          title,
          description,
      })
  });

  if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error en fetchAddHabit:", response.status, errorText); // DEBUG
      throw new Error("Failed to add habit");
  }
  return response.json();
};
