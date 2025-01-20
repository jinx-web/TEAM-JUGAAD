// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartDisplay();

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                    <p>Eco Score: ${item.ecoscore}/10</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="removeFromCart(${index})" class="btn-remove">Remove</button>
                </div>
            `;
            cartItems.appendChild(itemElement);
            total += parseFloat(item.price);
        });

        if (cartTotal) {
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Update cart count in all pages
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function addToCart(product) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Clear cart functionality
const clearCartBtn = document.getElementById('clearCart');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    });
}

// Checkout functionality
const checkoutBtn = document.getElementById('checkout');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // Add checkout logic here
        alert('Proceeding to checkout...');
    });
}
