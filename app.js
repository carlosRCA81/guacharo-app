// 1. CONFIGURACIÓN DEL PROYECTO CURATOROS
// Estos datos conectan tu web con la base de datos de Supabase
const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";

// Inicializar el cliente de Supabase
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. FUNCIÓN PARA GUARDAR (BOTÓN NARANJA)
async function guardarResultado() {
    const animal = document.getElementById('animalito').value;
    const hora = document.getElementById('hora').value;

    // Validación: No dejar que guarden campos vacíos
    if (!animal || !hora) {
        alert("¡Cuidado Carlos! Te falta escribir el animal o la hora.");
        return;
    }

    // Insertar en la tabla 'control_guacharo'
    // Usamos los nombres de columnas que creamos: animalito y hora_sorteo
    const { error } = await _supabase
        .from('control_guacharo')
        .insert([{ 
            animalito: animal.trim(), 
            hora_sorteo: hora 
        }]);

    if (error) {
        console.error("Error al guardar:", error);
        alert("Error de conexión: " + error.message);
    } else {
        alert("¡Anotado con éxito! 🦜");
        // Limpiar el cuadro de texto del animalito para el siguiente
        document.getElementById('animalito').value = "";
        // Actualizar la lista de abajo automáticamente
        cargarResultados();
    }
}

// 3. FUNCIÓN PARA CARGAR LA LISTA (LOS ÚLTIMOS 10)
async function cargarResultados() {
    const lista = document.getElementById('lista-resultados');

    const { data, error } = await _supabase
        .from('control_guacharo')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error al cargar:", error);
        lista.innerHTML = "<p style='color:#ef4444; text-align:center;'>Error al conectar con la base de datos</p>";
        return;
    }

    // Título de la sección de resultados
    lista.innerHTML = "<h3 style='color:#eab308; font-weight:bold; margin-bottom:15px; text-align:center;'>Últimos 10 sorteos registrados:</h3>";
    
    // Si hay datos, los mostramos uno por uno
    if(data && data.length > 0) {
        data.forEach(res => {
            lista.innerHTML += `
                <div style="background:#1f2937; padding:15px; border-radius:10px; border-left:5px solid #ca8a04; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
                    <span style="font-weight:bold; color:white; text-transform:uppercase; font-size:1.1rem;">${res.animalito}</span>
                    <span style="color:#9ca3af; font-family:monospace; background:#111827; padding:5px 10px; border-radius:5px;">${res.hora_sorteo}</span>
                </div>`;
        });
    } else {
        lista.innerHTML += "<p style='color:#6b7280; text-align:center;'>No hay resultados anotados hoy.</p>";
    }
}

// 4. INICIO AUTOMÁTICO
// Al abrir la página, que cargue la lista de inmediato
cargarResultados();
