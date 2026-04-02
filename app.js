const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Cargar resultados apenas abra la página
document.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_manual').value = hoy;
    cargarResultados();
});

async function guardarResultado() {
    const animal = document.getElementById('animalito').value.trim();
    const fecha = document.getElementById('fecha_manual').value;
    const hora = document.getElementById('hora').value;

    if (!animal || !fecha || !hora) {
        alert("Por favor, llena todos los campos");
        return;
    }

    console.log("Intentando guardar:", animal, fecha, hora);

    const { data, error } = await _supabase
        .from('control_guacharo')
        .insert([{ 
            animalito: animal, 
            hora_sorteo: hora, 
            fecha_sorteo: fecha 
        }]);

    if (error) {
        alert("Error de conexión: " + error.message);
        console.error(error);
    } else {
        alert("✅ ¡Guardado con éxito!");
        document.getElementById('animalito').value = "";
        cargarResultados();
    }
}

async function cargarResultados() {
    const lista = document.getElementById('lista-resultados');
    const { data, error } = await _supabase
        .from('control_guacharo')
        .select('*')
        .order('id', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error cargando:", error);
        return;
    }

    lista.innerHTML = "<h3 class='text-yellow-500 font-bold mb-3 text-sm'>Últimos sorteos registrados:</h3>";
    data.forEach(res => {
        lista.innerHTML += `
            <div class="bg-gray-800 p-3 rounded-lg border-l-4 border-yellow-600 flex justify-between items-center mb-2 shadow-md">
                <span class="font-bold uppercase text-white">${res.animalito}</span>
                <div class="text-right text-[10px]">
                    <span class="text-gray-300 block font-bold">${res.hora_sorteo}</span>
                    <span class="text-gray-500">${res.fecha_sorteo}</span>
                </div>
            </div>`;
    });
}
