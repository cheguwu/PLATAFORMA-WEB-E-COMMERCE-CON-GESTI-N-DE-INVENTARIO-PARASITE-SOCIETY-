// --- cart-logic.js ---

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    const cartSubtotalSpan = document.getElementById('cart-subtotal');
    const productsContainer = document.querySelector('.lista-productos');
    const emptyCartMessage = document.querySelector('.empty-cart-message');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartDisplay() {
        if (!cartItemsContainer || !cartCountSpan || !cartSubtotalSpan || !emptyCartMessage) {
            console.error('ERROR: Uno o más elementos del carrito no se encontraron en el DOM.');
            return;
        }

        cartItemsContainer.innerHTML = '';
        let totalItems = 0;
        let subtotal = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                
                // Asegúrate de que item.size tenga un valor. Si no, usa 'N/A' como fallback.
                const itemIdWithTalla = `${item.id}-${item.size || 'N/A'}`; 
                
                console.log(`[updateCartDisplay] Creando item en carrito HTML. ID: ${item.id}, Talla guardada: ${item.size}, data-id del botón: ${itemIdWithTalla}`); // NUEVO LOG

                cartItemDiv.innerHTML = `
                    <img src="${item.imgSrc}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-size">Talla: ${item.size || ''}</span>
                        <span class="cart-item-price">s/${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="cart-item-quantity-controls">
                        <button class="decrease-quantity-btn" data-id="${itemIdWithTalla}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-quantity-btn" data-id="${itemIdWithTalla}">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${itemIdWithTalla}">&times;</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);

                totalItems += item.quantity;
                subtotal += item.price * item.quantity;
            });
        }

        cartCountSpan.textContent = totalItems;
        cartSubtotalSpan.textContent = `s/${subtotal.toFixed(2)}`;

        localStorage.setItem('cart', JSON.stringify(cart));
        console.log("[updateCartDisplay] Carrito guardado en localStorage:", cart); // NUEVO LOG
    }

    function addProductToCart(productId, productName, productPrice, productImgSrc, productSize) {
        console.log(`[addProductToCart] Añadiendo: ID=${productId}, Talla recibida=${productSize}`); // NUEVO LOG

        const existingItem = cart.find(item => item.id === productId && item.size === productSize);

        if (existingItem) {
            existingItem.quantity++;
            console.log("[addProductToCart] Item existente, cantidad aumentada:", existingItem); // NUEVO LOG
        } else {
            const newItem = {
                id: productId,
                name: productName,
                price: productPrice,
                imgSrc: productImgSrc,
                quantity: 1,
                size: productSize 
            };
            cart.push(newItem);
            console.log("[addProductToCart] Nuevo item añadido al carrito:", newItem); // NUEVO LOG
        }
        updateCartDisplay();
    }

    if (productsContainer) {
        productsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productDiv = e.target.closest('.producto');
                const productId = productDiv.dataset.id;
                const productName = productDiv.dataset.name;
                
                let productPrice = parseFloat(productDiv.dataset.price); 
                if (isNaN(productPrice)) { 
                    const priceText = productDiv.querySelector('p').textContent;
                    const match = priceText.match(/s\/([\d.,]+)/); 
                    if (match) {
                        productPrice = parseFloat(match[1].replace(',', '')); 
                    }
                }
                
                const productImgSrc = productDiv.querySelector('img').src;
                
                // --- PUNTO CRÍTICO ---
                const tallaSelectElement = productDiv.querySelector('.product-talla');
                if (!tallaSelectElement) {
                    console.error("ERROR: No se encontró el elemento SELECT con la clase 'product-talla' dentro del producto.", productDiv);
                    return; // Detener la ejecución si no se encuentra el select
                }
                const productSize = tallaSelectElement.value; // Obtener el valor seleccionado
                // --- FIN PUNTO CRÍTICO ---

                console.log(`[Add Button Click] ID producto DIV: ${productId}, Talla del SELECT: ${productSize}`); // NUEVO LOG MUY IMPORTANTE

                if (!isNaN(productPrice) && productPrice > 0) {
                     addProductToCart(productId, productName, productPrice, productImgSrc, productSize);
                } else {
                    console.error('Error: Precio del producto no válido al añadir al carrito.', productDiv);
                }
            }
        });
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const fullItemId = e.target.dataset.id;

            if (!fullItemId || typeof fullItemId !== 'string') {
                return;
            }

            const parts = fullItemId.split('-');
            if (parts.length < 2) {
                console.error("Error: El 'data-id' del botón de control del carrito no tiene el formato esperado (ID-TALLA).", fullItemId);
                return;
            }
            
            const productId = parts[0];
            const productSize = parts[1]; 

            console.log(`[Cart Button Click] Botón: ${e.target.className}, ID extraído: ${productId}, Talla extraída: ${productSize}`); // NUEVO LOG

            if (e.target.classList.contains('increase-quantity-btn')) {
                const item = cart.find(item => item.id === productId && item.size === productSize);
                if (item) {
                    item.quantity++;
                    updateCartDisplay();
                }
            } else if (e.target.classList.contains('decrease-quantity-btn')) {
                const itemIndex = cart.findIndex(item => item.id === productId && item.size === productSize);
                if (itemIndex !== -1) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity--;
                    } else {
                        cart.splice(itemIndex, 1); 
                    }
                    updateCartDisplay();
                }
            } else if (e.target.classList.contains('remove-item-btn')) {
                console.log(`[Remove Button Click] Intentando eliminar: ID=${productId}, Talla=${productSize}`); // NUEVO LOG
                cart = cart.filter(item => !(item.id === productId && item.size === productSize));
                updateCartDisplay();
                console.log("[Remove Button Click] Carrito después de intentar eliminar:", cart); // NUEVO LOG
            }
        });
    }

     const checkoutButton = document.querySelector('.btn-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                // En lugar de un alert, redirigimos a la página de checkout
                console.log("Redirigiendo a la página de checkout...");
                document.getElementById('cart-toggle').checked = false; // Cierra el popup del carrito antes de redirigir
                window.location.href = 'checkout.html'; // REDIRECCIÓN AQUÍ
            } else {
                alert('Tu carrito está vacío. ¡Añade algunos productos primero!');
            }
        });
    }

    updateCartDisplay();
});