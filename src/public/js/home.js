const createProductForm = document.querySelector('#createProductForm');
const addToCart = document.getElementById('products');

document.getElementById('logoutForm').addEventListener('click', async (e) => {
  e.preventDefault(); 

  try {
      const response = await fetch('https://proyectobackend-cataldomatias-production.up.railway.app/api/jwt/logout', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
        })
      console.log("Response: ", response)
      if (response.status === 200) {
        window.location.replace('/home')
      } else {
          console.error('Error al obtener respuesta al cerrar sesión:', response.statusText);
      }
  } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
  }
});