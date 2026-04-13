function checkAccess() {
    const pass = document.getElementById('access-key').value;
    if(pass === '1234') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        inicializarSistema();
    } else {
        alert("Clave incorrecta");
    }
}
