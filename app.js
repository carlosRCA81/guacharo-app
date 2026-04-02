const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Se ejecuta al abrir la página
document.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_manual').value = hoy;
    obtenerLista();
});

async function enviarDatos() {
    const animal = document.getElementById('animalito').value.trim();
    const fecha = document.getElementById('fecha_manual').value;
    const hora = document.getElementById('hora').value;

    if (!animal || !fecha || !hora) {
        alert("⚠️ Completa Animalito, Fecha y Hora");
        return;
    }

    const btn = document.getElementById('btnGuardar');
    btn.innerText = "⌛ GUARDANDO...";
    btn.disabled = true;

    const { error } = await _supabase
        .from('control_guacharo')
        .insert([{ animalito: animal, fecha_sorteo: fecha, hora_sorteo: hora }]);

    if (error) {
        alert("❌ Error: " + error.message);
    } else {
        alert("✅ ¡Guardado!");
        document.getElementById('animalito').value = "";
        obtenerLista();
    }
    
    btn.innerText = "💾 GUARDAR AHORA";
    btn.disabled = false;
}

async function obtenerLista() {
    const lista = document.getElementById('lista-resultados');
    
    // ORDENAMOS POR FECHA Y HORA (DESCENDENTE) PARA VER LOS 12 SORTEOS EN ORDEN
    const { data, error } = await _supabase
        .from('control_guacharo')
        .select('*')
        .order('fecha_sorteo', { ascending: false })
        .order('hora_sorteo', { ascending: false }) 
        .limit(12);

    if (error) {
        lista.innerHTML = "<p class='text-red-500 text-center'>Error de conexión</p>";
        return;
    }

    lista.innerHTML = "<h3 class='text-yellow-500 font-bold mb-3 text-sm text-center italic'>Sorteos Registrados (Orden Cronológico):</h3>";
    
    if (data.length === 0) {
        lista.innerHTML += "<p class='text-gray-500 text-center text-xs'>No hay datos.</p>";
        return;
    }

    data.forEach(item => {
        // Quitamos los segundos para que se vea limpio (Ej: 08:00)
        const horaCorta = item.hora_sorteo.substring(0, 5);
        
        lista.innerHTML += `
            <div class="bg-gray-800 p-3 rounded-lg border-l-4 border-yellow-600 flex justify-between items-center mb-2 shadow-lg">
                <div class="flex flex-col">
                    <span class="font-black text-white text-xl uppercase tracking-tighter">${item.animalito}</span>
                    <span class="text-gray-500 text-[10px] font-bold">${item.fecha_sorteo}</span>
                </div>
                <div class="bg-black/40 px-3 py-1 rounded-md border border-gray-700">
                    <span class="text-yellow-500 font-mono font-bold text-sm">${horaCorta}</span>
                </div>
            </div>`;
    });
}
