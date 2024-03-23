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
                alert('Email enviado! Por favor revise su correo.');
            } else {
                alert(`Error al enviar el correo: ${data.error}`);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de red al intentar actualizar la contraseña.');
        }
    });
});
