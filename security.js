const CLAVE_MAESTRA = '7575'; 

function checkAccess() {
    const val = document.getElementById('access-key').value;
    if (val === CLAVE_MAESTRA) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        if (typeof inicializarSistema === 'function') inicializarSistema();
        
        setInterval(() => {
            const clock = document.getElementById('live-clock');
            if(clock) clock.innerText = new Date().toLocaleTimeString();
        }, 1000);
    } else {
        alert("CLAVE ERRÓNEA");
    }
}

document.getElementById('access-key')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAccess();
});
