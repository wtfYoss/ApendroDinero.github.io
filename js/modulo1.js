function verificar(valor) {
    let mensaje = document.getElementById("mensaje");
    
    // 🔊 Primero dice la cantidad seleccionada
    if (valor === 20) {
        hablar("Veinte pesos");
    }
    if (valor === 50) {
        hablar("Cincuenta pesos");
    }
    if (valor === 100) {
        hablar("Cien pesos");
    }

    if (valor === 20) {
        mensaje.innerHTML = "¡Muy bien! Es correcto 🎉";
        mensaje.style.color = "green";
        hablar("Muy bien. Es correcto.");
    } else {
        mensaje.innerHTML = "Casi lo logras, intentemos de nuevo";
        mensaje.style.color = "red";
        hablar("Casi lo logras, intentemos de nuevo");
    }
}

function leerTexto() {
    hablar("Observa bien la imagen. ¿Cuánto vale este billete?");
}

function hablar(texto) {
    let voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-MX";
    speechSynthesis.speak(voz);
}