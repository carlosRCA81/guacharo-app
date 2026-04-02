const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function establecerFechaHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_manual').value = hoy;
}

// ESTA FUNCIÓN DECIDE SI CREA UNO NUEVO O CAMBIA EL VIEJO
async function guardarOActualizar() {
    const id = document.getElementById('id_editar').value;
    const animal = document.getElementById('animalito').value.trim();
    const fecha = document.getElementById('fecha_manual').value;
    const hora = document.getElementById('hora').value;

    if (!animal || !fecha || !hora) { alert("Completa todos los campos"); return; }

    if (id) {
        // SI HAY UN ID, ACTUALIZA EL EXISTENTE (CORRIGE EL ERROR)
        const { error } = await _supabase
            .from('control_guacharo')
            .update({ animalito: animal, hora_sorteo: hora, fecha_sorteo: fecha })
            .eq('id', id);
        
        if (error) { alert("No se pudo actualizar: " + error.message); }
        else { alert("¡Resultado corregido!"); }
    } else {
        // SI NO HAY ID, GUARDA UNO NUEVO
        const { error } = await _supabase
            .from('control_guacharo')
            .insert([{ animalito: animal, hora_sorteo: hora, fecha_sorteo: fecha }]);
        
        if (error) { alert("Error al guardar: " + error.message); }
    }

    limpiarFormulario();
    cargarResultados();
}

// SUBE LOS DATOS AL FORMULARIO PARA EDITAR
function cargarParaEditar(id, animal, fecha, hora) {
    document.getElementById('id_editar').value = id;
    document.getElementById('animalito').value = animal;
    document.getElementById('fecha_manual').value = fecha;
    document.getElementById('hora').value = hora;

    document.getElementById('titulo-operacion').innerText = "✏️ Corrigiendo Resultado";
    document.getElementById('btn-accion').innerText = "✅ ACTUALIZAR AHORA";
    document.getElementById('btn-accion').classList.replace('bg-yellow-600', 'bg-green-600');
    document.getElementById('btn-cancelar').classList.remove('hidden');
    window.scrollTo(0, 0);
}

function limpiarFormulario() {
    document.getElementById('id_editar').value = "";
    document.getElementById('animalito').value = "";
    document.getElementById('hora').value = "";
    establecerFechaHoy();

    document.getElementById('titulo-operacion').innerText = "Anotar Resultado";
    document.getElementById('btn-accion').innerText = "💾 GUARDAR RESULTADO";
    document.getElementById('btn-accion').classList.replace('bg-green-600', 'bg-yellow-600');
    document.getElementById('btn-cancelar').classList.add('hidden');
}

async function cargarResultados() {
    const lista = document.getElementById('lista-resultados');
    const { data, error } = await _supabase
        .from('control_guacharo')
        .select('*')
        .order('id', { ascending: false })
        .limit(10);

    if (error) return;

    lista.innerHTML = "<h3 class='text-yellow-500 font-bold mb-3 text-sm italic'>Toca el lápiz 📝 para corregir un error:</h3>";
    data.forEach(res => {
        lista.innerHTML += `
            <div class="bg-gray-800 p-3 rounded-lg border-l-4 border-yellow-600 flex justify-between items-center mb-2 shadow-md">
                <div class="flex items-center gap-3">
                    <button onclick="cargarParaEditar('${res.id}', '${res.animalito}', '${res.fecha_sorteo}', '${res.hora_sorteo}')" class="bg-blue-900/40 p-2 rounded-full active:bg-blue-600 transition-colors">
                        📝
                    </button>
                    <span class="font-bold uppercase text-sm">${res.animalito}</span>
                </div>
                <div class="text-right text-[10px]">
                    <span class="text-gray-300 block font-bold">${res.hora_sorteo}</span>
                    <span class="text-gray-500">${res.fecha_sorteo}</span>
                </div>
            </div>`;
    });
}

// (La función de análisis se mantiene igual para no perder potencia)
async function ejecutarAnalisis() { /* ... misma lógica anterior ... */ }

document.addEventListener('DOMContentLoaded', () => {
    establecerFechaHoy();
    cargarResultados();
});
