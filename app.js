// ==========================================
// CONFIGURACIÓN GLOBAL - ANALIZADOR CRCA
// ==========================================
const CONFIG = {
    URL: "https://iyvbufxkgycqcmdeclsf.supabase.co",
    KEY: "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dmJ1ZnhrZ3ljcWNtZGVjbHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTE5NTMsImV4cCI6MjA4OTk2Nzk1M30.Rt6XfnsvWu1Efwb3-fVOyHCmz7aCJXHpIJxaxGzuThw",
    CLAVE_MAESTRA: "2026" // Esta es la clave para entrar a tu web
};

// ==========================================
// SISTEMA DE SEGURIDAD (LOGIN)
// ==========================================
function verificarAcceso() {
    const pass = prompt("SISTEMA BLINDADO CRCA - INGRESE CLAVE:");
    if (pass === CONFIG.CLAVE_MAESTRA) {
        console.log("Acceso concedido");
        consultarAlgoritmo();
    } else {
        alert("Clave Incorrecta.");
        document.body.innerHTML = "<div style='color:white; background:black; height:100vh; display:flex; justify-content:center; align-items:center; font-family:sans-serif;'><h1>ACCESO DENEGADO</h1></div>";
    }
}

// ==========================================
// FUNCIÓN PARA GUARDAR RESULTADOS
// ==========================================
async function guardarResultado() {
    const numInput = document.getElementById('numero');
    const horaInput = document.getElementById('hora');
    
    const numero = numInput.value.trim();
    const hora = horaInput.value;

    if (!numero) {
        alert("Por favor, introduce un número (00, 0, 1...75)");
        return;
    }

    try {
        const response = await fetch(`${CONFIG.URL}/rest/v1/resultados_crca`, {
            method: 'POST',
            headers: {
                'apikey': CONFIG.KEY,
                'Authorization': `Bearer ${CONFIG.KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                numero: numero,
                hora: hora
            })
        });

        if (numero === '75') {
            alert("🎯 ¡EL GUÁCHARO CAPTURADO!");
        }

        if (response.ok) {
            numInput.value = ''; // Limpiar campo
            consultarAlgoritmo(); // Refrescar tabla
        } else {
            const errorData = await response.json();
            alert("Error al guardar: " + errorData.message);
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("Error de conexión con el servidor");
    }
}

// ==========================================
// LÓGICA DEL ALGORITMO Y VISUALIZACIÓN
// ==========================================
async function consultarAlgoritmo() {
    try {
        // Consultamos la vista que creamos en SQL
        const response = await fetch(`${CONFIG.URL}/rest/v1/vista_analisis_crca?order=id.desc&limit=15`, {
            headers: {
                'apikey': CONFIG.KEY,
                'Authorization': `Bearer ${CONFIG.KEY}`
            }
        });

        const datos = await response.json();
        actualizarTabla(datos);
        analizarProbabilidad(datos);
    } catch (error) {
        console.error("Error al consultar:", error);
    }
}

function actualizarTabla(datos) {
    const tabla = document.getElementById('tabla-resultados');
    tabla.innerHTML = '';

    if (datos.length === 0) {
        tabla.innerHTML = '<tr><td colspan="3" class="p-3 text-center text-slate-500">Sin datos hoy</td></tr>';
        return;
    }

    datos.forEach(row => {
        const esGuacharo = row.numero === '75';
        const colorFila = esGuacharo ? 'bg-yellow-900/50 text-yellow-300 font-bold' : 'border-t border-slate-700';
        
        tabla.innerHTML += `
            <tr class="${colorFila}">
                <td class="p-3">${row.hora}</td>
                <td class="p-3 text-center">${row.numero}</td>
                <td class="p-3">${row.animal || 'S/N'} <span class="text-[10px] opacity-40">(${row.elemento || '-'})</span></td>
            </tr>
        `;
    });
}

function analizarProbabilidad(datos) {
    const radar = document.getElementById('status-75');
    const salioReciente = datos.some(d => d.numero === '75');

    if (!salioReciente && datos.length >= 5) {
        radar.innerHTML = "⚠️ ALERTA: El Guácharo (75) está entrando en zona de calor.";
        radar.className = "text-sm mt-1 text-red-400 font-bold animate-pulse";
    } else if (salioReciente) {
        radar.innerHTML = "Análisis: Guácharo salió recientemente. Esperando nuevo ciclo.";
        radar.className = "text-sm mt-1 text-green-400";
    } else {
        radar.innerHTML = "Recopilando datos para el algoritmo CRCA...";
    }
}

// Botón de borrar (limpieza manual de campos)
function limpiarCampos() {
    document.getElementById('numero').value = '';
    console.log("Formulario reseteado");
}

// Iniciar al cargar la página
window.onload = verificarAcceso;
