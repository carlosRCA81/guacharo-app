const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _gbi = supabase.createClient(DB_URL, DB_KEY);
const MASTER_KEY = "CARLOS2026";

// Función de Desbloqueo Corregida
function validarAcceso() {
    const input = document.getElementById('access_key').value.trim();
    console.log("Validando TOKEN..."); // Para depuración en consola
    
    if(input === MASTER_KEY) {
        document.getElementById('lock-screen').classList.add('hidden');
        document.getElementById('main-system').classList.remove('hidden');
        cargarMatriz(); // Carga el historial de abril al entrar
    } else {
        alert("TOKEN INCORRECTO: ACCESO DENEGADO");
    }
}

// Carga de Historial para el Estudio de Seguidillas
async function cargarMatriz() {
    console.log("Sincronizando con matriz GBI...");
    const { data, error } = await _gbi
        .from('gbi_resultados')
        .select('*, gbi_especies(*)')
        .order('fecha', {ascending: false})
        .order('hora', {ascending: false});

    if (error) {
        console.error("Error de Sincronización:", error);
        return;
    }
    
    document.getElementById('counter').innerText = `${data.length} MOVIMIENTOS DETECTADOS`;
    renderizarTabla(data);
}

function renderizarTabla(data) {
    const tbody = document.getElementById('tabla-gbi');
    tbody.innerHTML = (data || []).map(r => `
        <tr class="hover:bg-amber-50 border-b border-slate-200">
            <td class="p-3">
                <div class="text-[9px] text-slate-500 font-bold">${r.fecha}</div>
                <div class="text-xs font-black">${r.hora.substring(0,5)}</div>
            </td>
            <td class="p-3">
                <div class="flex items-center gap-2">
                    <span class="text-xl font-black ${r.animal_id == 75 ? 'text-amber-600' : 'text-slate-900'}">${r.animal_id}</span>
                    <span class="text-[8px] uppercase font-bold text-slate-400">${r.gbi_especies ? r.gbi_especies.nombre : 'S/N'}</span>
                </div>
            </td>
            <td class="p-3 text-center">
                <span class="px-2 py-1 rounded text-[8px] text-white font-black" style="background: ${r.gbi_especies ? r.gbi_especies.color_hex : '#ccc'}">
                    ${r.gbi_especies ? r.gbi_especies.familia : 'ESTUDIANDO'}
                </span>
            </td>
            <td class="p-3 text-center">
                <div class="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full inline-block font-black">VALIDADO</div>
            </td>
        </tr>
    `).join('');
}

async function registrarEnGBI() {
    const num = document.getElementById('num_input').value;
    const fec = document.getElementById('fec_input').value;
    const hor = document.getElementById('hor_input').value;

    if(!num || !fec) return alert("DATOS INCOMPLETOS");

    const { error } = await _gbi.from('gbi_resultados').insert([{
        animal_id: num, fecha: fec, hora: hor + ":00"
    }]);

    if(!error) {
        document.getElementById('num_input').value = "";
        cargarMatriz();
    } else {
        alert("ERROR: EL NÚMERO " + num + " NO ESTÁ EN EL ADN");
    }
}
