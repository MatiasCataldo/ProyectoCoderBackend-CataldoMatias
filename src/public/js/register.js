const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    fetch('/api/jwt/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            Toastify({
                text: `Usuario creado con exito✅`,
                duration: 1500,
                gravity: "top", 
                position: "center", 
                stopOnFocus: true,
                style: {
                    background: "darkred",
                },
            }).showToast();
            window.location.href = '/login';
        }
    })
})