//OBTENER USUARIO POR EMAIL
async function getUserIdFromEmail(email) {
    try {
        const response = await fetch(`https://proyectobackend-cataldomatias-production.up.railway.app/api/users/email/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const userData = await response.json(); 
            return userData._id;
        } else {
            console.error('Error al obtener el ID de usuario del backend', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al obtener el ID de usuario', error);
        return null;
    }
}

//OBTENER EMAIL DE LA COOKIE
function getEmailFromCookie() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const emailCookie = cookies.find(cookie => cookie.startsWith('email'));
    if (emailCookie) {
        return decodeURIComponent(emailCookie.split('=')[1]);
    } else {
        console.error('No se encontró ninguna cookie que contenga el correo electrónico.');
        return null;
    }
}

//OBTENER TOKEN DE LA JWTCOOKIE
function getTokenFromCookie() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const tokenCookie = cookies.find(cookie => cookie.startsWith('jwtCookieToken'));
    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    } else {
        console.error('No se encontró ninguna cookie que contenga el token JWT.');
        return null;
    }
}

//OBTENER ID DEL CARRITO
async function getCartId(userId, token) {
    try {
        const response = await fetch(`https://proyectobackend-cataldomatias-production.up.railway.app/api/carts/${userId}/cartId`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            const responseData = await response.json();
            const cartId = responseData.cartId;
            return cartId;
        } else {
            console.error('Error al obtener el ID del carrito del backend', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al obtener el ID de usuario', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try{
        const token = getTokenFromCookie();
        const userEmail = getEmailFromCookie();
        const userId = await getUserIdFromEmail(userEmail);
        const userIdString = userId.toString();
        const cartId = await getCartId(userId, token);
        const response = await fetch(`https://proyectobackend-cataldomatias-production.up.railway.app/api/carts/${userIdString}/${cartId}/purchase`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
        })
        if (!response.ok) {
            console.error('Error al realizar la compra:', response.statusText);
        }
    }catch (error) {
        console.error('Error al procesar la compra:', error);
    }
})