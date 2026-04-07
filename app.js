// ==========================================
// CONFIGURACIÓN ANALIZADOR CRCA
// ==========================================
const CONFIG = {
    URL: "https://iyvbufxkgycqcmdeclsf.supabase.co",
    KEY: "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dmJ1ZnhrZ3ljcWNtZGVjbHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTE5NTMsImV4cCI6MjA4OTk2Nzk1M30.Rt6XfnsvWu1Efwb3-fVOyHCmz7aCJXHpIJxaxGzuThw",
    CLAVE: "2026" 
};

// ==========================================
// ACCESO BLINDADO (LOGIN)
// ==========================================
function login() {
    const acceso = prompt("SISTEMA CRCA BLINDADO - INGRESE CLAVE:");
    if (acceso === CONFIG.CLAVE) {
        console.log("Acceso concedido al sistema");
        // Ponemos la fecha de hoy por defecto para ahorrar tiempo
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fecha_registro').value = hoy;
        consultarAlgoritmo();
    } else {
        alert("Clave incorrecta. Acceso denegado.");
        document.body.innerHTML = "<div style='background:#0f172a; color:#ef4444; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif;'><h1>🚫 ACCESO DENEGADO</h1><p>Sistema V-GATE NEXUS Bloqueado</p></div>";
    }
}

// ==========================================
// GUARDAR EN SUPABASE (CON DETECTOR DE ERRORES)
// ==========================================
async function guardarResultado() {
    const fecha = document.getElementById('fecha_registro').value;
    const hora = document.getElementById('hora').value;
    const numero = document.getElementById('numero').value.trim();

    // Validación básica de entrada
    if (!numero || !fecha) {
        alert("Atención: Debes indicar la FECHA y el NÚMERO.");
        return;
    }

    try {
        const res = await fetch(`${CONFIG.URL}/rest/v1/resultados_crca`, {
            method: 'POST',
            headers: {
                'apikey': CONFIG.KEY,
                'Authorization': `Bearer ${CONFIG.KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation' 
            },
            body: JSON.stringify({ 
                fecha: fecha, 
                hora: hora, 
                numero: numero 
            })
        });

        const respuestaData = await res.json();

        if (res.ok) {
            console.log("Registro guardado con éxito");
            document.getElementById('numero').value = ''; // Limpia el cuadro
            if(numero === '75') alert("🎯 ¡GUÁCHARO (75) REGISTRADO EN EL SISTEMA!");
            consultarAlgoritmo(); // Refresca la tabla y el radar
        } else {
            // Si hay un error, el sistema te dirá exactamente qué pasó
            console.error("Error de Supabase:", respuestaData);
            alert("Error del Sistema: " + (respuestaData.message || "No se pudo registrar"));
        }
    } catch (e) {
        console.error("Error de conexión:", e);
        alert("Falla crítica de conexión con el servidor.");
    }
}

// ==========================================
// CONSULTA DE ALGORITMO Y VISUALIZACIÓN
// ==========================================
async function consultarAlgoritmo() {
    try {
        // Consultamos la vista de análisis cruzando datos de animales y sorteos
        const res = await fetch(`${CONFIG.URL}/rest/v1/vista_analisis_crca?order=fecha.desc,hora.desc&limit=25`, {
            headers: { 
                'apikey': CONFIG.KEY, 
                'Authorization': `Bearer ${CONFIG.KEY}` 
            }
        });
        
        const datos = await res.json();
        renderizarTabla(datos);
        ejecutarRadar(datos);
    } catch (e) { 
        console.error("Error al cargar historial:", e); 
    }
}

function renderizarTabla(datos) {
    const tbody = document.getElementById('tabla-resultados');
    tbody.innerHTML = '';
    
    if (datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; opacity:0.5;">No hay registros cargados</td></tr>';
        return;
    }

    datos.forEach(row => {
        // Resaltado automático para el 75 (Color Oro/Amarillo)
        const resaltado = row.numero === '75' ? 'bg-yellow-900/40 text-yellow-400 font-bold border-y border-yellow-500' : 'border-t border-slate-700';
        
        // Ajustamos la fecha para que se vea Día/Mes/Año
        const fechaFormateada = row.fecha.split('-').reverse().join('/');
        
        tbody.innerHTML += `
            <tr class="${resaltado} transition-colors hover:bg-slate-700/30">
                <td class="p-3">${fechaFormateada}</td>
                <td class="p-3">${row.hora.substring(0,5)}</td>
                <td class="p-3 text-center text-lg">${row.numero}</td>
                <td class="p-3">${row.animal || 'S/N'} <span class="text-[9px] opacity-40 uppercase">[${row.elemento || '-'}]</span></td>
            </tr>
        `;
    });
}

// ==========================================
// RADAR INTELIGENTE DEL 75
// ==========================================
function ejecutarRadar(datos) {
    const radar = document.getElementById('status-75');
    
    // Buscamos en qué posición del historial está el 75
    const ultimaVezIndex = datos.findIndex(d => d.numero === '75');

    if (ultimaVezIndex === -1) {
        // Si no aparece en los últimos 25 sorteos
        radar.innerHTML = "⚠️ ALERTA MÁXIMA: El Guácharo (75) lleva más de 25 sorteos ausente. PROBABILIDAD EXTREMA.";
        radar.className = "text-sm mt-1 text-red-500 font-black animate-pulse";
    } else if (ultimaVezIndex === 0) {
        // Si salió en el último sorteo anotado
        radar.innerHTML = "OBJETIVO CAPTURADO: El 75 acaba de salir. El algoritmo está reiniciando patrones.";
        radar.className = "text-sm mt-1 text-green-400 font-bold";
    } else {
        // Si ha salido pero no es el último
        radar.innerHTML = `ANÁLISIS: El 75 tiene ${ultimaVezIndex} sorteos de retraso. Monitoreando secuencia...`;
        radar.className = "text-sm mt-1 text-yellow-500";
    }
}

// Función del botón Borrar
function limpiarCampos() {
    document.getElementById('numero').value = '';
    console.log("Campo de entrada limpio");
}

// Iniciar sistema al cargar la ventana
window.onload = login;
