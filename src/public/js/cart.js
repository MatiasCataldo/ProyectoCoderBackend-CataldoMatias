// Suponiendo que tienes un formulario con el id 'getCartForm' en tu HTML
const getCartForm = document.getElementById('getCartForm');

getCartForm.addEventListener('submit', e => {
    e.preventDefault();
    
    fetch('/api/carts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Podrías incluir el token de autenticación si es necesario para acceder a los datos del carrito
            // 'Authorization': `Bearer ${token}`
        }
    }).then(result => {
        if (result.status === 200) {
            result.json()
                .then(cartData => {
                    // Aquí recibes los datos del carrito desde el servidor
                    console.log('Datos del carrito:', cartData);
                    // Lógica para actualizar la interfaz de usuario con los datos del carrito
                    updateCartUI(cartData);
                });
        } else {
            console.error('Error al obtener el carrito:', result);
            // Manejo de errores
        }
    })
});

// Función para actualizar la interfaz de usuario con los datos del carrito
function updateCartUI(cartData) {
    // Lógica para actualizar la interfaz de usuario con los datos del carrito
}
