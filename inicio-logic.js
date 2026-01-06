document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = 'http://localhost:5000'; // Cambia si usas otro puerto o dominio
  const container = document.querySelector('.lista-productos');

  async function loadProducts() {
    try {
      const res = await fetch('http://localhost:5000/api/productos')

      if (!res.ok) throw new Error('Error al cargar productos');
      const products = await res.json();

      container.innerHTML = '';

      products.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'producto';
        card.dataset.id = prod._id;
        card.dataset.name = prod.name;
        card.dataset.price = prod.price;

        card.innerHTML = `
          <img src="${BASE_URL}/${prod.imagePath}" alt="${prod.name}">
          <h3>${prod.name}</h3>
          <p>s/${prod.price.toFixed(2)}</p>
          <select class="product-talla">
            ${prod.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
          </select>
          <button class="add-to-cart-btn">Agregar al carrito</button>
        `;

        container.appendChild(card);
      });

    } catch (err) {
      console.error(err);
      container.innerHTML = '<p>Error al cargar productos.</p>';
    }
  }

  loadProducts();
});
