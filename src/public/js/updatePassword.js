console.log("El DOM ha sido cargado");

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('updateForm');
    
    form.addEventListener('submit', async (e) =>  {
        e.preventDefault();
        const email = form.querySelector('[name="email"]').value;
        console.log("email para rest: ", email);
        
        try {
            const response = await fetch('/api/email/send-email-to-reset', {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                Toastify({
                    text: `Email enviado! Por favor revise su correo.📧`,
                    duration: 1500,
                    gravity: "top", 
                    position: "center", 
                    stopOnFocus: true,
                    style: {
                        background: "darkred",
                    },
                }).showToast();
            } else {
                Toastify({
                    text: `Error al enviar el correo: ${data.error}⛔`,
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
    });
});
