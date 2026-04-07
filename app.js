const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _gbi = supabase.createClient(DB_URL, DB_KEY);

// CLAVE DE ACCESO (Defínela aquí, Carlos)
const MASTER_KEY = "CARLOS2026"; 

function validarAcceso() {
    const pass = document.getElementById('access_key').value;
    if(pass === MASTER_KEY) {
        document.getElementById('lock-screen').classList.add('hidden');
        document.getElementById('main-system').classList.remove('hidden');
        cargarMatriz();
    } else {
        const err = document.getElementById('error_msg');
        err.classList.remove('hidden');
        setTimeout(() => err.classList.add('hidden'), 3000);
    }
}

async function registrarEnGBI() {
    const num = document.getElementById('num_input').value;
    const hor = document.getElementById('hor_input').value;

    if(!num || !hor) return alert("Faltan datos");

    // PASO 1: Consultar la raza del animal automáticamente
    const { data: especie } = await _gbi.from('gbi_especies').select('*').eq('id', num).single();

    if(!especie) return alert("Número no registrado en el ADN");

    // PASO 2: Guardar el resultado
    const { error } = await _gbi.from('gbi_resultados').insert([{
        animal_id: num,
        hora: hor + ":00",
        periodo_dia: parseInt(hor) < 12 ? 'MAÑANA' : 'TARDE'
    }]);

    if (!error) {
        alert("REGISTRO BIOMÉTRICO EXITOSO");
        cargarMatriz();
    }
}

async function cargarMatriz() {
    // Consulta avanzada uniendo tablas
    const { data, error } = await _gbi
        .from('gbi_resultados')
        .select('*, gbi_especies(*)')
        .order('id', { ascending: false })
        .limit(10);

    const tbody = document.getElementById('tabla-gbi');
    tbody.innerHTML = data.map(r => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-all">
            <td class="p-4 font-mono text-slate-400">${r.hora.substring(0,5)}</td>
            <td class="p-4 font-black text-slate-800 text-lg">${r.animal_id} - ${r.gbi_especies.nombre}</td>
            <td class="p-4">
                <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase" 
                      style="background: ${r.gbi_especies.color_hex}22; color: ${r.gbi_especies.color_hex}; border: 1px solid ${r.gbi_especies.color_hex}44">
                    ${r.gbi_especies.familia}
                </span>
            </td>
            <td class="p-4 text-[10px] text-slate-400 italic">Analizando...</td>
            <td class="p-4"><span class="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span></td>
        </tr>
    `).join('');
}

// Reloj
setInterval(() => {
    const r = document.getElementById('reloj_pro');
    if(r) r.innerText = new Date().toLocaleTimeString('en-GB');
}, 1000);
