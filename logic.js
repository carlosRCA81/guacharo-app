const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const animales = [
    {n:'0', a:'DELFIN', t:'AGUA'}, {n:'00', a:'BALLENA', t:'AGUA'}, {n:'01', a:'CARNERO', t:'TIERRA'},
    {n:'02', a:'TORO', t:'TIERRA'}, {n:'03', a:'CIEMPIES', t:'TIERRA'}, {n:'04', a:'ALACRAN', t:'TIERRA'},
    {n:'05', a:'LEON', t:'TIERRA'}, {n:'06', a:'RANA', t:'AGUA'}, {n:'07', a:'PERICO', t:'AIRE'},
    {n:'08', a:'RATON', t:'TIERRA'}, {n:'09', a:'AGUILA', t:'AIRE'}, {n:'10', a:'TIGRE', t:'TIERRA'},
    {n:'11', a:'GATO', t:'TIERRA'}, {n:'12', a:'CABALLO', t:'TIERRA'}, {n:'13', a:'MONO', t:'TIERRA'},
    {n:'14', a:'PALOMA', t:'AIRE'}, {n:'15', a:'ZORRO', t:'TIERRA'}, {n:'16', a:'OSO', t:'TIERRA'},
    {n:'17', a:'PAVO', t:'AIRE'}, {n:'18', a:'BURRO', t:'TIERRA'}, {n:'19', a:'CHIVO', t:'TIERRA'},
    {n:'20', a:'COCHINO', t:'TIERRA'}, {n:'21', a:'GALLO', t:'TIERRA'}, {n:'22', a:'CAMELLO', t:'TIERRA'},
    {n:'23', a:'CEBRA', t:'TIERRA'}, {n:'24', a:'IGUANA', t:'TIERRA'}, {n:'25', a:'GALLINA', t:'TIERRA'},
    {n:'26', a:'VACA', t:'TIERRA'}, {n:'27', a:'PERRO', t:'TIERRA'}, {n:'28', a:'ZAMURO', t:'AIRE'},
    {n:'29', a:'ELEFANTE', t:'TIERRA'}, {n:'30', a:'CAIMAN', t:'AGUA'}, {n:'31', a:'LAPA', t:'TIERRA'},
    {n:'32', a:'ARDILLA', t:'TIERRA'}, {n:'33', a:'PESCADO', t:'AGUA'}, {n:'34', a:'VENADO', t:'TIERRA'},
    {n:'35', a:'JIRAFA', t:'TIERRA'}, {n:'36', a:'CULEBRA', t:'TIERRA'}, {n:'37', a:'TORTUGA', t:'TIERRA'},
    {n:'38', a:'BUFALO', t:'TIERRA'}, {n:'39', a:'LECHUZA', t:'AIRE'}, {n:'40', a:'AVISPA', t:'AIRE'},
    {n:'41', a:'CANGURO', t:'TIERRA'}, {n:'42', a:'TUCAN', t:'AIRE'}, {n:'43', a:'MARIPOSA', t:'AIRE'},
    {n:'44', a:'CHIGÜIRE', t:'TIERRA'}, {n:'45', a:'GARZA', t:'AIRE'}, {n:'46', a:'PUMA', t:'TIERRA'},
    {n:'47', a:'PAVO REAL', t:'AIRE'}, {n:'48', a:'PUERCOESPIN', t:'TIERRA'}, {n:'49', a:'PEREZA', t:'TIERRA'},
    {n:'50', a:'CANARIO', t:'AIRE'}, {n:'51', a:'PELICANO', t:'AIRE'}, {n:'52', a:'PULPO', t:'AGUA'},
    {n:'53', a:'CARACOL', t:'AGUA'}, {n:'54', a:'GRILLO', t:'TIERRA'}, {n:'55', a:'OSO HORMIGUERO', t:'TIERRA'},
    {n:'56', a:'TIBURON', t:'AGUA'}, {n:'57', a:'PATO', t:'AGUA'}, {n:'58', a:'HORMIGA', t:'TIERRA'},
    {n:'59', a:'PANTERA', t:'TIERRA'}, {n:'60', a:'CAMALEON', t:'TIERRA'}, {n:'61', a:'PANDA', t:'TIERRA'},
    {n:'62', a:'CACHICAMO', t:'TIERRA'}, {n:'63', a:'CANGREJO', t:'AGUA'}, {n:'64', a:'GAVILÁN', t:'AIRE'},
    {n:'65', a:'ARAÑA', t:'TIERRA'}, {n:'66', a:'LOBO', t:'TIERRA'}, {n:'67', a:'AVESTRUZ', t:'AIRE'},
    {n:'68', a:'JAGUAR', t:'TIERRA'}, {n:'69', a:'CONEJO', t:'TIERRA'}, {n:'70', a:'BISONTE', t:'TIERRA'},
    {n:'71', a:'GUACAMAYA', t:'AIRE'}, {n:'72', a:'GORILA', t:'TIERRA'}, {n:'73', a:'HIPOPOTAMO', t:'TIERRA'},
    {n:'74', a:'TURPIAL', t:'AIRE'}, {n:'75', a:'GUACHARO', t:'AIRE'}
];

const horas = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let dbData = [];
let selHora = null;

window.onload = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-reg').value = hoy;
    document.getElementById('fecha-hist').value = hoy;
    renderAnimales();
    await fetchAll();
    setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);
};

async function fetchAll() {
    const { data } = await _supabase.from('historial_sorteos').select('*').order('fecha', {ascending: false});
    if(data) { dbData = data; refresh(); }
}

function renderAnimales() {
    const cont = document.getElementById('animal-grid');
    cont.innerHTML = '';
    animales.forEach(a => {
        const d = document.createElement('div');
        d.className = 'animal-item';
        d.innerHTML = `<b>${a.n}</b><br>${a.a}`;
        d.onclick = () => save(a.n, a.a, a.t);
        cont.appendChild(d);
    });
}

function renderHoras() {
    const p = document.getElementById('hora-panel');
    p.innerHTML = '';
    const f = document.getElementById('fecha-reg').value;
    horas.forEach(h => {
        const b = document.createElement('div');
        b.className = 'hora-box';
        const r = dbData.find(x => x.fecha === f && x.hora === h);
        if(r) { b.classList.add('jugado'); b.innerText = `${h}\n(${r.num})`; }
        else { b.innerText = h; }
        if(h === selHora) b.classList.add('active-select');
        b.onclick = () => { selHora = h; renderHoras(); };
        p.appendChild(b);
    });
}

async function save(n, a, t) {
    if(!selHora) return alert("Selecciona Hora");
    const f = document.getElementById('fecha-reg').value;
    await _supabase.from('historial_sorteos').upsert({fecha: f, hora: selHora, num: n, animal: a, tipo: t});
    await fetchAll();
}

function filterHist() {
    const t = document.getElementById('hist-body');
    const f = document.getElementById('fecha-hist').value;
    t.innerHTML = '';
    const filtered = dbData.filter(x => x.fecha === f);
    if(filtered.length === 0) { t.innerHTML = '<tr><td colspan="5">No hay datos</td></tr>'; return; }
    filtered.sort((a,b) => horas.indexOf(b.hora) - horas.indexOf(a.hora)).forEach(r => {
        t.innerHTML += `<tr><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td><td>${r.tipo}</td></tr>`;
    });
}

function refresh() {
    renderHoras();
    filterHist();
    let sin75 = 0;
    const sorted = [...dbData].sort((a,b) => a.fecha.localeCompare(b.fecha) || horas.indexOf(a.hora) - horas.indexOf(b.hora));
    for(let i = sorted.length-1; i>=0; i--) { if(sorted[i].num === '75') break; sin75++; }
    document.getElementById('stat-75').innerText = sin75;
}

function openTab(e, n) {
    document.querySelectorAll('.tab-content').forEach(x => x.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
    document.getElementById(n).style.display = 'block';
    e.currentTarget.classList.add('active');
}
