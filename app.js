const SUPABASE_URL = 'https://yhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // He tomado la key de tu archivo .env

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. FUNCIÓN PARA CARGAR DATOS (CON FILTRO O TODO)
async function cargarDatos(fechaBusqueda = null) {
    const contenedor = document.getElementById('tabla-contenedor');
    contenedor.innerHTML = '<p>Analizando...</p>';

    let query = _supabase.from('historial_sorteos').select('*').order('fecha', { ascending: false }).order('hora', { ascending: true });

    if (fechaBusqueda) {
        query = query.eq('fecha', fechaBusqueda);
    }

    const { data, error } = await query;

    if (error) {
        contenedor.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        return;
    }

    if (data.length === 0) {
        contenedor.innerHTML = '<p>No hay datos para esta selección.</p>';
        return;
    }

    let html = `
        <table class="tabla-profesional">
            <thead>
                <tr>
                    <th>FECHA</th>
                    <th>HORA</th>
                    <th>NUM</th>
                    <th>ANIMAL</th>
                    <th>TIPO</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(item => {
        // RESALTADO DE INGENIERÍA PARA EL 75
        const es75 = (item.num === "75") ? 'class="especial-75"' : '';
        html += `
            <tr ${es75}>
                <td>${item.fecha}</td>
                <td>${item.hora}</td>
                <td><strong>${item.num}</strong></td>
                <td>${item.animal}</td>
                <td>${item.tipo}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    contenedor.innerHTML = html;
}

// 2. FUNCIÓN PARA GUARDAR NUEVOS DATOS
document.getElementById('formulario-registro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-guardar');
    btn.disabled = true;

    const nuevoSorteo = {
        fecha: document.getElementById('reg-fecha').value,
        hora: document.getElementById('reg-hora').value,
        num: document.getElementById('reg-num').value,
        animal: document.getElementById('reg-animal').value,
        tipo: document.getElementById('reg-tipo').value
    };

    const { error } = await _supabase.from('historial_sorteos').insert([nuevoSorteo]);

    if (error) {
        alert("Error al guardar: " + error.message);
    } else {
        alert("¡Resultado guardado exitosamente!");
        document.getElementById('formulario-registro').reset();
        cargarDatos(); // Recargar tabla
    }
    btn.disabled = false;
});

// 3. EVENTOS DE BOTONES
document.getElementById('btn-buscar').addEventListener('click', () => {
    const f = document.getElementById('filtro-fecha').value;
    cargarDatos(f);
});

document.getElementById('btn-ver-todo').addEventListener('click', () => {
    cargarDatos();
});

// CARGA INICIAL
window.onload = cargarDatos;
