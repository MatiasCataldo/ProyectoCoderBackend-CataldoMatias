const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/jwt/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            result.json()
                .then(json => {
                    alert("Login realizado con exito!");
                    window.location.replace('/home/user');
                });
        } else if (result.status === 401) {
            alert("Login invalido revisa tus credenciales!");
        }
    })
})

document.getElementById("googleLogin").addEventListener("click", () => {
    // Redirige al usuario a la ruta de inicio de sesión de Google
    window.location.href = "/google";
});