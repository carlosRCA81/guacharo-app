const CLAVE_MAESTRA = '1234'; 
function checkAccess() {
    const inputPass = document.getElementById('access-key').value;
    if (inputPass === CLAVE_MAESTRA) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        if (typeof inicializarSistema === 'function') inicializarSistema();
    } else {
        alert("CLAVE INCORRECTA");
    }
}
