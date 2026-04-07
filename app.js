const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _gbi = supabase.createClient(DB_URL, DB_KEY);
const MASTER_KEY = "CARLOS2026";

function validarAcceso() {
    if(document.getElementById('access_key').value === MASTER_KEY) {
        document.getElementById('lock-screen').classList.add('hidden');
        document.getElementById('main-system').classList.remove('hidden');
        cargarMatriz();
    } else { alert("ACCESO DENEGADO"); }
}

async function cargarMatriz() {
    const { data, error } = await _gbi
        .from('gbi_resultados')
        .select('*, gbi_especies(*)')
        .order('fecha', {ascending: false})
        .order('hora', {ascending: false});

    if (error) return console.error(error);
    
    document.getElementById('counter').innerText = `${data.length} MOVIMIENTOS DETECTADOS`;
    renderizarTabla(data);
}

function renderizarTabla(data) {
    const tbody = document.getElementById('tabla-gbi');
    tbody.innerHTML = (data || []).map(r => `
        <tr class="row-anim hover:bg-white transition-colors">
            <td class="p-3 border-r border-slate-100">
                <div class="text-[10px] text-slate-500">${r.fecha}</div>
                <div class="text-sm font-black">${r.hora.substring(0,5)}</div>
            </td>
            <td class="p-3">
                <div class="flex items-center gap-3">
                    <span class="text-2xl font-black">${r.animal_id}</span>
                    <span class="text-[9px] uppercase tracking-tighter text-slate-400">${r.gbi_especies.nombre}</span>
                </div>
            </td>
            <td class="p-3 text-center">
                <span class="px-2 py-1 rounded text-[9px] text-white font-black uppercase shadow-sm" style="background: ${r.gbi_especies.color_hex}">
                    ${r.gbi_especies.familia}
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

    if(!num || !fec) return alert("FALTAN DATOS");

    const { error } = await _gbi.from('gbi_resultados').insert([{
        animal_id: num, fecha: fec, hora: hor + ":00"
    }]);

    if(!error) {
        document.getElementById('num_input').value = "";
        cargarMatriz();
    } else {
        alert("ERROR: EL NÚMERO " + num + " NO EXISTE EN EL ADN");
    }
}

function filtrarMatriz() {
    const val = document.getElementById('search_input').value.toUpperCase();
    const rows = document.querySelectorAll('#tabla-gbi tr');
    rows.forEach(r => r.style.display = r.innerText.toUpperCase().includes(val) ? "" : "none");
}

setInterval(() => { document.getElementById('reloj_pro').innerText = new Date().toLocaleTimeString('en-GB'); }, 1000);
document.getElementById('fec_input').value = new Date().toISOString().split('T')[0];
