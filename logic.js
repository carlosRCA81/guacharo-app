/* LÓGICA INTEGRAL ANALIZADOR CRCA - REPARADA */

// ... (Conserva tu listaAnimales y horasSorteo igual) ...

// --- CORRECCIÓN EN EL INICIO ---
function inicializarSistema() {
    generarPanelDiario();
    generarGridBotones();
    llenarSelectEstudio();
    
    const fechaInput = document.getElementById('fecha-analisis');
    if(fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
        fechaInput.addEventListener('change', generarPanelDiario);
    }
    
    // ESTO ES LO QUE FALTABA: Cargar los datos de la nube al entrar
    cargarHistorialRemoto(); 
}

// --- FUNCIÓN DE TABLA REPARADA CON FILTRO DE MESES ---
function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    const filtro = document.getElementById('filtro-mes') ? document.getElementById('filtro-mes').value : "todos";
    
    if(!cuerpo) return;
    cuerpo.innerHTML = '';

    // Filtrar por mes para que la web sea más rápida
    const filtrados = historial.slice().reverse().filter(reg => {
        if (filtro === "todos") return true;
        const mesReg = reg.fecha.split('-')[1]; // Extrae el mes de "2026-04-12"
        return mesReg === filtro;
    });

    filtrados.forEach(r => {
        cuerpo.innerHTML += `<tr>
            <td>${r.fecha}</td>
            <td>${r.hora}</td>
            <td style="color:#fbbf24; font-weight:bold;">${r.num}</td>
            <td>${r.animal}</td>
            <td>${r.tipo}</td>
        </tr>`;
    });
}

// --- FUNCIÓN DE ACCESO (Asegúrate que esté en logic.js o security.js) ---
function checkAccess() {
    const key = document.getElementById('access-key').value;
    if(key === "2026") {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        inicializarSistema();
    } else {
        alert("Clave incorrecta");
    }
}

// ... (Conserva el resto de tus funciones registrarSorteo, cargarHistorialRemoto, etc., igual) ...
