// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Function to load product details
function loadProductDetails() {
    // Find product from sample products
    const product = sampleProducts.find(p => p.id === parseInt(productId));
    
    if (!product) {
        document.getElementById('productDetails').innerHTML = `
            <div class="col-12 text-center">
                <h2>Product not found</h2>
                <a href="index.html" class="btn btn-success mt-3">Back to Home</a>
            </div>
        `;
        return;
    }

    // Update page title
    document.title = `${product.name} - EcoEssentials`;

    // Generate HTML for product details
    const detailsHTML = `
        <div class="col-md-6">
            <div class="position-relative">
                <img src="${product.image}" class="img-fluid product-image" alt="${product.name}" id="mainImage"
                     onerror="this.src='assets/images/products/default-product.jpg'">
                <span class="sustainability-badge">
                    <i class="fas fa-leaf"></i> ${product.sustainability_score}/10
                </span>
            </div>
        </div>
        <div class="col-md-6">
            <h2>${product.name}</h2>
            <div class="d-flex align-items-center mb-3">
                <h3 class="text-success mb-0">₹${product.price}</h3>
            </div>
            <p class="lead">${product.description}</p>
            
            <div class="eco-feature mb-4">
                <h4><i class="fas fa-leaf text-success"></i> Sustainability Features</h4>
                <ul class="list-unstyled">
                    <li><i class="fas fa-check text-success"></i> Made from eco-friendly materials</li>
                    <li><i class="fas fa-check text-success"></i> Sustainable packaging</li>
                    <li><i class="fas fa-check text-success"></i> Local production</li>
                    <li><i class="fas fa-check text-success"></i> Reduces plastic waste</li>
                </ul>
            </div>

            <div class="mb-4">
                <label class="form-label">Quantity</label>
                <div class="input-group quantity-selector">
                    <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(-1)">-</button>
                    <input type="number" class="form-control text-center" id="quantity" value="1" min="1" max="10">
                    <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(1)">+</button>
                </div>
            </div>

            <button class="btn btn-success btn-lg mb-4" onclick="addToCartFromDetails(${product.id})">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>

            <div class="seller-info">
                <h4>Seller Information</h4>
                <p><i class="fas fa-store text-success"></i> ${product.sellerName || 'EcoEssentials Store'}</p>
                <div id="map" class="mb-3"></div>
            </div>
        </div>
    `;

    document.getElementById('productDetails').innerHTML = detailsHTML;
    initMap();
}

// Update quantity
function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let newQuantity = parseInt(quantityInput.value) + change;
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;
    quantityInput.value = newQuantity;
}

// Add to cart from details page
function addToCartFromDetails(productId) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Add the selected quantity of items
    for (let i = 0; i < quantity; i++) {
        cart.push({ id: productId });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
    
    // Show success message
    alert('Product added to cart!');
}

// Initialize map
function initMap() {
    try {
        mapboxgl.accessToken = 'pk.eyJ1IjoiamlueGdpcmkiLCJhIjoiY202MzM2ZHJ3MHVkMjJ3c2V1ZTE4em13MiJ9.M6tDB0ZXH9TMwOaGr5NFjg';
        
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [77.3910, 28.5355], // Default to Noida
            zoom: 11
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());

        // Add marker
        new mapboxgl.Marker()
            .setLngLat([77.3910, 28.5355])
            .addTo(map);

    } catch (error) {
        console.error('Error initializing map:', error);
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="alert alert-danger text-center">
                    <i class="fas fa-exclamation-circle"></i>
                    Error loading map. Please try again later.
                </div>
            `;
        }
    }
}

// Load product details when page loads
document.addEventListener('DOMContentLoaded', loadProductDetails);
