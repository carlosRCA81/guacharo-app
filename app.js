// ==========================================
// CONFIGURACIÓN ANALIZADOR CRCA
// ==========================================
const CONFIG = {
    URL: "https://iyvbufxkgycqcmdeclsf.supabase.co",
    // Esta es tu API Key limpia de cualquier error de copia
    KEY: "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dmJ1ZnhrZ3ljcWNtZGVjbHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTE5NTMsImV4cCI6MjA4OTk2Nzk1M30.Rt6XfnsvWu1Efwb3-fVOyHCmz7aCJXHpIJxaxGzuThw",
    CLAVE_MAESTRA: "2026" 
};

// ==========================================
// CONTROL DE ACCESO
// ==========================================
function login() {
    const pass = prompt("SISTEMA CRCA - INGRESE CLAVE:");
    if (pass === CONFIG.CLAVE_MAESTRA) {
        // Establecer fecha por defecto (Día de hoy)
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fecha_registro').value = hoy;
        consultarAlgoritmo();
    } else {
        alert("Clave denegada.");
        document.body.innerHTML = "<div style='background:black; color:red; height:100vh; display:flex; align-items:center; justify-content:center;'><h1>BLOQUEADO</h1></div>";
    }
}

// ==========================================
// REGISTRO DE DATOS (ANOTAR)
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
                'apikey': CONFIG.KEY.trim(), // Limpia espacios accidentales
                'Authorization': `Bearer ${CONFIG.KEY.trim()}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ 
                fecha: fecha, 
                hora: hora, 
                numero: numero 
            })
        });

        if (res.ok) {
            document.getElementById('numero').value = '';
            consultarAlgoritmo();
        } else {
            const err = await res.json();
            alert("Fallo de API: " + err.message);
        }
    } catch (e) {
        alert("Error de conexión");
    }
}

// ==========================================
// CONSULTA Y RADAR DEL 75
// ==========================================
async function consultarAlgoritmo() {
    try {
        const res = await fetch(`${CONFIG.URL}/rest/v1/vista_analisis_crca?order=fecha.desc,hora.desc&limit=25`, {
            headers: { 
                'apikey': CONFIG.KEY.trim(), 
                'Authorization': `Bearer ${CONFIG.KEY.trim()}` 
            }
        });
        const datos = await res.json();
        
        const tbody = document.getElementById('tabla-resultados');
        tbody.innerHTML = '';
        
        datos.forEach(row => {
            const es75 = row.numero === '75';
            const clase = es75 ? 'bg-yellow-900/50 text-yellow-400 font-bold border-y border-yellow-500' : 'border-t border-slate-700';
            
            tbody.innerHTML += `
                <tr class="${clase}">
                    <td class="p-3 text-[10px]">${row.fecha.split('-').reverse().join('/')}</td>
                    <td class="p-3 font-bold">${row.hora.substring(0,5)}</td>
                    <td class="p-3 text-center text-lg">${row.numero}</td>
                    <td class="p-3">${row.animal} <span class="text-[8px] opacity-40 uppercase">[${row.elemento}]</span></td>
                </tr>
            `;
        });
        
        actualizarRadar(datos);
    } catch (e) { console.error("Error al cargar:", e); }
}

function actualizarRadar(datos) {
    const radar = document.getElementById('status-75');
    const index = datos.findIndex(d => d.numero === '75');
    
    if (index === -1) {
        radar.innerHTML = "⚠️ ALERTA: Guácharo (75) en zona de alta probabilidad.";
        radar.className = "text-sm mt-1 text-red-500 animate-pulse font-black";
    } else {
        radar.innerHTML = `Análisis: El 75 tiene ${index} sorteos de retraso.`;
        radar.className = "text-sm mt-1 text-yellow-500 font-medium";
    }
}

function limpiarCampos() { document.getElementById('numero').value = ''; }

window.onload = login;
