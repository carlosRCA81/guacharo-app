// ==========================================
// CONFIGURACIÓN ANALIZADOR CRCA
// ==========================================
const CONFIG = {
    URL: "https://iyvbufxkgycqcmdeclsf.supabase.co",
    // Llave verificada sin espacios ni errores de copia
    KEY: "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dmJ1ZnhrZ3ljcWNtZGVjbHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTE5NTMsImV4cCI6MjA4OTk2Nzk1M30.Rt6XfnsvWu1Efwb3-fVOyHCmz7aCJXHpIJxaxGzuThw",
    CLAVE: "2026" 
};

// ==========================================
// ACCESO AL SISTEMA
// ==========================================
function login() {
    const acceso = prompt("SISTEMA CRCA BLINDADO - CLAVE:");
    if (acceso === CONFIG.CLAVE) {
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fecha_registro').value = hoy;
        consultarAlgoritmo();
    } else {
        alert("Clave incorrecta.");
        document.body.innerHTML = "<h1 style='color:red; text-align:center;'>ACCESO DENEGADO</h1>";
    }
}

// ==========================================
// GUARDAR RESULTADO
// ==========================================
async function guardarResultado() {
    const fecha = document.getElementById('fecha_registro').value;
    const hora = document.getElementById('hora').value;
    const numero = document.getElementById('numero').value.trim();

    if (!numero || !fecha) return alert("Falta Fecha o Número");

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
            const err = await res.json();
            alert("Error del Sistema: " + err.message);
        }
    } catch (e) {
        alert("Falla de Conexión");
    }
}

// ==========================================
// CONSULTAR Y RENDERIZAR
// ==========================================
async function consultarAlgoritmo() {
    try {
        const res = await fetch(`${CONFIG.URL}/rest/v1/vista_analisis_crca?order=fecha.desc,hora.desc&limit=20`, {
            headers: { 'apikey': CONFIG.KEY, 'Authorization': `Bearer ${CONFIG.KEY}` }
        });
        const datos = await res.json();
        
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
        
        ejecutarRadar(datos);
    } catch (e) { console.error(e); }
}

function ejecutarRadar(datos) {
    const radar = document.getElementById('status-75');
    const index = datos.findIndex(d => d.numero === '75');
    if (index === -1) {
        radar.innerHTML = "⚠️ ALERTA: Guácharo (75) en zona de alta probabilidad.";
        radar.className = "text-sm mt-1 text-red-400 animate-pulse font-bold";
    } else {
        radar.innerHTML = `Análisis: El 75 tiene ${index} sorteos de retraso.`;
        radar.className = "text-sm mt-1 text-yellow-500";
    }
}

function limpiarCampos() { document.getElementById('numero').value = ''; }

window.onload = login;
