// Configuración de Supabase para el proyecto CuratorOS
const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";

// Inicializar el cliente de Supabase
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Función para guardar el animalito y la hora
async function guardarResultado() {
    const animal = document.getElementById('animalito').value;
    const hora = document.getElementById('hora').value;

    if (!animal || !hora) {
        alert("Por favor, rellena todos los campos");
        return;
    }

    // Insertar datos en la tabla correcta: control_guacharo
    const { error } = await _supabase
        .from('control_guacharo')
        .insert([{ 
            animalito: animal.trim(), 
            hora_sorteo: hora 
        }]);

    if (error) {
        console.error("Error detallado:", error);
        alert("Error al guardar: " + error.message);
    } else {
        alert("¡Anotado con éxito! 🦜");
        // Limpiar el campo del animalito después de guardar
        document.getElementById('animalito').value = "";
        // Actualizar la lista automáticamente
        cargarResultados();
    }
}

// Función para mostrar los últimos resultados en la web
async function cargarResultados() {
    const { data, error } = await _supabase
        .from('control_guacharo')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    const lista = document.getElementById('lista-resultados');
    
    if (error) {
        console.error("Error al cargar:", error);
        lista.innerHTML = "<p style='color:red;'>Error al conectar con la base de datos</p>";
        return;
    }

    // Dibujar la lista en el HTML
    lista.innerHTML = "<h3 style='color:#EAB308; font-weight:bold; margin-bottom:10px;'>Últimos 10 sorteos:</h3>";
    
    if (data && data.length > 0) {
        data.forEach(res => {
            lista.innerHTML += `
                <div style="background:#1F2937; padding:12px; border-radius:8px; border-left:4px solid #CA8A04; margin-bottom:8px; display:flex; justify-content:between; align-items:center;">
                    <span style="font-weight:bold; color:white; text-transform:uppercase;">${res.animalito}</span>
                    <span style="color:#9CA3AF; font-size:12px; margin-left:auto; background:#111827; padding:4px 8px; border-radius:4px;">${res.hora_sorteo}</span>
                </div>`;
        });
    } else {
        lista.innerHTML += "<p style='color:#6B7280;'>No hay resultados registrados todavía.</p>";
    }
}

// Ejecutar la carga de datos apenas abra la página
cargarResultados();
