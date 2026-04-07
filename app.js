
const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _gbi = supabase.createClient(DB_URL, DB_KEY);
const MASTER_KEY = "CARLOS2026";

async function cargarMatriz() {
    // Traemos TODO el archivo para el estudio comparativo semanal
    const { data, error } = await _gbi
        .from('gbi_resultados')
        .select('*, gbi_especies(*)')
        .order('fecha', {ascending: false})
        .order('hora', {ascending: false});

    if (error) return console.error("ERROR DE ENLACE:", error);
    
    document.getElementById('counter').innerText = `${data.length} MOVIMIENTOS ARCHIVADOS`;
    renderizarTabla(data);
    analizarGuacharo(data); // Activamos el estudio especial del 75
}

function analizarGuacharo(data) {
    // Lógica para estudiar con qué animales sale el 75 (Guácharo)
    const apariciones75 = data.filter(r => r.animal_id == 75);
    console.log("Estudio Guácharo:", apariciones75.length, "veces detectado.");
}

function renderizarTabla(data) {
    const tbody = document.getElementById('tabla-gbi');
    tbody.innerHTML = (data || []).map(r => `
        <tr class="hover:bg-amber-50 transition-all border-b border-slate-200">
            <td class="p-3">
                <div class="text-[9px] text-slate-400 font-bold">${new Date(r.fecha).toLocaleDateString('es-VE')}</div>
                <div class="text-xs font-black">${r.hora.substring(0,5)}</div>
            </td>
            <td class="p-3">
                <div class="flex items-center gap-2">
                    <span class="text-xl font-black ${r.animal_id == 75 ? 'text-amber-600' : 'text-slate-900'}">${r.animal_id}</span>
                    <span class="text-[8px] uppercase font-bold text-slate-400">${r.gbi_especies.nombre}</span>
                </div>
            </td>
            <td class="p-3 text-center">
                <span class="px-2 py-1 rounded text-[8px] text-white font-black" style="background: ${r.gbi_especies.color_hex}">
                    ${r.gbi_especies.familia}
                </span>
            </td>
            <td class="p-3 text-center">
                <div class="text-[8px] font-black italic text-slate-400">${r.dia_semana || 'COMPLETADO'}</div>
            </td>
        </tr>
    `).join('');
}
// ... (mantenemos el resto de funciones de registrar y validar igual)
