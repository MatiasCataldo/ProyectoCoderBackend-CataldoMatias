console.log("El DOM ha sido cargado");

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('updateForm');
    
    form.addEventListener('submit', async (e) =>  {
        e.preventDefault();
        const newPassword = form.querySelector('[name="password"]').value;
        const repeatPassword = form.querySelector('[name="newPassword"]').value;

        if (newPassword !== repeatPassword) {
            Toastify({
                text: `Las contraseñas no coinciden. Por favor, inténtalo de nuevo.⛔`,
                duration: 1500,
                gravity: "top", 
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "rgba(236, 3, 3, 0.945)",
                }
            }).showToast();
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
                Swal.fire({
                    title: 'Contraseña Actializada',
                    icon: 'success',
                    text: 'con exito!🔐',
                    timer: 2500
                });
                window.location.replace('/home');
            } else {
                Toastify({
                    text: `Error al actualizar la contraseña: ${data.error}⛔`,
                    duration: 1500,
                    gravity: "top", 
                    position: "center",
                    stopOnFocus: true,
                    style: {
                        background: "rgba(236, 3, 3, 0.945)",
                    }
                }).showToast();
            }
        } catch (error) {
            console.error('Error de red:', error);
            Toastify({
                text: `Error de red al intentar actualizar la contraseña.❌`,
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