const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _gbi = supabase.createClient(DB_URL, DB_KEY);

const MASTER_KEY = "CARLOS2026"; // Tu clave de acceso

function validarAcceso() {
    if(document.getElementById('access_key').value === MASTER_KEY) {
        document.getElementById('lock-screen').classList.add('hidden');
        document.getElementById('main-system').classList.remove('hidden');
        cargarMatriz();
    } else {
        alert("TOKEN INVÁLIDO");
    }
}

async function registrarEnGBI() {
    const num = document.getElementById('num_input').value;
    const fec = document.getElementById('fec_input').value;
    const hor = document.getElementById('hor_input').value;

    if(!num || !fec) return alert("COMPLETE TODOS LOS DATOS");

    const { data: esp } = await _gbi.from('gbi_especies').select('*').eq('id', num).single();
    if(!esp) return alert("ANIMAL NO REGISTRADO");

    const { error } = await _gbi.from('gbi_resultados').insert([{
        animal_id: num, fecha: fec, hora: hor + ":00",
        dia_semana: new Intl.DateTimeFormat('es-ES', {weekday: 'long'}).format(new Date(fec + 'T00:00:00')).toUpperCase()
    }]);

    if(!error) {
        document.getElementById('num_input').value = "";
        document.getElementById('num_input').focus();
        cargarMatriz();
    }
}

async function cargarMatriz() {
    const { data } = await _gbi.from('gbi_resultados').select('*, gbi_especies(*)').order('fecha', {ascending: false}).order('hora', {ascending: false}).limit(20);
    renderizarTabla(data);
}

function renderizarTabla(data) {
    const tbody = document.getElementById('tabla-gbi');
    tbody.innerHTML = (data || []).map(r => `
        <tr class="border-b border-slate-200 hover:bg-amber-50">
            <td class="p-4 font-mono text-slate-800 text-lg">${r.hora.substring(0,5)}</td>
            <td class="p-4">
                <div class="flex flex-col">
                    <span class="text-2xl font-black text-slate-900">${r.animal_id}</span>
                    <span class="text-[9px] text-slate-500 uppercase tracking-widest">${r.gbi_especies.nombre}</span>
                </div>
            </td>
            <td class="p-4 text-center">
                <span class="px-3 py-2 rounded-lg font-black text-[9px] text-white shadow-sm" style="background: ${r.gbi_especies.color_hex}">
                    ${r.gbi_especies.familia}
                </span>
            </td>
            <td class="p-4 text-center"><span class="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-black border border-green-200">REGISTRADO</span></td>
        </tr>
    `).join('');
}

function filtrarMatriz() {
    const busqueda = document.getElementById('search_input').value.toUpperCase();
    const filas = document.querySelectorAll('#tabla-gbi tr');
    filas.forEach(fila => {
        const contenido = fila.innerText.toUpperCase();
        fila.style.display = contenido.includes(busqueda) ? "" : "none";
    });
}

setInterval(() => { document.getElementById('reloj_pro').innerText = new Date().toLocaleTimeString('en-GB'); }, 1000);
document.getElementById('fec_input').value = new Date().toISOString().split('T')[0];
