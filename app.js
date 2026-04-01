// CONEXIÓN ÚNICA PARA PROYECTO: CuratorOS
const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";

// Inicialización
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Función para Guardar
async function guardarResultado() {
    const animal = document.getElementById('animalito').value;
    const hora = document.getElementById('hora').value;

    if (!animal || !hora) {
        alert("Selecciona el animal y la hora");
        return;
    }

    // Insertamos en la tabla que ya comprobamos que funciona
    const { error } = await _supabase
        .from('control_guacharo')
        .insert([{ 
            animalito: animal.trim(), 
            hora_sorteo: hora 
        }]);

    if (error) {
        console.error("Error al guardar:", error);
        alert("No se pudo guardar: " + error.message);
    } else {
        alert("¡Anotado con éxito! 🦜");
        document.getElementById('animalito').value = "";
        cargarResultados(); // Recargamos la lista automáticamente
    }
}

// Función para Cargar Lista
async function cargarResultados() {
    const lista = document.getElementById('lista-resultados');
    if (!lista) return;

    // IMPORTANTE: Quitamos el .order('created_at') porque esa columna 
    // está dando error en tu tabla actual.
    const { data, error } = await _supabase
        .from('control_guacharo')
        .select('*')
        .limit(10); 

    if (error) {
        console.error("Error de Supabase:", error);
        lista.innerHTML = `<p style='color:red;'>Error de conexión: ${error.message}</p>`;
        return;
    }

    lista.innerHTML = "<h3 style='color:#eab308; font-weight:bold; margin-bottom:10px;'>Últimos sorteos:</h3>";
    
    if (data && data.length > 0) {
        // Invertimos el orden manualmente para ver lo más nuevo arriba
        const resultadosInvertidos = data.reverse();
        
        resultadosInvertidos.forEach(res => {
            lista.innerHTML += `
                <div style="background:#1f2937; padding:10px; border-radius:8px; border-left:4px solid #ca8a04; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:bold; color:white; text-transform:uppercase;">${res.animalito}</span>
                    <span style="color:#9ca3af; font-size:12px; background:#111827; padding:2px 6px; border-radius:4px;">${res.hora_sorteo}</span>
                </div>`;
        });
    } else {
        lista.innerHTML += "<p style='color:#6b7280;'>No hay sorteos anotados hoy.</p>";
    }
}

// Carga inicial al abrir la página
document.addEventListener('DOMContentLoaded', cargarResultados);
