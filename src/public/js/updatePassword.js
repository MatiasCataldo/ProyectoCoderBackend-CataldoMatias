const form = document.getElementById('updateForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const newPassword = form.querySelector('#newPassword').value;
    const repeatPassword = form.querySelector('#repiteNewPassword').value;

    // Validar que las contraseñas coincidan
    if (newPassword !== repeatPassword) {
        alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
        return;
    }
})