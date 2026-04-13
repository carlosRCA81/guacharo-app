const SUPABASE_URL = 'https://jvbsalpnycnokynpsexw.supabase.co';
const SUPABASE_KEY = 'sb_publisible_hurtMxONK9ce5XNemgTYFg_4TzbkkVe';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA_ANIMALES = {
    "0":{a:"DELFÍN",t:"AGUA"},"00":{a:"BALLENA",t:"AGUA"},"1":{a:"CARNERO",t:"TIERRA"},"2":{a:"TORO",t:"TIERRA"},"3":{a:"CIEMPIÉS",t:"TIERRA"},"4":{a:"ALACRÁN",t:"TIERRA"},"5":{a:"LEÓN",t:"TIERRA"},"6":{a:"RANA",t:"AGUA"},"7":{a:"PERICO",t:"AIRE"},"8":{a:"RATÓN",t:"TIERRA"},"9":{a:"ÁGUILA",t:"AIRE"},"10":{a:"TIGRE",t:"TIERRA"},"11":{a:"GATO",t:"TIERRA"},"12":{a:"CABALLO",t:"TIERRA"},"13":{a:"MONO",t:"TIERRA"},"14":{a:"PALOMA",t:"AIRE"},"15":{a:"ZORRO",t:"TIERRA"},"16":{a:"OSO",t:"TIERRA"},"17":{a:"PAVO",t:"AIRE"},"18":{a:"BURRO",t:"TIERRA"},"19":{a:"CHIVO",t:"TIERRA"},"20":{a:"COCHINO",t:"TIERRA"},"21":{a:"GALLO",t:"AIRE"},"22":{a:"CAMELLO",t:"TIERRA"},"23":{a:"CEBRA",t:"TIERRA"},"24":{a:"IGUANA",t:"TIERRA"},"25":{a:"GALLINA",t:"AIRE"},"26":{a:"VACA",t:"TIERRA"},"27":{a:"PERRO",t:"TIERRA"},"28":{a:"ZAMURO",t:"AIRE"},"29":{a:"ELEFANTE",t:"TIERRA"},"30":{a:"CAIMÁN",t:"AGUA"},"31":{a:"LAPA",t:"TIERRA"},"32":{a:"ARDILLA",t:"TIERRA"},"33":{a:"PESCADO",t:"AGUA"},"34":{a:"VENADO",t:"TIERRA"},"35":{a:"JIRAFA",t:"TIERRA"},"36":{a:"CULEBRA",t:"TIERRA"},"37":{a:"TORTUGA",t:"AGUA"},"38":{a:"MONO",t:"TIERRA"},"39":{a:"ZORRO",t:"TIERRA"},"40":{a:"AVISPA",t:"AIRE"},"41":{a:"CANGURO",t:"TIERRA"},"42":{a:"TUCÁN",t:"AIRE"},"43":{a:"MARIPOSA",t:"AIRE"},"44":{a:"CHIGÜIRE",t:"TIERRA"},"45":{a:"GARZA",t:"AIRE"},"46":{a:"PUMA",t:"TIERRA"},"47":{a:"PAVO REAL",t:"AIRE"},"48":{a:"PUERCOESPÍN",t:"TIERRA"},"49":{a:"PEREZA",t:"TIERRA"},"50":{a:"CANARIO",t:"AIRE"},"51":{a:"PELÍCANO",t:"AIRE"},"52":{a:"PULPO",t:"AGUA"},"53":{a:"CARACOL",t:"AGUA"},"54":{a:"GRILLO",t:"TIERRA"},"55":{a:"HORMIGA",t:"TIERRA"},"56":{a:"TIBURÓN",t:"AGUA"},"57":{a:"PUERCOESPÍN",t:"TIERRA"},"58":{a:"GATO",t:"TIERRA"},"59":{a:"CHIVO",t:"TIERRA"},"60":{a:"HIPOPÓTAMO",t:"AGUA"},"61":{a:"GACELA",t:"TIERRA"},"62":{a:"GORILA",t:"TIERRA"},"63":{a:"MAPACHE",t:"TIERRA"},"64":{a:"CAMALEÓN",t:"TIERRA"},"65":{a:"RINOCERONTE",t:"TIERRA"},"66":{a:"OSO",t:"TIERRA"},"67":{a:"BÚHO",t:"AIRE"},"68":{a:"TORTUGA",t:"AGUA"},"69":{a:"PÁJARO",t:"AIRE"},"70":{a:"PÁJARO",t:"AIRE"},"71":{a:"PÁJARO",t:"AIRE"},"72":{a:"PÁJARO",t:"AIRE"},"73":{a:"HIPOPÓTAMO",t:"AGUA"},"74":{a:"TURPIAL",t:"AIRE"},"75":{a:"GUÁCHARO",t:"AIRE"}
};

let historial = [];

async function inicializarSistema() {
    cargarSelectAnimales();
    await cargarDatosRemotos();
}

async function cargarDatosRemotos() {
    const { data, error } = await _supabase
        .from('historial_resultados')
        .select('*')
        .order('fecha', { ascending: false })
        .order('hora', { ascending: false });

    if (!error && data) {
        historial = data;
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    renderHistorial();
    renderDormidos();
    calcularFrecuencia();
    estudiar75();
}

function renderHistorial() {
    const lista = document.getElementById('lista-historial');
    if (!lista) return;
    lista.innerHTML = historial.slice(0, 50).map(i => `
        <tr>
            <td>${i.fecha}</td>
            <td><b>${i.hora}</b></td>
            <td style="color:#fbbf24; font-weight:bold;">${i.numero}</td>
            <td>${i.animal}</td>
            <td><small>${DATA_ANIMALES[i.numero]?.t || '---'}</small></td>
        </tr>
    `).join('');
}

function renderDormidos() {
    const div = document.getElementById('lista-dormidos');
    if (!div) return;
    const atrasos = Object.keys(DATA_ANIMALES).map(num => {
        const index = historial.findIndex(r => r.numero === num);
        return { num, a: DATA_ANIMALES[num].a, gap: index === -1 ? historial.length : index };
    }).sort((a,b) => b.gap - a.gap);
    div.innerHTML = atrasos.slice(0, 5).map(d => `<div>${d.num} ${d.a} (${d.gap})</div>`).join('');
}

function calcularFrecuencia() {
    const counts = {};
    historial.slice(0, 100).forEach(r => counts[r.numero] = (counts[r.numero] || 0) + 1);
    const sorted = Object.keys(counts).sort((a,b) => counts[b] - counts[a]);
    if(document.getElementById('p1')) document.getElementById('p1').innerText = sorted[0] || "--";
    if(document.getElementById('p2')) document.getElementById('p2').innerText = sorted[1] || "--";
    if(document.getElementById('p3')) document.getElementById('p3').innerText = sorted[2] || "--";
}

function estudiar75() {
    const radar = document.getElementById('guacharo-intel');
    const pos = historial.findIndex(i => i.numero === "75");
    if(radar && pos !== -1) {
        radar.innerHTML = `Radar 🦅: 75 atrasado <b>${pos}</b> sorteos.`;
    }
}

function cargarSelectAnimales() {
    const select = document.getElementById('select-animal-estudio');
    if(!select) return;
    select.innerHTML = Object.keys(DATA_ANIMALES).map(n => `<option value="${n}">${n} - ${DATA_ANIMALES[n].a}</option>`).join('');
}

function estudiarAnimalEspecifico() {
    const num = document.getElementById('select-animal-estudio').value;
    const res = document.getElementById('resultado-patrones');
    const encuentros = historial.map((r, i) => r.numero === num ? i : -1).filter(i => i !== -1);
    let antes = {}, despues = {};
    encuentros.forEach(i => {
        if(historial[i+1]) antes[historial[i+1].numero] = (antes[historial[i+1].numero] || 0) + 1;
        if(historial[i-1]) despues[historial[i-1].numero] = (despues[historial[i-1].numero] || 0) + 1;
    });
    const mayorA = Object.keys(antes).sort((a,b) => antes[b] - antes[a])[0] || "--";
    const mayorD = Object.keys(despues).sort((a,b) => despues[b] - despues[a])[0] || "--";
    res.innerHTML = `<div style="padding:10px; background:#1e293b; border-radius:8px; margin-top:10px;">
        <p>Antes del ${num} suele salir: <b>${mayorA}</b></p>
        <p>Después del ${num} suele salir: <b>${mayorD}</b></p>
    </div>`;
}

async function guardarDato() {
    const n = document.getElementById('num-rapido').value;
    const f = new Date().toISOString().split('T')[0];
    const h = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    if(!DATA_ANIMALES[n]) { alert("Número inválido"); return; }
    await _supabase.from('historial_resultados').insert([{ fecha: f, hora: h, numero: n, animal: DATA_ANIMALES[n].a }]);
    document.getElementById('num-rapido').value = "";
    await cargarDatosRemotos();
}

// Gestión de Pestañas
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    };
});
