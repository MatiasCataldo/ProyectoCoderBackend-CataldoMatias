document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('updateForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.querySelector('[name="email"]').value;
        const newPassword = form.querySelector('#newPassword').value;
        const repeatPassword = form.querySelector('#repiteNewPassword').value;

        if (newPassword !== repeatPassword) {
            alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
            return;
        }

        try {
            const response = await fetch('/api/users/updatePassword', {
                method: 'POST',
                body: JSON.stringify({ email, newPassword }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert('Contraseña actualizada con éxito.');
                window.location.href = '/users/login';
            } else {
                alert(`Error al actualizar la contraseña: ${data.error}`);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de red al intentar actualizar la contraseña.');
        }
    });
});
