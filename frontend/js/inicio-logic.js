document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:5000/api/productos')
    .then(response => response.json())
    .then(data => {
      const catalogo = document.getElementById('catalogo');
      if (!catalogo) return;

      catalogo.innerHTML = '';
      data.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        const imageUrl = `http://localhost:5000/uploads/${producto.imagen.replace(/\\/g, '/')}`;

        card.innerHTML = `
          <img src="${imageUrl}" alt="${producto.nombre}" />
          <h3>${producto.nombre}</h3>
          <p>S/. ${producto.precio.toFixed(2)}</p>
        `;
        catalogo.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error cargando productos:', error);
    });
});
