import jwt_decode from "jwt-decode";

async function getUserIdFromEmail(email) {
    try {
        const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const userData = await response.json();
            return userData._id;
        } else {
            console.error('Error al obtener el ID de usuario del backend:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al obtener el ID de usuario del backend:', error);
        return null;
    }
}

function getEmailFromToken() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwtCookieToken='));
    if (jwtCookie) {
        const jwtToken = jwtCookie.split('=')[1];
        const decodedToken = jwt_decode(jwtToken);
        const email = decodedToken.email;
        return email;
    } else {
        console.error('No se encontró ninguna cookie que contenga el token JWT.');
        return null;
    }
}

const userEmail = getEmailFromToken();
const userId = getUserIdFromEmail(userEmail);
console.log('ID de usuario:', userId);

const buyButtons = document.querySelectorAll('.buy-button');

buyButtons.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();

        const productId = button.dataset.productId;
        const userId = userId;

        fetch(`/api/carts/${userId}/addItem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId })
        }).then(result => {
            if (result.status === 200) {
                console.log('Producto agregado al carrito con éxito');
            } else {
                console.error('Error al agregar producto al carrito:', result);
            }
        }).catch(error => {
            console.error('Error al agregar producto al carrito:', error);
        });
    });
});
