const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// BASE DE DATOS DE ANIMALES - EL LEÓN (05) ES ROJO
const listaAnimales = [
    {n:'0', a:'DELFIN', c:'AZUL', s:'A', e:'Agua'}, {n:'00', a:'BALLENA', c:'AZUL', s:'D', e:'Agua'},
    {n:'01', a:'CARNERO', c:'ROJO', s:'D', e:'Tierra'}, {n:'02', a:'TORO', c:'NEGRO', s:'A', e:'Tierra'},
    {n:'03', a:'CIEMPIES', c:'ROJO', s:'C', e:'Tierra'}, {n:'04', a:'ALACRAN', c:'ROJO', s:'F', e:'Tierra'},
    {n:'05', a:'LEON', c:'ROJO', s:'C', e:'Tierra'}, {n:'06', a:'RANA', c:'NEGRO', s:'F', e:'Agua'},
    {n:'07', a:'PERICO', c:'ROJO', s:'B', e:'Aire'}, {n:'08', a:'RATON', c:'NEGRO', s:'E', e:'Tierra'},
    {n:'09', a:'AGUILA', c:'ROJO', s:'A', e:'Aire'}, {n:'10', a:'TIGRE', c:'NEGRO', s:'D', e:'Tierra'},
    {n:'11', a:'GATO', c:'NEGRO', s:'B', e:'Tierra'}, {n:'12', a:'CABALLO', c:'ROJO', s:'E', e:'Tierra'},
    {n:'13', a:'MONO', c:'NEGRO', s:'D', e:'Tierra'}, {n:'14', a:'PALOMA', c:'ROJO', s:'A', e:'Aire'},
    {n:'15', a:'ZORRO', c:'NEGRO', s:'C', e:'Tierra'}, {n:'16', a:'OSO', c:'ROJO', s:'F', e:'Tierra'},
    {n:'17', a:'PAVO', c:'NEGRO', s:'B', e:'Aire'}, {n:'18', a:'BURRO', c:'ROJO', s:'E', e:'Tierra'},
    {n:'19', a:'CHIVO', c:'ROJO', s:'E', e:'Tierra'}, {n:'20', a:'COCHINO', c:'NEGRO', s:'B', e:'Tierra'},
    {n:'21', a:'GALLO', c:'ROJO', s:'F', e:'Aire'}, {n:'22', a:'CAMELLO', c:'NEGRO', s:'C', e:'Tierra'},
    {n:'23', a:'CEBRA', c:'ROJO', s:'F', e:'Tierra'}, {n:'24', a:'IGUANA', c:'NEGRO', s:'C', e:'Tierra'},
    {n:'25', a:'GALLINA', c:'ROJO', s:'D', e:'Aire'}, {n:'26', a:'VACA', c:'NEGRO', s:'A', e:'Tierra'},
    {n:'27', a:'PERRO', c:'ROJO', s:'D', e:'Tierra'}, {n:'28', a:'ZAMURO', c:'NEGRO', s:'A', e:'Aire'},
    {n:'29', a:'ELEFANTE', c:'NEGRO', s:'E', e:'Tierra'}, {n:'30', a:'CAIMAN', c:'ROJO', s:'B', e:'Agua'},
    {n:'31', a:'LAPA', c:'NEGRO', s:'E', e:'Tierra'}, {n:'32', a:'ARDILLA', c:'ROJO', s:'B', e:'Tierra'},
    {n:'33', a:'PESCADO', c:'NEGRO', s:'F', e:'Agua'}, {n:'34', a:'VENADO', c:'ROJO', s:'C', e:'Tierra'},
    {n:'35', a:'JIRAFA', c:'NEGRO', s:'A', e:'Tierra'}, {n:'36', a:'CULEBRA', c:'ROJO', s:'D', e:'Tierra'}
];

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historial = [];
let horaSeleccionadaActiva = null;

// ALGORITMO REFINADO: Cruces de Ruleta detectados en capturas 2024-2025
const reglasAtraccion = {
    '05': ['12', '18', '09', '34', '19', '11'], // León jala su sector y cruza con Águila/Gato
    '09': ['05', '12', '18', '14', '28'],       // Águila jala familia de Aire y cruza a Tierra
    '36': ['03', '30', '26', '24', '13'],       // Culebra cruza con Caimán y Mono (detectado en fotos)
    '25': ['07', '14', '21', '09'],             // Gallina jala Aire fuerte
    '00': ['29', '26', '01', '22', '35'],       // Ballena cruza con Elefante y Jirafa
    '12': ['05', '09', '18', '11', '13'],       // Caballo cruza con Gato y Mono
    '20': ['17', '11', '08', '07'],             // Cochino jala Ratón y cruza con Perico
    '30': ['03', '36', '26', '06', '00'],       // Caimán cruza con Agua (Rana/Ballena)
    '07': ['25', '11', '20', '14', '17'],       // Perico jala familia B
    '35': ['25', '08', '09', '26', '29'],       // Jirafa cruza con Vaca y Elefante
    '11': ['07', '20', '17', '12', '05']        // Gato cruza con León y Perico
};

async function inicializarSistema() {
    const fechaInput = document.getElementById('fecha-analisis');
    const fechaBusqueda = document.getElementById('fecha-busqueda-historial');
    if(fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
    if(fechaBusqueda) fechaBusqueda.value = new Date().toISOString().split('T')[0];
    
    generarGridBotones();
    llenarSelectorEstudio();
    await cargarHistorialRemoto();
}

async function cargarHistorialRemoto() {
    try {
        const { data, error } = await _supabase.from('historial_sorteos').select('*').order('fecha', { ascending: false });
        if (error) throw error;
        if (data) { historial = data; actualizarInterfaz(); }
    } catch (e) { console.error("Error cargando historial:", e); }
}

function generarPanelDiario() {
    const p = document.getElementById('panel-diario-sorteos');
    if(!p) return;
    const f = document.getElementById('fecha-analisis').value;
    p.innerHTML = '';
    horasSorteo.forEach(h => {
        const r = historial.find(x => x.fecha === f && x.hora === h);
        const b = document.createElement('div');
        b.className = `hora-box ${r?'jugado':''} ${h===horaSeleccionadaActiva?'active-select':''}`;
        b.innerHTML = r ? `${h}<br><b>${r.num}</b>` : h;
        b.onclick = () => { horaSeleccionadaActiva = h; generarPanelDiario(); };
        p.appendChild(b);
    });
}

async function registrarSorteo(num, animal, color, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num: num.toString(), animal, tipo: color };
    
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if(idx !== -1) historial[idx] = nuevo; else historial.unshift(nuevo);
    
    actualizarInterfaz();
    
    try { 
        await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' }); 
    } catch (e) { console.error("Error al guardar:", e); }
}

function actualizarInterfaz() {
    generarPanelDiario();
    actualizarTabla();
    actualizarJugadaSniper();
    generarTripletasFijas();
}

// LOGICA DE CRUCES PARA TRIPLETAS FIJAS
function generarTripletasFijas() {
    const cont = document.getElementById('seccion-tripletas');
    if(!cont) return;

    const fHoy = document.getElementById('fecha-analisis').value;
    const hoy = historial.filter(r => r.fecha === fHoy);
    
    // Si no hay sorteos hoy, usamos tripletas base de sectores calientes
    let t1 = ["05", "12", "18"]; // Tierra / León
    let t2 = ["07", "20", "17"]; // Familia B
    let t3 = ["09", "14", "25"]; // Aire / Cruce
    
    // Si ya hubo sorteos, el algoritmo calcula el cruce dinámico
    if(hoy.length > 0) {
        const ultimo = hoy[hoy.length-1].num;
        const jala = reglasAtraccion[ultimo] || [];
        if(jala.length >= 3) {
            t3 = [jala[0], jala[1], jala[2]];
        }
    }

    cont.innerHTML = `
        <div class="card-tripleta"><small>🔥 SECTOR CALIENTE (HISTÓRICO)</small><div class="tripleta-nums">${t1.join('-')}</div></div>
        <div class="card-tripleta"><small>🎯 CRUCE DE RULETA (SISTEMA)</small><div class="tripleta-nums">${t2.join('-')}</div></div>
        <div class="card-tripleta"><small>💎 JUGADA MAESTRA (SNIPER)</small><div class="tripleta-nums">${t3.join('-')}</div></div>
    `;
}

function actualizarJugadaSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    const panel = document.getElementById('panel-proxima-jugada');
    const aviso = document.getElementById('aviso-fuera');
    if(!display || !panel) return;

    const fHoy = document.getElementById('fecha-analisis').value;
    const hoy = historial.filter(r => r.fecha === fHoy).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    
    if (hoy.length === 0) {
        display.innerHTML = "ESPERANDO DATOS";
        return;
    }

    const ultimo = hoy[hoy.length - 1];
    let sugeridos = reglasAtraccion[ultimo.num] || [];
    
    if (sugeridos.length > 0) {
        panel.classList.add('alerta-caliente');
        try { document.getElementById('snd-alerta').play(); } catch(e){}
    } else {
        // Fallback: Si el número no tiene regla, busca por proximidad de sector
        const ani = listaAnimales.find(a => a.n === ultimo.num);
        sugeridos = listaAnimales.filter(a => a.s === ani.s && a.n !== ultimo.num).map(a => a.n).slice(0,3);
        panel.classList.remove('alerta-caliente');
    }

    display.innerHTML = sugeridos.map(n => `<span class="sniper-num-pill">${n}</span>`).join('');
    if(aviso) aviso.innerHTML = `🚫 FUERA: ${hoy.length >= 2 ? hoy[hoy.length - 2].num : "--"}`;
}

function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    if(!horaSeleccionadaActiva) return alert("Selecciona una hora primero");
    let v = input.value;
    if(v === "") return;
    if(v !== '0' && v !== '00') v = v.padStart(2, '0');
    const ani = listaAnimales.find(a => a.n === v);
    if(ani) {
        registrarSorteo(ani.n, ani.a, ani.c, horaSeleccionadaActiva);
        input.value = '';
    } else {
        alert("Número no válido");
    }
}

function generarGridBotones() {
    const cont = document.getElementById('grid-container');
    if(!cont) return;
    cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const d = document.createElement('div');
        d.className = "animal-btn";
        let borderColor = "#475569";
        if(a.c === 'ROJO') borderColor = "#ef4444";
        if(a.c === 'AZUL') borderColor = "#38bdf8";
        
        d.style.borderLeft = `4px solid ${borderColor}`;
        d.innerHTML = `<b>${a.n}</b><br>${a.a}`;
        d.onclick = () => { if(horaSeleccionadaActiva) registrarSorteo(a.n, a.a, a.c, horaSeleccionadaActiva); };
        cont.appendChild(d);
    });
}

function actualizarTabla() {
    const c = document.getElementById('lista-historial');
    const fInput = document.getElementById('fecha-busqueda-historial');
    if(!c || !fInput) return;
    const f = fInput.value;
    c.innerHTML = '';
    historial.filter(r => r.fecha === f).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora)).forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num);
        if(ani) {
            const colorStyle = r.tipo === 'ROJO' ? 'color:#ff4d4d' : r.tipo === 'AZUL' ? 'color:#38bdf8' : 'color:#94a3b8';
            c.innerHTML += `<tr>
                <td>${r.hora}</td>
                <td><b style="font-size:1.1rem">${r.num}</b></td>
                <td>${r.animal}</td>
                <td>${ani.s} / ${ani.e}</td>
                <td style="${colorStyle}; font-weight:bold">${r.tipo}</td>
            </tr>`;
        }
    });
}

function openTab(evt, n) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const target = document.getElementById(n);
    if(target) target.style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function estudiarAtraccion() {
    const val = document.getElementById('select-estudio-animal').value;
    const res = document.getElementById('resultado-atraccion');
    if (!val || !res) return;
    const comp = reglasAtraccion[val] || ["Calculando cruce..."];
    res.innerHTML = `<div style="margin-top:15px;"><b>Atracción directa por Cruce:</b><br><div style="display:flex; justify-content:center; gap:10px; margin-top:10px;">
        ${comp.map(n => `<span style="background:#ef4444; color:white; padding:8px 12px; border-radius:6px; font-weight:bold;">${n}</span>`).join('')}
    </div></div>`;
}

function llenarSelectorEstudio() {
    const s = document.getElementById('select-estudio-animal');
    if(!s) return;
    s.innerHTML = '<option value="">-- Seleccionar --</option>';
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

setInterval(() => { 
    const clock = document.getElementById('live-clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString(); 
}, 1000);

window.onload = inicializarSistema;
