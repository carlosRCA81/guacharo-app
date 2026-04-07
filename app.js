// ==========================================
// CONFIGURACIÓN ANALIZADOR CRCA
// ==========================================
const CONFIG = {
    URL: "https://iyvbufxkgycqcmdeclsf.supabase.co",
    KEY: "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dmJ1ZnhrZ3ljcWNtZGVjbHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTE5NTMsImV4cCI6MjA4OTk2Nzk1M30.Rt6XfnsvWu1Efwb3-fVOyHCmz7aCJXHpIJxaxGzuThw",
    CLAVE: "2026" 
};

// ==========================================
// ACCESO BLINDADO
// ==========================================
function login() {
    const acceso = prompt("SISTEMA CRCA BLINDADO - CLAVE:");
    if (acceso === CONFIG.CLAVE) {
        // Establecer fecha de hoy por defecto en el input
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fecha_registro').value = hoy;
        consultarAlgoritmo();
    } else {
        document.body.innerHTML = "<div style='background:black; color:red; height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif;'><h1>ACCESO DENEGADO</h1></div>";
    }
}

// ==========================================
// GUARDAR EN SUPABASE
// ==========================================
async function guardarResultado() {
    const fecha = document.getElementById('fecha_registro').value;
    const hora = document.getElementById('hora').value;
    const numero = document.getElementById('numero').value.trim();

    if (!numero || !fecha) return alert("Error: Falta Fecha o Número");

    try {
        const res = await fetch(`${CONFIG.URL}/rest/v1/resultados_crca`, {
            method: 'POST',
            headers: {
                'apikey': CONFIG.KEY,
                'Authorization': `Bearer ${CONFIG.KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ fecha: fecha, hora: hora, numero: numero })
        });

        if (res.ok) {
            document.getElementById('numero').value = '';
            consultarAlgoritmo();
        } else {
            alert("Error al registrar");
        }
    } catch (e) {
        alert("Falla de Conexión");
    }
}

// ==========================================
// CONSULTAR ALGORITMO Y RESALTAR
// ==========================================
async function consultarAlgoritmo() {
    try {
        const res = await fetch(`${CONFIG.URL}/rest/v1/vista_analisis_crca?order=fecha.desc,hora.desc&limit=20`, {
            headers: { 'apikey': CONFIG.KEY, 'Authorization': `Bearer ${CONFIG.KEY}` }
        });
        const datos = await res.json();
        renderizarTabla(datos);
        ejecutarRadar(datos);
    } catch (e) { console.log(e); }
}

function renderizarTabla(datos) {
    const tbody = document.getElementById('tabla-resultados');
    tbody.innerHTML = '';
    
    datos.forEach(row => {
        const resaltado = row.numero === '75' ? 'bg-yellow-900/40 text-yellow-400 font-bold' : 'border-t border-slate-700';
        tbody.innerHTML += `
            <tr class="${resaltado}">
                <td class="p-3">${row.fecha.split('-').reverse().join('/')}</td>
                <td class="p-3">${row.hora.substring(0,5)}</td>
                <td class="p-3 text-center text-lg">${row.numero}</td>
                <td class="p-3">${row.animal} <span class="text-[9px] opacity-40 uppercase">[${row.elemento}]</span></td>
            </tr>
        `;
    });
}

function ejecutarRadar(datos) {
    const radar = document.getElementById('status-75');
    const ultimaVez = datos.findIndex(d => d.numero === '75');

    if (ultimaVez === -1) {
        radar.innerHTML = "⚠️ ALERTA: Guácharo (75) no detectado en el ciclo actual. ALTA PROBABILIDAD.";
        radar.className = "text-sm mt-1 text-red-400 font-black animate-pulse";
    } else if (ultimaVez === 0) {
        radar.innerHTML = "OBJETIVO CAPTURADO: 75 salió en el último sorteo. Reiniciando ciclo.";
        radar.className = "text-sm mt-1 text-green-400 font-bold";
    } else {
        radar.innerHTML = `ANÁLISIS: El 75 tiene ${ultimaVez} sorteos sin salir. Monitoreando vecinos...`;
        radar.className = "text-sm mt-1 text-yellow-500";
    }
}

function limpiarCampos() {
    document.getElementById('numero').value = '';
}

window.onload = login;
