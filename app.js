const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const horasSorteos = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

function actualizarReloj() {
    const ahora = new Date();
    const tiempoStr = ahora.toLocaleTimeString('en-GB');
    document.getElementById('reloj-digital').innerText = tiempoStr;

    // Detectar el sorteo más cercano basado en la hora actual
    const horaActual = ahora.getHours();
    let sorteoDetectado = "19:00"; 
    
    if (horaActual < 9) sorteoDetectado = "08:00";
    else if (horaActual < 10) sorteoDetectado = "09:00";
    else if (horaActual < 11) sorteoDetectado = "10:00";
    else if (horaActual < 12) sorteoDetectado = "11:00";
    else if (horaActual < 13) sorteoDetectado = "12:00";
    else if (horaActual < 14) sorteoDetectado = "13:00";
    else if (horaActual < 15) sorteoDetectado = "14:00";
    else if (horaActual < 16) sorteoDetectado = "15:00";
    else if (horaActual < 17) sorteoDetectado = "16:00";
    else if (horaActual < 18) sorteoDetectado = "17:00";
    else if (horaActual < 19) sorteoDetectado = "18:00";

    document.getElementById('sorteo-proximo').innerText = sorteoDetectado;
}

setInterval(actualizarReloj, 1000);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fecha_manual').value = new Date().toISOString().split('T')[0];
    actualizarReloj();
    obtenerSecuencia();
});

async function registrarSorteo() {
    const animal = document.getElementById('animalito').value.trim();
    const fecha = document.getElementById('fecha_manual').value;
    const hora = document.getElementById('sorteo-proximo').innerText;

    if (!animal) return alert("Ingresa el número");

    const { error } = await _supabase
        .from('control_guacharo')
        .insert([{ animalito: animal, fecha_sorteo: fecha, hora_sorteo: hora }]);

    if (!error) {
        document.getElementById('animalito').value = "";
        obtenerSecuencia();
    }
}

async function obtenerSecuencia() {
    const lista = document.getElementById('lista-resultados');
    
    // Traemos exactamente los últimos 12 para el análisis del algoritmo
    const { data, error } = await _supabase
        .from('control_guacharo')
        .select('*')
        .order('fecha_sorteo', { ascending: false })
        .order('hora_sorteo', { ascending: false }) 
        .limit(12);

    if (error) return;

    lista.innerHTML = "";
    data.forEach(item => {
        lista.innerHTML += `
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center mb-2 shadow-sm">
                <div>
                    <span class="block text-[8px] text-slate-600 font-black uppercase mb-1">${item.fecha_sorteo}</span>
                    <span class="text-2xl font-black text-white tracking-tighter">${item.animalito}</span>
                </div>
                <div class="bg-slate-950 px-3 py-2 rounded-lg border border-yellow-900/30">
                    <span class="text-yellow-500 font-mono font-bold text-sm">${item.hora_sorteo}</span>
                </div>
            </div>`;
    });
}
