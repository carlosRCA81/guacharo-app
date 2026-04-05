const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(DB_URL, DB_KEY);

const MASTER_DATA = {
    0: { n: "Delfín", f: "AGUA", c: "bg-agua" },
    1: { n: "Carnero", f: "TIERRA", c: "bg-tierra" },
    14: { n: "Paloma", f: "AIRE", c: "bg-aire" },
    75: { n: "Guácharo", f: "AIRE", c: "bg-aire" },
    // El sistema usará "TIERRA" por defecto si no está en esta lista rápida
};

setInterval(() => { document.getElementById('reloj').innerText = new Date().toLocaleTimeString('en-GB'); }, 1000);

function ver(panel) {
    ['registro', 'matriz', 'inteligencia', 'saltos'].forEach(p => {
        document.getElementById(`panel-${p}`).classList.add('hidden');
        document.getElementById(`btn-${p}`).classList.remove('tab-active');
    });
    document.getElementById(`panel-${panel}`).classList.remove('hidden');
    document.getElementById(`btn-${panel}`).classList.add('tab-active');

    if(panel === 'matriz') renderExcel();
    if(panel === 'inteligencia') analizarAlgoritmo();
    if(panel === 'saltos') calcularSaltos();
}

async function registrar() {
    const num = document.getElementById('num_input').value;
    const fec = document.getElementById('fec_input').value;
    const hor = document.getElementById('hor_input').value;
    if(!num) return;

    const info = MASTER_DATA[num] || { n: "Animal", f: "TIERRA", c: "bg-tierra" };
    
    await _supabase.from('sorteos_guacharo').insert([{
        animalito: parseInt(num), nombre: info.n, familia: info.f, fecha: fec, hora: hor + ":00"
    }]);
    
    document.getElementById('num_input').value = "";
    cargarHoy();
}

async function renderExcel() {
    const { data } = await _supabase.from('sorteos_guacharo').select('*').order('hora', {ascending: true});
    const body = document.getElementById('tabla-excel-body');
    body.innerHTML = "";
    
    const horas = ["08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00"];
    
    horas.forEach(h => {
        let fila = `<tr><td class="cell-excel bg-slate-950 text-yellow-600">${h.substring(0,5)}</td>`;
        for(let i=1; i<=5; i++) { // Lunes a Viernes simulado
            const sorteo = data.find(s => s.hora === h);
            if(sorteo) {
                const info = MASTER_DATA[sorteo.animalito] || { c: 'bg-slate-800' };
                fila += `<td class="cell-excel ${info.c} text-white">${sorteo.animalito}</td>`;
            } else {
                fila += `<td class="cell-excel">--</td>`;
            }
        }
        body.innerHTML += fila + "</tr>";
    });
}

async function calcularSaltos() {
    const { data } = await _supabase.from('sorteos_guacharo').select('*').order('created_at', {ascending: true});
    let combos = {};
    for(let i=0; i < data.length - 1; i++) {
        let key = data[i].animalito;
        let next = data[i+1].animalito;
        if(!combos[key]) combos[key] = {};
        combos[key][next] = (combos[key][next] || 0) + 1;
    }

    const container = document.getElementById('lista-saltos');
    container.innerHTML = "";
    Object.keys(combos).forEach(num => {
        const mejorNext = Object.entries(combos[num]).sort((a,b) => b[1]-a[1])[0];
        container.innerHTML += `
            <div class="flex justify-between border-b border-slate-800 pb-2">
                <span class="text-yellow-500 font-black">Si sale ${num}</span>
                <span class="text-white">Sigue el <b class="text-lg">${mejorNext[0]}</b> (${mejorNext[1]} veces)</span>
            </div>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fec_input').value = new Date().toISOString().split('T')[0];
    cargarHoy();
});
