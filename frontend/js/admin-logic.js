document.addEventListener('DOMContentLoaded', () => {
  const formAgregar = document.getElementById('agregar-producto-form');
  const productList = document.getElementById('product-list');

  formAgregar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(formAgregar);

    try {
      const response = await fetch('http://localhost:5000/api/productos', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }

      const result = await response.json();
      alert('Producto agregado correctamente');
      console.log(result);

      formAgregar.reset();
      cargarProductos(); // Recargar la tabla
    } catch (err) {
      console.error(err);
      alert('No se pudo agregar el producto');
    }
  });

  async function cargarProductos() {
    try {
      const response = await fetch('http://localhost:5000/api/productos');
      const productos = await response.json();

      productList.innerHTML = '';
      productos.forEach(producto => {
const imageUrl = producto.imagen.startsWith('http')
  ? producto.imagen
  : `http://localhost:5000/uploads/${producto.imagen}`;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${producto._id}</td>
          <td>${producto.nombre}</td>
          <td>${producto.descripcion}</td>
          <td>${producto.precio}</td>
          <td><img src="${imageUrl}" width="100"></td>
          <td></td>
        `;
        productList.appendChild(row);
      });
    } catch (err) {
      console.error('Error al cargar productos', err);
    }
  }

  cargarProductos();
});
