document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('catalogo-container');

  try {
    const res = await fetch('http://localhost:5000/api/productos');
    const productos = await res.json();

    productos.forEach(producto => {
      const card = document.createElement('div');
      card.className = 'producto-card';

      card.innerHTML = `
        <img src="http://localhost:5000/${producto.imagen}" alt="${producto.nombre}" class="producto-img">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">S/ ${producto.precio}</p>
        <button class="agregar-btn">Agregar al carrito</button>
      `;

      const btnAgregar = card.querySelector('.agregar-btn');
      btnAgregar.addEventListener('click', () => agregarAlCarrito(producto));

      contenedor.appendChild(card);
    });
  } catch (err) {
    console.error('Error cargando productos:', err);
    contenedor.innerHTML = '<p>Error al cargar productos.</p>';
    }
    function agregarAlCarrito(productId) {
  // Obtener carrito del localStorage
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Verificar si ya está en el carrito
  const index = carrito.findIndex(p => p.productId === productId);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ productId, cantidad: 1 });
  }

  // Guardar carrito actualizado
  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert('Producto agregado al carrito');
}
    });