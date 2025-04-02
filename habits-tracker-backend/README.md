Habit Tracker - Aplicación de Hábitos

Esta aplicación forma parte del Proyecto del curso Programación avanzada por parte del instituto von neumann, su función será ayudar a los usuarios a tener control sobre sus hábitos diarios, está basado en el libro "Hábitos Atómicos" de James Clear.

¿Qué hace?

Crear hábitos: Permite al usuario crear habitos a seguir.
Marcar hábitos: Cada día el usuario podrá marcar los hábitos que completó.
Ver Proreso: Se mostrará una barrá que cambiará de rojo a verde cuando el hábito este completado
Cuentas: Se podrán crear cuentas y agregar hábitos.

¿Cómo funciona?

Las herramientas que se utilizan para su funcionamiento son Next.js, Express.js y MongoDB

¿Cómo se usa?
1. Descargar el código - Abre la terminal y escribe el siguiente código para clonar el repositorio
            git clone https://github.com/AE05189095/habit-tracker.git
2. Instalación - Escribe en la consola
            cd habit-tracker y luego npm install
3. Conectar base de datos 
    - Necesitas una cuenta en MongoDB Atrlas.
    - Debes copiar la cadena de conexión de tu base de datos
    - Crear un archivo llamado .env y escribe MONGODB_URI=tu_cadena_de_conexion
4. Iniciar la app:
    - Escribe npm run dev
    - En tu navegador escribe http://localhost:3001
