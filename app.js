const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // Establecer fecha de hoy por defecto
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_manual').value = hoy;
    obtenerLista();
});

async function enviarDatos() {
    const animal = document.getElementById('animalito').value.trim();
    const fecha = document.getElementById('fecha_manual').value;
    const hora = document.getElementById('hora').value;

    if (!animal || !fecha || !hora) {
        alert("⚠️ Por favor completa todos los campos");
        return;
    }

    const btn = document.getElementById('btnGuardar');
    btn.innerText = "⌛ PROCESANDO...";
    btn.disabled = true;

    const { error } = await _supabase
        .from('control_guacharo')
        .insert([{ animalito: animal, fecha_sorteo: fecha, hora_sorteo: hora }]);

    if (error) {
        alert("❌ Error: " + error.message);
    } else {
        document.getElementById('animalito').value = "";
        obtenerLista();
    }
    
    btn.innerText = "💾 GUARDAR RESULTADO";
    btn.disabled = false;
}

// Función para convertir hora militar a AM/PM
function formatoAMPM(horaMilitar) {
    let [horas, minutos] = horaMilitar.split(':');
    horas = parseInt(horas);
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12;
    horas = horas ? horas : 12; // la hora '0' debería ser '12'
    return `${horas}:${minutos} ${ampm}`;
}

async function obtenerLista() {
    const lista = document.getElementById('lista-resultados');
    
    // Traemos los últimos 12 resultados ordenados por fecha y hora
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

    lista.innerHTML = "<h3 class='text-yellow-500 font-black mb-4 text-sm text-center uppercase tracking-widest'>Resultados del Día</h3>";
    
    if (data.length === 0) {
        lista.innerHTML += "<p class='text-gray-600 text-center text-xs'>No hay sorteos registrados.</p>";
        return;
    }

    data.forEach(item => {
        const horaBonita = formatoAMPM(item.hora_sorteo);
        
        lista.innerHTML += `
            <div class="card-resultado bg-gray-800 p-4 rounded-xl border-l-4 border-yellow-500 flex justify-between items-center shadow-lg border border-gray-700/50">
                <div>
                    <span class="block text-[10px] text-gray-500 font-bold uppercase">${item.fecha_sorteo}</span>
                    <span class="text-2xl font-black text-white tracking-tighter uppercase">${item.animalito}</span>
                </div>
                <div class="text-right">
                    <span class="bg-yellow-600/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-black border border-yellow-600/20">
                        ${horaBonita}
                    </span>
                </div>
            </div>`;
    });
}
