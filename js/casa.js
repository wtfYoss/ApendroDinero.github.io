function guardarNombre() {

    let nombre = document.getElementById("nombre").value;

    if (nombre === "") {
        alert("Escribe tu nombre primero");
        return;
    }

    // Guardar nombre
    localStorage.setItem("nombreJugador", nombre);

    // Redireccionar
    window.location.href = "casa.html";
}
let nombre = localStorage.getItem("nombreJugador");

if(nombre){
    document.getElementById("nombreJugador").innerText = nombre;
}

// Ir al nivel
function irNivel(ruta){

    hablar("Entrando al nivel uno");

    setTimeout(()=>{
        window.location.href = ruta;
    },1200);
}

// Sonido del menú
function sonidoMenu(seccion){
    hablar("Has seleccionado " + seccion);
}

// Función de voz
function hablar(texto){
    let voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-MX";
    speechSynthesis.speak(voz);
}