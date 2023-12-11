
const socketClient = io();

const createProductForm = document.querySelector('#createProductForm');

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
