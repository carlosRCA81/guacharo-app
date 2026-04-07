// 1. CONFIGURACIÓN DEL SISTEMA (Pon tus datos aquí)
const CONFIG = {
    URL: "https://TU_PROYECTO.supabase.co", // Búscalo en Settings > API
    KEY: "TU_ANON_KEY_LARGA",              // Búscalo en Settings > API
    CLAVE_MAESTRA: "1234"                  // Cambia esto por tu clave secreta
};

// 2. FUNCIÓN DE BLOQUEO (Login)
function verificarAcceso() {
    const pass = prompt("SISTEMA BLINDADO CRCA - INGRESE CLAVE:");
    if (pass === CONFIG.CLAVE_MAESTRA) {
        alert("Acceso Concedido. Sistema V-GATE Online.");
        consultarAlgoritmo(); // Carga la data
    } else {
        alert("Clave Incorrecta. Bloqueando acceso.");
        document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:50px;'>ACCESO DENEGADO</h1>";
    }
}

// 3. FUNCIÓN PARA GUARDAR (Conexión Real)
async function guardarResultado() {
    const num = document.getElementById('numero').value.trim();
    const horaSorteo = document.getElementById('hora').value;

    if (!num) return alert("Indique el número ganador.");

    try {
        const response = await fetch(`${CONFIG.URL}/rest/v1/resultados_crca`, {
            method: 'POST',
            headers: {
                'apikey': CONFIG.KEY,
                'Authorization': `Bearer ${CONFIG.KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numero: num, hora: horaSorteo })
        });

        if (response.ok) {
            document.getElementById('numero').value = '';
            consultarAlgoritmo(); // Refresca la tabla automáticamente
        }
    } catch (err) {
        console.error("Error de conexión:", err);
    }
}

// Inicia el sistema pidiendo clave
window.onload = verificarAcceso;
