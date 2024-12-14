document.addEventListener("DOMContentLoaded", () => {
    const calendarContainer = document.querySelector(".calendar-grid");
    const currentMonthElement = document.getElementById("currentMonth");
    const prevMonthButton = document.getElementById("prevMonth");
    const nextMonthButton = document.getElementById("nextMonth");

    let currentDate = new Date(); // Fecha actual
    //document.getElementById("diaseleccionado").innerHTML = "Dia " + currentDate.toLocaleString() ; 

    // Función para renderizar el calendario
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();

        // Obtener el primer y último día del mes visible
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Calcular inicio de la semana (lunes) para el primer día visible
        const startOfCalendar = new Date(firstDayOfMonth);
        startOfCalendar.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay() + 1);

        // Calcular fin de la semana (domingo) para el último día visible
        const endOfCalendar = new Date(lastDayOfMonth);
        endOfCalendar.setDate(lastDayOfMonth.getDate() + (7 - lastDayOfMonth.getDay()));

        // Actualizar encabezado con el mes y año actual
        currentMonthElement.textContent = `${date.toLocaleString("default", {
            month: "long",
        })} ${year}`;
        currentMonthElement.dataset.year = year;
        currentMonthElement.dataset.month = month + 1;

        // Generar días del calendario
        calendarContainer.innerHTML = ""; // Limpiar calendario previo
        let currentDay = new Date(startOfCalendar);

        while (currentDay <= endOfCalendar) {
            //console.log(currentDay.toLocaleDateString());
            const cell = document.createElement("div");
            cell.classList.add("calendar-cell");

            // Añadir clase para los días fuera del mes actual
            if (currentDay.getMonth() !== month) {
                cell.classList.add("calendar-cell--inactive");
            }

            cell.textContent = currentDay.getDate();
            cell.dataset.date = currentDay.toLocaleDateString(); // ISO para identificar el día
            calendarContainer.appendChild(cell);

            currentDay.setDate(currentDay.getDate() + 1);
        }
        attachEventListeners(); // Añadir eventos a los nuevos días
    }

    // Navegar al mes anterior
    prevMonthButton.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    // Navegar al mes siguiente
    nextMonthButton.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // Adjuntar eventos de clic a los días del calendario
    function attachEventListeners() {
        const calendarCells = document.querySelectorAll(".calendar-cell");

        calendarCells.forEach((cell) => {
            cell.addEventListener("click", () => {
                const selectedDate = cell.dataset.date; // Obtener la fecha seleccionada

                // Simular carga de clases para la semana seleccionada
                loadClassesForDay(selectedDate);
            });
        });
    }

    // Simular carga de clases para la semana
    function loadClassesForDay(selectedDate) {
        console.log(selectedDate);
        var clases = selectedDate.split("/");
        var clase = "dia" + clases[0] + clases[1] + clases[2];

        const cardBodies = document.querySelectorAll(".card");
        // Aplicar 'display: none' a cada elemento
        cardBodies.forEach((element) => {
            element.style.display = "none";
        });

        const cardVisibles = document.querySelectorAll(`.${clase}`);
        // Aplicar 'display: block' a los elementos clickados en el dia
        cardVisibles.forEach((element) => {
            element.style.display = "block";
        });

        document.getElementById("diaseleccionado").innerHTML = "Dia " + selectedDate;
    }


    // Inicializar calendario
    renderCalendar(currentDate);

    // Inicializar clases del día
    loadClassesForDay(currentDate.toLocaleDateString()); 
});
