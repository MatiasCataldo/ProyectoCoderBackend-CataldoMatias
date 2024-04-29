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
            Toastify({
                text: `Bienvenido a Helanus🍦`,
                duration: 1500,
                gravity: "top", 
                position: "center", 
                stopOnFocus: true,
                style: {
                    background: "darkred",
                },
            }).showToast();
            result.json()
                .then(json => {
                    window.location.replace('/home/user');
                });
        } else if (result.status === 401) {
            Toastify({
                text: `El email o contraseña son incorrectos⛔`,
                duration: 1500,
                gravity: "top", 
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "rgba(236, 3, 3, 0.945)",
                }
            }).showToast();
        }
    })
})

document.getElementById("googleLogin").addEventListener("click", () => {
    // Redirige al usuario a la ruta de inicio de sesión de Google
    window.location.href = "/google";
});