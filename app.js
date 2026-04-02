const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Configuración inicial
document.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_manual').value = hoy;
    obtenerLista();
});

async function enviarDatos() {
    const animal = document.getElementById('animalito').value;
    const fecha = document.getElementById('fecha_manual').value;
    const hora = document.getElementById('hora').value;

    if (!animal || !fecha || !hora) {
        alert("⚠️ Faltan datos por llenar");
        return;
    }

    // Cambiar el botón para saber que está trabajando
    const btn = document.getElementById('btnGuardar');
    btn.innerText = "⌛ ENVIANDO...";
    btn.disabled = true;

    const { error } = await _supabase
        .from('control_guacharo')
        .insert([{ animalito: animal, fecha_sorteo: fecha, hora_sorteo: hora }]);

    if (error) {
        alert("❌ ERROR: " + error.message);
        btn.innerText = "💾 GUARDAR AHORA";
        btn.disabled = false;
    } else {
        alert("✅ ¡GUARDADO EXITOSAMENTE!");
        document.getElementById('animalito').value = "";
        btn.innerText = "💾 GUARDAR AHORA";
        btn.disabled = false;
        obtenerLista();
    }
}

async function obtenerLista() {
    const lista = document.getElementById('lista-resultados');
    const { data, error } = await _supabase
        .from('control_guacharo')
        .select('*')
        .order('id', { ascending: false })
        .limit(8);

    if (error) {
        lista.innerHTML = "<p class='text-red-500'>Error al conectar</p>";
        return;
    }

    lista.innerHTML = "<h3 class='text-yellow-500 font-bold mb-2 text-sm'>Últimos Registros:</h3>";
    data.forEach(item => {
        lista.innerHTML += `
            <div class="bg-gray-800 p-2 rounded mb-2 border-l-4 border-yellow-600 flex justify-between items-center">
                <span class="font-bold text-white uppercase">${item.animalito}</span>
                <span class="text-gray-400 text-[10px]">${item.hora_sorteo}</span>
            </div>`;
    });
}
