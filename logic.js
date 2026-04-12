/* LÓGICA REPARADA ANALIZADOR CRCA */

const listaAnimales = [
    {n:'0', a:'DELFIN', t:'AGUA'}, {n:'00', a:'BALLENA', t:'AGUA'}, {n:'1', a:'CARNERO', t:'TIERRA'},
    {n:'2', a:'TORO', t:'TIERRA'}, {n:'3', a:'CIEMPIES', t:'TIERRA'}, {n:'4', a:'ALACRAN', t:'TIERRA'},
    {n:'5', a:'LEON', t:'TIERRA'}, {n:'6', a:'RANA', t:'AGUA'}, {n:'7', a:'PERICO', t:'AIRE'},
    {n:'8', a:'RATON', t:'TIERRA'}, {n:'9', a:'AGUILA', t:'AIRE'}, {n:'10', a:'TIGRE', t:'TIERRA'},
    {n:'11', a:'GATO', t:'TIERRA'}, {n:'12', a:'CABALLO', t:'TIERRA'}, {n:'13', a:'MONO', t:'TIERRA'},
    {n:'14', a:'PALOMA', t:'AIRE'}, {n:'15', a:'ZORRO', t:'TIERRA'}, {n:'16', a:'OSO', t:'TIERRA'},
    {n:'17', a:'PAVO', t:'AIRE'}, {n:'18', a:'BURRO', t:'TIERRA'}, {n:'19', a:'CHIVO', t:'TIERRA'},
    {n:'20', a:'COCHINO', t:'TIERRA'}, {n:'21', a:'GALLO', t:'AIRE'}, {n:'22', a:'CAMELLO', t:'TIERRA'},
    {n:'23', a:'CEBRA', t:'TIERRA'}, {n:'24', a:'IGUANA', t:'TIERRA'}, {n:'25', a:'GALLINA', t:'TIERRA'},
    {n:'26', a:'VACA', t:'TIERRA'}, {n:'27', a:'PERRO', t:'TIERRA'}, {n:'28', a:'ZAMURO', t:'AIRE'},
    {n:'29', a:'ELEFANTE', t:'TIERRA'}, {n:'30', a:'CAIMAN', t:'AGUA'}, {n:'31', a:'LAPA', t:'TIERRA'},
    {n:'32', a:'ARDILLA', t:'TIERRA'}, {n:'33', a:'PESCADO', t:'AGUA'}, {n:'34', a:'VENADO', t:'TIERRA'},
    {n:'35', a:'JIRAFA', t:'TIERRA'}, {n:'36', a:'CULEBRA', t:'TIERRA'}, {n:'37', a:'TORTUGA', t:'AGUA'},
    {n:'38', a:'CUCARACHA', t:'TIERRA'}, {n:'39', a:'LECHUZA', t:'AIRE'}, {n:'40', a:'AVISPA', t:'AIRE'},
    {n:'41', a:'ALACRAN', t:'TIERRA'}, {n:'42', a:'CIEMPIES', t:'TIERRA'}, {n:'43', a:'MARIPOSA', t:'AIRE'},
    {n:'44', a:'GATO', t:'TIERRA'}, {n:'45', a:'GARZA', t:'AIRE'}, {n:'46', a:'PUMA', t:'TIERRA'},
    {n:'47', a:'PAVO REAL', t:'AIRE'}, {n:'48', a:'ZORRO', t:'TIERRA'}, {n:'49', a:'RATON', t:'TIERRA'},
    {n:'50', a:'CANARIO', t:'AIRE'}, {n:'51', a:'PELICANO', t:'AIRE'}, {n:'52', a:'BURRO', t:'TIERRA'},
    {n:'53', a:'CHIVO', t:'TIERRA'}, {n:'54', a:'COCHINO', t:'TIERRA'}, {n:'55', a:'GALLO', t:'AIRE'},
    {n:'56', a:'CAMELLO', t:'TIERRA'}, {n:'57', a:'CEBRA', t:'TIERRA'}, {n:'58', a:'HORMIGA', t:'TIERRA'},
    {n:'59', a:'PANTERA', t:'TIERRA'}, {n:'60', a:'CAMALEON', t:'TIERRA'}, {n:'61', a:'GALLINA', t:'TIERRA'},
    {n:'62', a:'VACA', t:'TIERRA'}, {n:'63', a:'PERRO', t:'TIERRA'}, {n:'64', a:'ZAMURO', t:'AIRE'},
    {n:'65', a:'ELEFANTE', t:'TIERRA'}, {n:'66', a:'LOBO', t:'TIERRA'}, {n:'67', a:'AVESTRUZ', t:'AIRE'},
    {n:'68', a:'ARDILLA', t:'TIERRA'}, {n:'69', a:'CONEJO', t:'TIERRA'}, {n:'70', a:'TUCAN', t:'AIRE'},
    {n:'71', a:'VENADO', t:'TIERRA'}, {n:'72', a:'GORILA', t:'TIERRA'}, {n:'73', a:'JIRAFA', t:'TIERRA'},
    {n:'74', a:'TURPIAL', t:'AIRE'}, {n:'75', a:'GUACHARO', t:'AIRE'}
];

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historial = [];
let horaSeleccionada = null;

window.onload = async () => {
    iniciarReloj();
    await cargarHistorialRemoto();
    renderizarBotonesAnimales();
};

function iniciarReloj() {
    setInterval(() => {
        const h = document.getElementById('live-clock');
        if(h) h.innerText = new Date().toLocaleTimeString();
    }, 1000);
}

async function cargarHistorialRemoto() {
    try {
        const res = await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/historial');
        const datos = await res.json();
        if (datos && datos.length > 0) {
            historial = datos;
            actualizarInterfaz();
        }
    } catch (e) { console.error("Error al cargar datos remotos"); }
}

function actualizarInterfaz() {
    renderizarHoras();
    renderizarHistorial();
    analizar75();
    oraculoIA();
    const ultimo = historial[historial.length - 1];
    if(ultimo) document.getElementById('txt-ultimo').innerText = `${ultimo.num} - ${ultimo.animal}`;
}

function renderizarHistorial() {
    const lista = document.getElementById('lista-historial');
    const filtro = document.getElementById('filtro-mes').value;
    if(!lista) return;
    lista.innerHTML = "";

    const filtrados = historial.slice().reverse().filter(reg => {
        if (filtro === "todos") return true;
        return reg.fecha && reg.fecha.split('-')[1] === filtro;
    });

    filtrados.forEach(reg => {
        const tr = document.createElement('tr');
        if(reg.num === "75") tr.style.background = "rgba(251, 191, 36, 0.3)";
        tr.innerHTML = `<td>${reg.fecha}</td><td>${reg.hora}</td><td>${reg.num}</td><td>${reg.animal}</td>`;
        lista.appendChild(tr);
    });
}

function oraculoIA() {
    if(historial.length < 2) return;
    const panel = document.getElementById('panel-ia-datos');
    const ultimo = historial[historial.length - 1];
    
    let pesos = {};
    listaAnimales.forEach(a => pesos[a.n] = 0);

    const espejo = ultimo.num.split('').reverse().join('');
    if(pesos[espejo] !== undefined) pesos[espejo] += 50;

    const sig = (parseInt(ultimo.num) + 1).toString();
    if(pesos[sig] !== undefined) pesos[sig] += 40;

    const top3 = Object.entries(pesos).sort((a,b) => b[1] - a[1]).slice(0, 3);
    
    if(panel) {
        panel.innerHTML = "";
        top3.forEach(n => {
            const ani = listaAnimales.find(a => a.n === n[0]);
            panel.innerHTML += `<div style="background:#0f172a; padding:10px; border-radius:8px; border:1px solid #38bdf8;">
                <b style="font-size:1.2rem; color:#fbbf24;">${n[0]}</b><br><small>${ani.a}</small>
            </div>`;
        });
    }
}

function analizar75() {
    const salidas = historial.filter(r => r.num === "75");
    const display = document.getElementById('dias-sin-75');
    if(salidas.length > 0 && display) {
        const ultima = new Date(salidas[salidas.length-1].fecha);
        const hoy = new Date();
        const diff = Math.floor((hoy - ultima) / (1000 * 60 * 60 * 24));
        display.innerText = diff;
    }
}

// FUNCIONES DE REGISTRO (Tus originales intactas)
function renderizarHoras() {
    const grid = document.getElementById('grid-horas');
    if(!grid) return;
    grid.innerHTML = "";
    const hoy = new Date().toISOString().split('T')[0];
    horasSorteo.forEach(h => {
        const div = document.createElement('div');
        div.className = 'hora-box';
        const reg = historial.find(r => r.fecha === hoy && r.hora === h);
        if(reg) {
            div.classList.add('jugado');
            div.innerText = `${h}\n(${reg.num})`;
        } else { div.innerText = h; }
        div.onclick = () => {
            horaSeleccionada = h;
            document.querySelectorAll('.hora-box').forEach(b => b.style.border = "1px solid #475569");
            div.style.border = "2px solid #38bdf8";
        };
        grid.appendChild(div);
    });
}

function renderizarBotonesAnimales() {
    const grid = document.getElementById('grid-botones-animales');
    if(!grid) return;
    grid.innerHTML = "";
    listaAnimales.forEach(a => {
        const btn = document.createElement('div');
        btn.className = 'animal-item';
        btn.innerHTML = `<b>${a.n}</b><br>${a.a}`;
        btn.onclick = () => registrar(a.n, a.a, a.t);
        grid.appendChild(btn);
    });
}

async function registrar(num, animal, tipo) {
    if(!horaSeleccionada) return alert("Selecciona una hora");
    const fecha = new Date().toISOString().split('T')[0];
    const reg = {fecha, hora: horaSeleccionada, num, animal, tipo};
    historial.push(reg);
    actualizarInterfaz();
    try {
        await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/guardar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(reg)
        });
    } catch (e) {}
}

function guardarRapido() {
    const val = document.getElementById('num-rapido').value;
    const ani = listaAnimales.find(a => a.n === val);
    if(ani) registrar(ani.n, ani.a, ani.t);
    document.getElementById('num-rapido').value = "";
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.currentTarget.classList.add('active');
}

async function borrarUltimo() {
    if(!confirm("¿Borrar el último?")) return;
    historial.pop();
    actualizarInterfaz();
}
