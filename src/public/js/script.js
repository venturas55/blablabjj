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
    if (coloraux) {
        let alongband = document.createElement('div');
        if (coloraux == 'blanco') {
            alongband.classList.add('along-band-blanco');
        } else {
            alongband.classList.add('along-band-negro');
        }
        belt.appendChild(alongband);

    }

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
    // Añadir el cinturón al contenedor
    beltContainer.appendChild(belt);
}
document.addEventListener('DOMContentLoaded', () => {
    var cinturones = document.getElementsByClassName("itsbelt");
    console.log(cinturones);
});

/* var id = {{ id }};
var colores = document.getElementById("cinturon"+id).innerHTML.split("-");
var color = colores[0];
var aux = colores[1];
var grados = document.getElementById("grados"+id).innerHTML;
grados = grados.split('I').length - 1;
crearCinturon(color, grados, aux, id); */