const socketClient = io();

const createProductForm = document.querySelector('#createProductForm');
const addToCart = document.getElementById('products');

document.getElementById('logoutForm').addEventListener('submit', async (e) => {
  e.preventDefault(); 

  try {
      const response = await fetch('/jwt/logout', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: 'same-origin'
        })

      if (response.ok) {
          window.location.href = '/home';
      } else {
          console.error('Error al cerrar sesión:', response.statusText);
      }
  } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
  }
});

createProductForm.addEventListener('submit', (event) => {
  event.preventDefault();
  console.log('Formulario de creación de producto enviado');
  const newProduct = {
    id: document.getElementById('id').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
    thumbnail: document.getElementById('thumbnail').value,
    stock: parseInt(document.getElementById('stock').value),
    category: document.getElementById('category').value,
  };
  console.log('Nuevo producto:', newProduct);
  socketClient.emit('createProduct', newProduct);
});

const deleteProductForm = document.querySelector('#deleteProductForm');

deleteProductForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const productCode = parseInt(document.getElementById('productCode').value);
  console.log('Código de producto a eliminar:', productCode);
  socketClient.emit('deleteProduct', productCode);
});

socketClient.on('productListUpdated', (updatedProductList) => {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';
  updatedProductList.forEach((product) => {
    const listItem = document.createElement('li');
    listItem.textContent = product.title;
    productList.appendChild(listItem);
  });
});

const chatForm = document.getElementById('chatForm');
const messagesContainer = document.getElementById('messages');

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const user = document.getElementById('user').value;
  const message = document.getElementById('message').value;
  if (user && message) {
    socketClient.emit('chatMessage', { user, message });
    document.getElementById('message').value = '';
  }
});

socketClient.on('chatMessage', (message) => {
  const messageElement = document.createElement('p');
  messageElement.innerHTML = `<strong>${message.user}:</strong> ${message.message}`;
  messagesContainer.appendChild(messageElement);
});

document.addEventListener('DOMContentLoaded', () => {
  const buyButtons = document.querySelectorAll('.buy-button');
  buyButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
          event.preventDefault(); 
          const productId = button.getAttribute('data-product-id');
          socketClient.emit('addToCart', { productId });
          button.style.backgroundColor = 'green';
          button.disabled = true;
      });
  });
});