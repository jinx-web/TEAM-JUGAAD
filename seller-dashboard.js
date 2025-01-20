// Initialize Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiamlueGdpcmkiLCJhIjoiY202MzM2ZHJ3MHVkMjJ3c2V1ZTE4em13MiJ9.M6tDB0ZXH9TMwOaGr5NFjg';
let map;
let marker;
let currentSeller = null;

// Check if seller is logged in
function checkSellerAuth() {
    const seller = JSON.parse(localStorage.getItem('currentSeller'));
    if (!seller) {
        window.location.href = 'seller.html';
        return;
    }
    currentSeller = seller;
    loadSellerData();
}

// Load seller data
function loadSellerData() {
    // Update header with business name
    document.getElementById('businessName').textContent = currentSeller.businessName;
    
    // Update dashboard stats
    document.getElementById('totalProducts').textContent = currentSeller.stats.totalProducts || 0;
    document.getElementById('totalOrders').textContent = currentSeller.stats.totalOrders || 0;
    document.getElementById('totalSales').textContent = '₹' + (currentSeller.stats.totalSales || 0).toLocaleString();
    document.getElementById('sellerRating').textContent = currentSeller.stats.rating || 'N/A';

    // Load products
    loadProducts();
    
    // Initialize analytics
    initializeCharts();
}

// Dashboard Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main > div').forEach(div => div.classList.add('d-none'));
    // Show selected section
    document.getElementById(sectionId + 'Section').classList.remove('d-none');
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
}

// Initialize Map
function initializeMap() {
    map = new mapboxgl.Map({
        container: 'shopLocationMap',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [78.9629, 20.5937], // India center
        zoom: 4
    });

    map.addControl(new mapboxgl.NavigationControl());

    // Click on map to set location
    map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        document.getElementById('shopLatitude').value = lat;
        document.getElementById('shopLongitude').value = lng;
        
        if (marker) marker.remove();
        marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map);
    });
}

// Get Current Location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            document.getElementById('shopLatitude').value = latitude;
            document.getElementById('shopLongitude').value = longitude;
            
            map.flyTo({
                center: [longitude, latitude],
                zoom: 15
            });

            if (marker) marker.remove();
            marker = new mapboxgl.Marker()
                .setLngLat([longitude, latitude])
                .addTo(map);
        });
    }
}

// Product Management
function loadProducts() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = ''; // Clear existing products

    if (currentSeller.products && currentSeller.products.length > 0) {
        currentSeller.products.forEach(product => {
            const productCard = createProductCard(product);
            productsList.appendChild(productCard);
        });
    } else {
        productsList.innerHTML = '<div class="text-center p-4">No products added yet. Add your first product!</div>';
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4 mb-4';
    card.innerHTML = `
        <div class="card h-100">
            <img src="${product.image || 'https://placehold.co/300x200?text=Product+Image'}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">₹${product.price}</h6>
                    <span class="badge bg-${product.stock > 0 ? 'success' : 'danger'}">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                <div class="mt-3">
                    <button class="btn btn-sm btn-outline-primary" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </div>
        </div>
    `;
    return card;
}

function addProduct(event) {
    event.preventDefault();
    const form = event.target;
    const newProduct = {
        id: Date.now().toString(),
        name: form.productName.value,
        category: form.productCategory.value,
        price: parseFloat(form.productPrice.value),
        stock: parseInt(form.productStock.value),
        description: form.productDescription.value,
        isOrganic: form.isOrganic.checked,
        country: form.productCountry.value,
        latitude: parseFloat(form.shopLatitude.value),
        longitude: parseFloat(form.shopLongitude.value),
        image: form.productImage.value || null
    };

    // Update seller's products
    currentSeller.products.push(newProduct);
    currentSeller.stats.totalProducts = currentSeller.products.length;

    // Update localStorage
    updateSellerData();

    // Refresh products list
    loadProducts();
    
    // Reset form and close modal
    form.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();

    showAlert('Product added successfully!');
}

function editProduct(productId) {
    const product = currentSeller.products.find(p => p.id === productId);
    if (!product) return;

    // Populate edit form
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductCountry').value = product.country;
    document.getElementById('editShopLatitude').value = product.latitude;
    document.getElementById('editShopLongitude').value = product.longitude;
    document.getElementById('editProductImage').value = product.image || '';
    document.getElementById('editIsOrganic').checked = product.isOrganic;
    document.getElementById('editProductId').value = product.id;

    // Show edit modal
    const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editModal.show();
}

function updateProduct(event) {
    event.preventDefault();
    const form = event.target;
    const productId = form.editProductId.value;
    const productIndex = currentSeller.products.findIndex(p => p.id === productId);

    if (productIndex === -1) return;

    currentSeller.products[productIndex] = {
        ...currentSeller.products[productIndex],
        name: form.editProductName.value,
        category: form.editProductCategory.value,
        price: parseFloat(form.editProductPrice.value),
        stock: parseInt(form.editProductStock.value),
        description: form.editProductDescription.value,
        isOrganic: form.editIsOrganic.checked,
        country: form.editProductCountry.value,
        latitude: parseFloat(form.editShopLatitude.value),
        longitude: parseFloat(form.editShopLongitude.value),
        image: form.editProductImage.value || null
    };

    // Update localStorage
    updateSellerData();

    // Refresh products list
    loadProducts();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
    modal.hide();

    showAlert('Product updated successfully!');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        currentSeller.products = currentSeller.products.filter(p => p.id !== productId);
        currentSeller.stats.totalProducts = currentSeller.products.length;
        
        // Update localStorage
        updateSellerData();

        // Refresh products list
        loadProducts();

        showAlert('Product deleted successfully!', 'success');
    }
}

function updateSellerData() {
    // Get all sellers
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const sellerIndex = sellers.findIndex(s => s.id === currentSeller.id);
    
    if (sellerIndex !== -1) {
        sellers[sellerIndex] = currentSeller;
        localStorage.setItem('sellers', JSON.stringify(sellers));
        localStorage.setItem('currentSeller', JSON.stringify(currentSeller));
    }
}

// Analytics Functions
function initializeCharts() {
    const salesData = currentSeller.orders?.map(order => ({
        date: new Date(order.date),
        amount: order.amount
    })) || [];

    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: salesData.map(d => d.date.toLocaleDateString()),
            datasets: [{
                label: 'Sales',
                data: salesData.map(d => d.amount),
                borderColor: '#28a745',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '₹' + value
                    }
                }
            }
        }
    });

    // Products Chart
    const productsCtx = document.getElementById('productsChart').getContext('2d');
    const productCategories = {};
    currentSeller.products?.forEach(product => {
        productCategories[product.category] = (productCategories[product.category] || 0) + 1;
    });

    new Chart(productsCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(productCategories),
            datasets: [{
                data: Object.values(productCategories),
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107',
                    '#dc3545',
                    '#6610f2'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Utility Functions
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    checkSellerAuth();
    initializeMap();
    
    // Add Product Form
    document.getElementById('addProductForm')?.addEventListener('submit', addProduct);
    
    // Edit Product Form
    document.getElementById('editProductForm')?.addEventListener('submit', updateProduct);
    
    // Logout
    document.getElementById('logoutButton')?.addEventListener('click', function() {
        localStorage.removeItem('currentSeller');
        window.location.href = 'seller.html';
    });
});
