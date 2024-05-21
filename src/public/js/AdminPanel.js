document.addEventListener('DOMContentLoaded', function () {
    const addUserButton = document.querySelector('#addUserBtn');
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));

    addUserButton.addEventListener('click', function () {
        modal.show();
    });

    const form = document.querySelector('#registerForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const obj = {};
        formData.forEach((value, key) => obj[key] = value);
        try {
            const response = await fetch('https://proyectobackend-cataldomatias-production.up.railway.app/api/jwt/register', {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                Swal.fire({
                    title: 'Usuario creado con éxito✅',
                    icon: 'success',
                    text: '48hs inactivos',
                    timer: 2500
                });
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error.message);
            Toastify({
                text: `Se produjo un error al crear el usuario⛔`,
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
    // Evento para eliminar usuarios inactivos
    const eliminarUsuariosBtn = document.getElementById('eliminarUsuariosBtn');
    eliminarUsuariosBtn.addEventListener('click', async function () {
        try {
            const response = await fetch('https://proyectobackend-cataldomatias-production.up.railway.app/api/users', {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Usuarios inactivos eliminados correctamente.',
                    icon: 'success',
                    text: '48hs inactivos',
                    timer: 2500
                });
                window.location.reload();
            } else {
                throw new Error('Error al eliminar usuarios inactivos.');
            }
        } catch (error) {
            console.error('Error:', error.message);
            Toastify({
                text: `Se produjo un error al eliminar usuarios inactivos.⛔`,
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

    // Evento para cambiar el rol de un usuario
    document.querySelectorAll('[id^="changeRoleBtn_"]').forEach(btn => {
        btn.addEventListener('click', async function () {
            const userId = this.id.split('_')[1];

            try {
                const response = await fetch(`https://proyectobackend-cataldomatias-production.up.railway.app/api/users/premium/${userId}`, {
                    method: 'PUT'
                });

                if (response.ok) {
                    Toastify({
                        text: `Rol del usuario cambiado correctamente.✅`,
                        duration: 1500,
                        gravity: "top", 
                        position: "center",
                        stopOnFocus: true,
                        style: {
                            background: "darkcyan",
                        },
                    }).showToast();
                    window.location.reload();
                } else {
                    throw new Error('Error al cambiar el rol del usuario.');
                }
            } catch (error) {
                console.error('Error:', error.message);
                Toastify({
                    text: `Se produjo un error al intentar cambiar el rol del usuario.⛔`,
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

    const deleteButtons = document.querySelectorAll('.delete-user-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const userId = button.getAttribute('data-user-id');
            
            try {
                const response = await fetch(`/api/users/${userId}/deleteUser`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Usuario eliminado correctamente.',
                        icon: 'success',
                        text: '',
                        timer: 2500
                    });
                    window.location.reload();
                } else {
                    throw new Error('Error al eliminar usuario');
                }
            } catch (error) {
                Toastify({
                    text: `Se produjo un error al eliminar el usuario.⛔`,
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
});
