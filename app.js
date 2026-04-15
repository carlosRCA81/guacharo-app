// CONFIGURACIÓN DE CONEXIÓN (Datos obtenidos de tus archivos .env y capturas)
const SUPABASE_URL = 'https://yhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'TU_SUPABASE_KEY_AQUÍ'; // Pega aquí la clave larga que tienes en tu archivo .env

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Función Principal de Consulta
async function consultarSorteos() {
    const fechaInput = document.getElementById('fecha-sorteo').value;
    const visor = document.getElementById('pantalla-datos');

    if (!fechaInput) {
        alert("Ingeniería: Por favor seleccione una fecha para filtrar la base de datos.");
        return;
    }

    visor.innerHTML = '<p class="cargando">Analizando base de datos en tiempo real...</p>';

    // Consulta exacta: Filtra por la fecha del selector y ordena por hora de forma ascendente
    const { data, error } = await _supabase
        .from('historial_sorteos')
        .select('*')
        .eq('fecha', fechaInput)
        .order('hora', { ascending: true });

    if (error) {
        visor.innerHTML = `<div class="error">Error de Conexión: ${error.message}</div>`;
        return;
    }

    if (data.length === 0) {
        visor.innerHTML = `<div class="sin-datos">No se encontraron resultados para el día ${fechaInput}.</div>`;
        return;
    }

    // CONSTRUCCIÓN DE LA TABLA ORGANIZADA
    let html = `
        <table class="tabla-ingenieria">
            <thead>
                <tr>
                    <th>HORA</th>
                    <th>NÚMERO</th>
                    <th>ANIMAL</th>
                    <th>TIPO</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(fila => {
        // Lógica de estudio: Si el número es 75, aplicamos clase especial
        const esEspecial = (fila.num === "75") ? 'class="especial-75"' : '';
        
        html += `
            <tr ${esEspecial}>
                <td>${fila.hora}</td>
                <td class="col-num"><strong>${fila.num}</strong></td>
                <td>${fila.animal}</td>
                <td class="col-tipo">${fila.tipo}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    visor.innerHTML = html;
}

// Escuchador del botón
document.getElementById('btn-consultar').addEventListener('click', consultarSorteos);
