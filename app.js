const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dmJ1ZnhrZ3ljcWNtZGVjbHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTE5NTMsImV4cCI6MjA4OTk2Nzk1M30.Rt6XfnsvWu1Efwb3-fVOyHCmz7aCJXHpIJxaxGzuThw";

// Inicializar Supabase correctamente
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function guardarResultado() {
    const animal = document.getElementById('animalito').value;
    const hora = document.getElementById('hora').value;

    if (!animal || !hora) {
        alert("Faltan datos por rellenar");
        return;
    }

    // Insertar en la tabla que creamos
    const { error } = await _supabase
        .from('resultados_guacharo')
        .insert([{ 
            animalito: animal.trim(), 
            hora_sorteo: hora 
        }]);

    if (error) {
        alert("Error de conexión: " + error.message);
    } else {
        alert("¡Anotado con éxito! 🦜");
        document.getElementById('animalito').value = "";
        cargarResultados();
    }
}

async function cargarResultados() {
    const { data, error } = await _supabase
        .from('resultados_guacharo')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    const lista = document.getElementById('lista-resultados');
    if (error) {
        lista.innerHTML = "<p class='text-red-500'>Error al cargar datos</p>";
        return;
    }

    lista.innerHTML = "<h3 class='text-yellow-500 font-bold mb-2'>Últimos 10 sorteos:</h3>";
    
    if(data && data.length > 0) {
        data.forEach(res => {
            lista.innerHTML += `
                <div class="bg-gray-800 p-3 rounded-lg border-l-4 border-yellow-600 mb-2 flex justify-between items-center shadow">
                    <span class="font-bold text-white uppercase text-lg">${res.animalito}</span>
                    <span class="text-gray-400 text-sm font-mono bg-gray-900 px-2 py-1 rounded">${res.hora_sorteo}</span>
                </div>`;
        });
    } else {
        lista.innerHTML += "<p class='text-gray-500'>No hay datos registrados aún.</p>";
    }
}

// Cargar al iniciar
cargarResultados();
