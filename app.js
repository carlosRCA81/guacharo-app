// Configuración de tu "Cerebro" (Sustituye con tus datos de Supabase)
const SUPABASE_URL = 'TU_URL_DE_SUPABASE';
const SUPABASE_KEY = 'TU_ANON_KEY';

// Función para guardar el resultado y que el sistema analice
async function guardarResultado() {
    const num = document.getElementById('numero').value.trim();
    const horaSorteo = document.getElementById('hora').value;

    if (!num) {
        alert("Introduce un número o animal");
        return;
    }

    // Insertar en la tabla que creamos juntos
    const response = await fetch(`${SUPABASE_URL}/rest/v1/resultados_crca`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
            numero: num,
            hora: horaSorteo,
            // La fecha se pone sola por el DEFAULT que pusimos en SQL
        })
    });

    if (response.ok) {
        alert("✅ Registrado en el Analizador CRCA");
        document.getElementById('numero').value = ''; // Limpia el campo
        consultarAlgoritmo(); // Actualiza la tabla y el radar
    } else {
        const error = await response.json();
        alert("❌ Error: " + error.message);
    }
}

// Función para consultar la VISTA que creamos (El Algoritmo)
async function consultarAlgoritmo() {
    // Consultamos la vista_analisis_crca que une número con animal y frecuencia
    const response = await fetch(`${SUPABASE_URL}/rest/v1/vista_analisis_crca?order=id.desc&limit=10`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });

    const datos = await response.json();
    actualizarInterfaz(datos);
}

function actualizarInterfaz(datos) {
    const tabla = document.getElementById('tabla-resultados');
    const radar = document.getElementById('status-75');
    tabla.innerHTML = '';

    datos.forEach(row => {
        // Lógica de resaltado automático:
        // Si el animal es el 75 (Guácharo), resaltamos con fuego
        const esGuacharo = row.numero === '75';
        const filaClase = esGuacharo ? 'bg-yellow-900 text-yellow-200 font-bold' : 'border-t border-slate-700';

        tabla.innerHTML += `
            <tr class="${filaClase}">
                <td class="p-3">${row.hora}</td>
                <td class="p-3 text-center">${row.numero}</td>
                <td class="p-3">${row.animal} <span class="text-[10px] opacity-50">(${row.elemento})</span></td>
            </tr>
        `;
    });

    // Radar del 75: Si no ha salido en los últimos 10 sorteos, dar alerta
    const salioReciente = datos.some(d => d.numero === '75');
    if (!salioReciente) {
        radar.innerHTML = "⚠️ ALERTA: El Guácharo (75) tiene alta probabilidad de salida.";
        radar.className = "text-xs mt-1 text-red-400 font-bold animate-pulse";
    } else {
        radar.innerHTML = "El Guácharo (75) salió recientemente. Analizando nuevo ciclo.";
        radar.className = "text-xs mt-1 text-green-400";
    }
}

// Cargar datos al abrir la web
consultarAlgoritmo();
