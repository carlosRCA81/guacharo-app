// ... (Todo tu código inicial de Supabase y lista de animales queda igual)

function actualizarInterfaz() {
    if(historial.length > 0) {
        const temp = [...historial].sort((a,b) => {
             if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
             return horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora);
        });
        const ult = temp[temp.length-1];
        document.getElementById('last-num').innerText = `${ult.num} - ${ult.animal}`;
    }
    actualizarTabla();
    analizarGuacharo();
    generarPanelDiario();
    calcularBalanceElementos();
    detectarDormidos(); // <-- AGREGADO: Para que limpie la lista de dormidos
}

// NUEVA FUNCIÓN: Escanea qué animales faltan por salir en tu base de datos
function detectarDormidos() {
    const listaDormidosCont = document.getElementById('lista-dormidos');
    if(!listaDormidosCont) return;

    let dormidos = [];
    listaAnimales.forEach(ani => {
        // Verifica si el número NO existe en el historial cargado
        const encontrado = historial.some(r => r.num === ani.n);
        if(!encontrado) {
            dormidos.push(ani.n + " (" + ani.a + ")");
        }
    });

    if(dormidos.length > 0) {
        // Muestra los primeros 8 para no llenar la pantalla
        listaDormidosCont.innerHTML = dormidos.slice(0, 8).join(', ') + "...";
    } else {
        listaDormidosCont.innerText = "Todos los animales han salido al menos una vez.";
    }
}

function analizarGuacharo() {
    let sin75 = 0;
    const tempSorted = [...historial].sort((a,b) => {
        if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
        return horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora);
    });

    for(let i = tempSorted.length-1; i >= 0; i--) {
        if(tempSorted[i].num === '75') break;
        sin75++;
    }
    const display = document.getElementById('dias-sin-75');
    if(display) display.innerText = sin75;

    const resEstudio = document.getElementById('resultado-patrones-guacharo');
    const alertaProb = document.getElementById('alerta-probabilidad'); // <-- AGREGADO

    if (resEstudio) {
        let antesDel75 = [];
        tempSorted.forEach((reg, idx) => {
            if (reg.num === '75' && idx > 0) {
                antesDel75.push(tempSorted[idx-1].num + " - " + tempSorted[idx-1].animal);
            }
        });
        
        if (antesDel75.length > 0) {
            const counts = {};
            antesDel75.forEach(x => counts[x] = (counts[x] || 0) + 1);
            const masFrec = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            
            resEstudio.innerHTML = `
                <div class="stat-card-mini" style="border-left-color: #ffd700;">
                    <h4>ANUNCIANTE CLAVE (75)</h4>
                    <p>Este animal suele salir antes del Guácharo:<br><strong>${masFrec}</strong></p>
                    <small>Frecuencia: ${counts[masFrec]} veces detectado</small>
                </div>`;

            // LÓGICA DE ALERTA: Si el último animal que salió es el anunciante
            const ultimoSorteo = tempSorted[tempSorted.length - 1];
            if (ultimoSorteo && (ultimoSorteo.num + " - " + ultimoSorteo.animal) === masFrec && alertaProb) {
                alertaProb.innerHTML = '<span class="probabilidad-alta">🔥 ¡ALTA PROBABILIDAD! Salió el anunciante.</span>';
            } else if (alertaProb) {
                alertaProb.innerHTML = '<span style="color:#64748b">Esperando señal del anunciante...</span>';
            }
        }
    }
}

// ... (El resto del código hacia abajo queda igual)
