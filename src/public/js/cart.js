
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

//LISTENER
document.addEventListener('DOMContentLoaded', async () => {
    const token = getTokenFromCookie();
    const userEmail = getEmailFromCookie();
    const userId = await getUserIdFromEmail(userEmail);
    const decreaseBtns = document.querySelectorAll('.decreaseBtn');
    const increaseBtns = document.querySelectorAll('.increaseBtn');

    decreaseBtns.forEach(decreaseBtn => {
        decreaseBtn.addEventListener('click', () => {
            let quantityInput = decreaseBtn.nextElementSibling;
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantity--;
                quantityInput.value = quantity;
            }
        });
    });

    increaseBtns.forEach(increaseBtn => {
        increaseBtn.addEventListener('click', () => {
            let quantityInput = increaseBtn.previousElementSibling;
            let quantity = parseInt(quantityInput.value);
            if (quantity < 10) {
                quantity++;
                quantityInput.value = quantity;
            }
        });
    });

    //AGREGAR PRODUCTO AL CARRITO
    const buyButtons = document.querySelectorAll('.buy-button');

    buyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            if (!token) {
                Toastify({
                    text: `Debes Iniciar Sesion🔐`,
                    duration: 1500,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "#3498db",
                    },
                }).showToast();
            }
            const productId = button.dataset["_id"];
            const productTitle = button.dataset["title"];
            const productPrice = button.dataset["price"];
            const productImage = button.dataset["image"];
            const productQuantityInput = button.parentElement.querySelector('.quantityInput');
            const productQuantity = parseInt(productQuantityInput.value);


            const productData = {
                productId: productId,
                productName: productTitle,
                productPrice: productPrice,
                quantity: productQuantity,
                productImage: productImage
            };

            try {
                const response = await fetch(`https://proyectobackend-cataldomatias-production.up.railway.app/api/carts/${userId}/addItem`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    Toastify({
                        text: `Producto agregado: ${productTitle} ✅`,
                        duration: 1500,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                        style: {
                            background: "darkcyan",
                        },
                    }).showToast();
                } else {
                    console.error('Error al agregar el producto al carrito:', response.statusText);
                }
            } catch (error) {
                console.error('Error al agregar el producto al carrito:', error);
            }
        });
    });
});

//ELIMINAR PRODUCTO
document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-item');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const userEmail = getEmailFromCookie();
            const userId = await getUserIdFromEmail(userEmail);
            const productId = button.dataset.productid;


            try {
                const response = await fetch(`https://proyectobackend-cataldomatias-production.up.railway.app/api/carts/${userId}/deleteItem/${productId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el producto del carrito.');
                }

                Toastify({
                    text: `Producto Eliminado❌`,
                    duration: 1500,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "rgba(236, 3, 3, 0.945)",
                    }
                }).showToast();
                window.location.reload();
            } catch (error) {
                console.error('Error del servidor al eliminar el producto del carrito:', error);
            }
        });
    });
});

// COMPRAR
document.addEventListener('DOMContentLoaded', async () => {
    const buyButton = document.querySelector('#purchase');
    buyButton.addEventListener('click', async () => {
        try { 
            Swal.fire({
                title: 'Estamos Procesando su Compra!',
                icon: 'info',
                text: 'Por favor espere un momento!🕐',
                timer: 2500
            }).then(() => {
                document.getElementById('checkout-form').submit();
            });
        } catch (error) {
            console.error('Error al realizar la compra:', error);
        }
    });
});
