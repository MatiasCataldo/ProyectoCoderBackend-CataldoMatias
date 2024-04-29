async function getUserIdFromEmail(email) {
    try {
        const response = await fetch(`http://localhost:8080/api/users/email/${encodeURIComponent(email)}`, {
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

async function updateCartCounter() {
    const userEmail = getEmailFromCookie();
    const userId = await getUserIdFromEmail(userEmail);

    try {
        const response = await fetch(`http://localhost:8080/api/carts/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getTokenFromCookie()}`
            }
        });

        if (response.ok) {
            const cartData = await response.json();
            const totalProducts = cartData.products.reduce((total, product) => total + product.quantity, 0);
            const contadorProductosElement = document.querySelector('#productosEnCarrito .badge');
            contadorProductosElement.textContent = totalProducts;
        } else {
            console.error('Error al obtener la información del carrito:', response.statusText);
        }
    } catch (error) {
        console.error('Error al actualizar el contador de productos en el carrito:', error);
    }
}

//LISTENER
document.addEventListener('DOMContentLoaded', async () => {
    const token = getTokenFromCookie();
    const userEmail = getEmailFromCookie();
    const userId = await getUserIdFromEmail(userEmail);
    const decreaseBtns = document.querySelectorAll('.decreaseBtn');
    const increaseBtns = document.querySelectorAll('.increaseBtn');

    updateCartCounter();

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


    const buyButtons = document.querySelectorAll('.buy-button');

    buyButtons.forEach(button => {
        button.addEventListener('click', async () => {
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
            console.log("DATA PRODUCT: ", productData)
            try {
                const response = await fetch(`http://localhost:8080/api/carts/${userId}/addItem`, {
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
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true,
                        style: {
                            background: "darkcyan",
                        },
                    }).showToast();
                    updateCartCounter();
                    console.log('Producto agregado al carrito');
                } else {
                    console.error('Error al agregar el producto al carrito:', response.statusText);
                }
            } catch (error) {
                console.error('Error al agregar el producto al carrito:', error);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-item');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const userEmail = getEmailFromCookie();
            const userId = await getUserIdFromEmail(userEmail);
            const productId = button.dataset.productid;

            
            try {
                const response = await fetch(`http://localhost:8080/api/carts/${userId}/deleteItem/${productId}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error('Error al eliminar el producto del carrito.');
                }

                Toastify({
                    text: `Producto Eliminado❌`,
                    duration: 1500,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true,
                    style: {
                        background: "rgba(236, 3, 3, 0.945)",
                    }
                }).showToast();
                updateCartCounter();
                window.location.reload();
            } catch (error) {
                console.error('Error del servidor al eliminar el producto del carrito:', error);
            }
        });
    });
});
