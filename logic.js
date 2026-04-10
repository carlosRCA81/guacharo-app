/* COPIA ESTE CÓDIGO EN TU ARCHIVO logic.js */

// ... (Mantén tu lista de animales y variables iniciales igual)

async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    
    // Registro local instantáneo
    const existeIdx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if (existeIdx !== -1) historial.splice(existeIdx, 1);
    const nuevoRegistro = { fecha, hora, num, animal, tipo };
    historial.push(nuevoRegistro);
    actualizarInterfaz();

    // ENVÍO AL SERVIDOR DE LARAVEL CLOUD
    try {
        const respuesta = await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/guardar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(nuevoRegistro)
        });

        if (respuesta.ok) console.log("✅ Respaldado en la nube");
    } catch (error) {
        console.error("⚠️ Error de conexión:", error);
    }
}

async function cargarHistorialRemoto() {
    try {
        const respuesta = await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/historial');
        const datos = await respuesta.json();
        if (datos) {
            historial = datos;
            actualizarInterfaz();
        }
    } catch (error) {
        console.log("Servidor en hibernación, usando datos locales");
    }
}
