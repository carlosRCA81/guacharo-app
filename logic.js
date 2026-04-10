/* LÓGICA DE DATOS - CONEXIÓN OHIO */

// Función principal de registro corregida
async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevoRegistro = { fecha, hora, num, animal, tipo };

    // Actualización visual inmediata
    const existeIdx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if (existeIdx !== -1) historial.splice(existeIdx, 1);
    historial.push(nuevoRegistro);
    actualizarInterfaz();

    // ENVÍO AL SERVIDOR LARAVEL CLOUD
    try {
        const respuesta = await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/guardar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(nuevoRegistro)
        });

        if (respuesta.ok) {
            console.log("✅ Datos blindados en la nube");
        }
    } catch (error) {
        console.error("⚠️ Error de red o servidor en hibernación");
    }
}
