// ==========================================
// CONFIGURACIÓN ANALIZADOR CRCA
// ==========================================
const CONFIG = {
    URL: "https://iyvbufxkgycqcmdeclsf.supabase.co",
    // Tu llave publishable actualizada
    KEY: "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC", 
    CLAVE_SISTEMA: "2026" 
};

// ==========================================
// ACCESO Y CARGA INICIAL
// ==========================================
function login() {
    const pass = prompt("SISTEMA CRCA BLINDADO - INGRESE CLAVE:");
    if (pass === CONFIG.CLAVE_SISTEMA) {
        // Establecer fecha de hoy por defecto
        document.getElementById('fecha_registro').value = new Date().toISOString().split('T')[0];
        consultarAlgoritmo();
    } else {
        alert("Acceso denegado.");
        document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:50px;'>SISTEMA BLOQUEADO</h1>";
    }
}

// ==========================================
// FUNCIÓN PARA GUARDAR (ANOTAR)
// ==========================================
async function guardarResultado() {
    const fecha = document.getElementById('fecha_registro').value;
    const hora = document.getElementById('hora').value;
    const numero = document.getElementById('numero').value.trim();

    if (!numero || !fecha) return alert("Error: Indica Fecha y Número");

    try {
        const res = await fetch(`${CONFIG.URL}/rest/v1/resultados_crca`, {
            method: 'POST',
            headers: {
                'apikey': CONFIG.KEY,
                'Authorization': `Bearer ${CONFIG.KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ fecha, hora, numero })
        });

        if (res.ok) {
            document.getElementById('numero').value = '';
            alert("✅ Registro guardado con éxito");
            consultarAlgoritmo();
        } else {
            const err = await res.json();
            alert("Error de API: " + err.message);
        }
    } catch (e) {
        alert("Falla de conexión al servidor");
    }
}

// ==========================================
// CONSULTA HISTORIAL Y RADAR
// ==========================================
async function consultarAlgoritmo() {
    try {
        const res = await fetch(`${CONFIG.URL}/rest/v1/vista_analisis_crca?order=fecha.desc,hora.desc&limit=25`, {
            headers: { 
                'apikey': CONFIG.KEY, 
                'Authorization': `Bearer ${CONFIG.KEY}` 
            }
        });
        const datos = await res.json();
        
        const tbody = document.getElementById('tabla-resultados');
        tbody.innerHTML = '';
        
        datos.forEach(row => {
            const esGuacharo = row.numero === '75';
            const filaClase = esGuacharo ? 'bg-yellow-900/50 text-yellow-400 font-bold border-y border-yellow-600' : 'border-t border-slate-700';
            
            tbody.innerHTML += `
                <tr class="${filaClase}">
                    <td class="p-3 text-[10px]">${row.fecha.split('-').reverse().join('/')}</td>
                    <td class="p-3 font-medium">${row.hora.substring(0,5)}</td>
                    <td class="p-3 text-center text-lg">${row.numero}</td>
                    <td class="p-3 italic">${row.animal || '---'}</td>
                </tr>
            `;
        });
        
        actualizarRadar(datos);
    } catch (e) {
        console.error("Error al refrescar tabla");
    }
}

function actualizarRadar(datos) {
    const radar = document.getElementById('status-75');
    const index = datos.findIndex(d => d.numero === '75');
    
    if (index === -1) {
        radar.innerHTML = "⚠️ ALERTA: 75 EN ALTA PROBABILIDAD (No detectado en historial)";
        radar.className = "text-red-500 animate-pulse font-black text-sm mt-1";
    } else {
        radar.innerHTML = `ANÁLISIS: El 75 tiene ${index} sorteos de retraso.`;
        radar.className = "text-yellow-500 font-bold text-sm mt-1";
    }
}

function limpiarCampos() {
    document.getElementById('numero').value = '';
}

window.onload = login;
