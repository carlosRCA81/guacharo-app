// CREDENCIALES EXTRAÍDAS DE TUS CÓDIGOS ORIGINALES
const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let historial = [];

function checkAccess() {
    const pass = document.getElementById('access-key').value;
    if (pass === '1234') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        inicializarSistema();
    } else { alert("CLAVE INCORRECTA"); }
}

function inicializarSistema() {
    cargarHistorialRemoto();
    setInterval(() => {
        document.getElementById('live-clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
}

// CARGA INICIAL: Asegura que el historial se vea al entrar
async function cargarHistorialRemoto() {
    console.log("Conectando a Supabase...");
    const { data, error } = await _supabase
        .from('historial_sorteos')
        .select('*')
        .order('fecha', { ascending: false })
        .order('hora', { ascending: false });
    
    if (error) {
        console.error("Error en conexión:", error.message);
        return;
    }
    
    historial = data;
    actualizarInterfaz();
}

// FILTRO POR ALMANAQUE
async function filtrarPorFecha() {
    const fechaBusqueda = document.getElementById('filtro-fecha-almanaque').value;
    if (!fechaBusqueda) return;

    const { data, error } = await _supabase
        .from('historial_sorteos')
        .select('*')
        .eq('fecha', fechaBusqueda)
        .order('hora', { ascending: true });

    if (!error) {
        historial = data;
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    const cuerpo = document.getElementById('lista-historial');
    cuerpo.innerHTML = '';
    
    let sin75 = 0;
    let encontrado75 = false;

    historial.forEach(r => {
        // RESALTADO PROFESIONAL DEL 75 (GUACHARO)
        const esEspecial = r.num === '75' ? 'class="row-guacharo"' : '';
        
        if (r.num === '75') encontrado75 = true;
        if (!encontrado75) sin75++;

        cuerpo.innerHTML += `
            <tr ${esEspecial}>
                <td>${r.fecha}</td>
                <td>${r.hora}</td>
                <td><strong>${r.num}</strong></td>
                <td>${r.animal}</td>
            </tr>`;
    });

    document.getElementById('dias-sin-75').innerText = sin75;
    if (historial.length > 0) {
        document.getElementById('last-num').innerText = `${historial[0].num} - ${historial[0].animal}`;
    }
}

function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let c of contents) c.style.display = "none";
    const btns = document.getElementsByClassName("tab-btn");
    for (let b of btns) b.classList.remove("active");
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}
