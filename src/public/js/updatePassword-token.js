console.log("El DOM ha sido cargado");

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('updateForm');
    
    form.addEventListener('submit', async (e) =>  {
        e.preventDefault();
        const newPassword = form.querySelector('[name="password"]').value;
        const repeatPassword = form.querySelector('[name="newPassword"]').value;

        if (newPassword !== repeatPassword) {
            alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
            return;
        }

        try {
            const token = window.location.pathname.split('/').pop();
            const response = await fetch(`/api/email/reset-password/${token}`, {
                method: 'POST',
                body: JSON.stringify({ newPassword }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }); 

            const data = await response.json();

            if (response.ok) {
                alert('Contraseña Actualizada con exito!');
                window.location.replace('/home');
            } else {
                alert(`Error al actualizar la contraseña: ${data.error}`);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de red al intentar actualizar la contraseña.');
        }
    })
}) 