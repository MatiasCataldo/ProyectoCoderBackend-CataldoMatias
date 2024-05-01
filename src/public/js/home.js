const createProductForm = document.querySelector('#createProductForm');
const addToCart = document.getElementById('products');

document.getElementById('logoutForm').addEventListener('click', async (e) => {
  e.preventDefault(); 

  try {
      const response = await fetch('http://localhost:8080/api/jwt/logout', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
        })
      console.log("Response: ", response)
      if (response.ok) {
        window.location.replace('/home')
      } else {
          console.error('Error al obtener respuesta al cerrar sesión:', response.statusText);
      }
  } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
  }
});