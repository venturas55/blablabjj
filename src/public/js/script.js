/* $('.btn').click(function(e) {
    e.stopPropagation();
    console.log('clicked');
    console.log(e);
   return false;
  }); */


  function crearCinturon(color, grados, coloraux, id) {
    console.log("Dibujando cinturon: " + color + " " + grados + " en " + id + " es niño " + coloraux);

    let beltContainer = document.getElementById("belt-container" + id);
    console.log(beltContainer);
    // Crear el div del cinturón
    let belt = document.createElement('div');
    belt.classList.add('belt', color); // Añadir la clase del color al cinturón

    

    // Añadir las rayas de grados al cinturón
    for (let i = 0; i < grados; i++) {
        let stripe = document.createElement('div');
        stripe.classList.add('stripe');
        belt.appendChild(stripe);
    }

    //Añadir la banda final
    let finalband = document.createElement('div');
    finalband.classList.add('final-band');
    belt.appendChild(finalband);

    // Si el cinturón es negro, aplicar la banda roja
    if (color === 'negro') {
        finalband.classList.add('final-band-red');
    }
    if (coloraux) {
        let alongband = document.createElement('div');
        if (coloraux == 'blanco') {
            alongband.classList.add('along-band-blanco');
        } else {
            alongband.classList.add('along-band-negro');
        }
        belt.appendChild(alongband);

    }
    // Añadir el cinturón al contenedor
    beltContainer.appendChild(belt);
}

document.addEventListener("DOMContentLoaded", () => {
    // Selecciona todos los elementos renderizados con clase "asistente"
    const asistentes = document.querySelectorAll('.asistente');

    // Itera sobre cada asistente para extraer atributos y llamar a la función
    asistentes.forEach(asistente => {
        const colores = asistente.dataset.color.split("-");;         // Extrae el color
        var color = colores[0];
        var coloraux = colores[1];
        const grados = asistente.dataset.grados.split('I').length - 1; // Extrae los grados como número
        const id = asistente.dataset.id;               // Extrae el ID único

        console.log(color+ " "+ grados+ " "+ coloraux+ " "+ id);
        crearCinturon(color, grados, coloraux, id);
    });
});