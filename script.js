// Initialize MapBox
mapboxgl.accessToken = 'pk.eyJ1IjoiamlueGdpcmkiLCJhIjoiY202MzM2ZHJ3MHVkMjJ3c2V1ZTE4em13MiJ9.M6tDB0ZXH9TMwOaGr5NFjg';

// Store locations data
const ecoStores = [
    { coordinates: [72.8777, 19.0760], name: "Mumbai Eco Store", description: "Sustainable products in Mumbai" },
    { coordinates: [77.5946, 12.9716], name: "Bangalore Green Market", description: "Eco-friendly market in Bangalore" },
    { coordinates: [77.2090, 28.6139], name: "Delhi Sustainable Shop", description: "Green living store in Delhi" },
    { coordinates: [80.2707, 13.0827], name: "Chennai Eco Hub", description: "Eco products in Chennai" },
    { coordinates: [88.3639, 22.5726], name: "Kolkata Green Store", description: "Sustainable shopping in Kolkata" },
    // Noida and nearby areas
    { coordinates: [77.3910, 28.5355], name: "Noida Eco Hub", description: "Premier eco-friendly store in Noida Sector 18" },
    { coordinates: [77.3266, 28.5830], name: "Green Earth Noida", description: "Sustainable living store in Sector 62" },
    { coordinates: [77.4126, 28.5457], name: "EcoMart Greater Noida", description: "Eco products in Greater Noida West" },
    { coordinates: [77.3492, 28.5762], name: "Nature's Best", description: "Organic store in Sector 50" },
    { coordinates: [77.3673, 28.5697], name: "Green Life Store", description: "Eco-friendly products in Sector 32" },
    // Additional stores in NCR
    { coordinates: [77.3196, 28.6359], name: "Delhi NCR Green Shop", description: "Sustainable products in East Delhi" },
    { coordinates: [77.4538, 28.6307], name: "Ghaziabad Eco Center", description: "Green living in Ghaziabad" },
    // Other major cities
    { coordinates: [73.8567, 18.5204], name: "Pune Eco Center", description: "Eco-friendly products in Pune" },
    { coordinates: [78.4867, 17.3850], name: "Hyderabad Green Zone", description: "Sustainable living in Hyderabad" },
    { coordinates: [75.8577, 22.7196], name: "Indore Eco Market", description: "Green products in Indore" },
    { coordinates: [73.1812, 22.3072], name: "Vadodara Green Shop", description: "Eco-friendly store in Vadodara" },
    { coordinates: [85.8245, 20.2961], name: "Bhubaneswar Eco Store", description: "Sustainable products in Bhubaneswar" },
    { coordinates: [75.7873, 26.9124], name: "Jaipur Green Hub", description: "Eco products in Jaipur" },
    { coordinates: [76.7794, 30.7333], name: "Chandigarh Eco Center", description: "Green living in Chandigarh" },
    { coordinates: [91.7362, 26.1445], name: "Guwahati Green Market", description: "Sustainable shopping in Guwahati" },
    { coordinates: [79.0882, 21.1458], name: "Nagpur Eco Shop", description: "Eco-friendly store in Nagpur" },
    { coordinates: [85.1376, 25.5941], name: "Patna Green Store", description: "Green products in Patna" }
];

// Sample product data
const sampleProducts = [
    {
        id: 1,
        name: "Bamboo Toothbrush Set",
        description: "Pack of 4 biodegradable bamboo toothbrushes with charcoal-infused bristles. Eco-friendly alternative to plastic toothbrushes.",
        price: 299,
        image: "assets/images/products/bamboo-toothbrush-set.jpg",
        sellerName: "Green Earth Noida",
        category: "Personal Care",
        sustainability_score: 9.5,
        latitude: 28.5830,
        longitude: 77.3266
    },
    {
        id: 2,
        name: "Bamboo Pen Set",
        description: "Set of 5 bamboo ballpoint pens with recycled paper barrel. Sustainable writing instruments for eco-conscious users.",
        price: 199,
        image: "assets/images/products/bamboo-pen-set.jpg",
        sellerName: "EcoMart Greater Noida",
        category: "Stationery",
        sustainability_score: 9.0,
        latitude: 28.5457,
        longitude: 77.4126
    },
    {
        id: 3,
        name: "Reusable Cotton Produce Bags",
        description: "Set of 6 organic cotton mesh bags for grocery shopping. Perfect for fruits, vegetables, and bulk items.",
        price: 399,
        image: "assets/images/products/cotton-produce-bags.jpg",
        sellerName: "Nature's Best",
        category: "Shopping",
        sustainability_score: 9.8,
        latitude: 28.5762,
        longitude: 77.3492
    },
    {
        id: 4,
        name: "Stainless Steel Water Bottle",
        description: "1L double-walled insulated bottle. Keeps drinks cold for 24 hours and hot for 12 hours. Zero plastic, zero waste.",
        price: 799,
        image: "assets/images/products/steel-water-bottle.jpg",
        sellerName: "Green Life Store",
        category: "Drinkware",
        sustainability_score: 9.2,
        latitude: 28.5697,
        longitude: 77.3673
    },
    {
        id: 5,
        name: "Bamboo Cutlery Set",
        description: "Portable bamboo utensil set including fork, spoon, knife, and chopsticks with cotton carry pouch.",
        price: 349,
        image: "assets/images/products/bamboo-cutlery-set.jpg",
        sellerName: "Noida Eco Hub",
        category: "Kitchen",
        sustainability_score: 9.4,
        latitude: 28.5355,
        longitude: 77.3910
    },
    {
        id: 6,
        name: "Organic Cotton Tote Bag",
        description: "100% organic cotton reusable shopping bag with artistic eco-message print. Strong and washable.",
        price: 249,
        image: "assets/images/products/cotton-tote-bag.jpg",
        sellerName: "Delhi NCR Green Shop",
        category: "Shopping",
        sustainability_score: 9.6,
        latitude: 28.6359,
        longitude: 77.3196
    },
    {
        id: 7,
        name: "Coconut Shell Bowl Set",
        description: "Set of 2 handcrafted coconut shell bowls. Perfect for smoothie bowls and decorative purposes.",
        price: 599,
        image: "assets/images/products/coconut-bowl-set.jpg",
        sellerName: "Green Earth Noida",
        category: "Kitchen",
        sustainability_score: 9.7,
        latitude: 28.5830,
        longitude: 77.3266
    },
    {
        id: 8,
        name: "Biodegradable Phone Case",
        description: "Wheat straw-based phone case. 100% biodegradable and compostable. Available for various iPhone and Android models.",
        price: 499,
        image: "assets/images/products/eco-phone-case.jpg",
        sellerName: "EcoMart Greater Noida",
        category: "Electronics",
        sustainability_score: 9.3,
        latitude: 28.5457,
        longitude: 77.4126
    },
    {
        id: 9,
        name: "Beeswax Food Wraps",
        description: "Set of 3 reusable beeswax food wraps. Natural alternative to plastic wrap. Various sizes included.",
        price: 449,
        image: "assets/images/products/beeswax-wraps.jpg",
        sellerName: "Nature's Best",
        category: "Kitchen",
        sustainability_score: 9.9,
        latitude: 28.5762,
        longitude: 77.3492
    }
];

// Global variables
let selectedCategory = 'all';
let map;
let footerMap;
let userLocation = null;
let markers = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize map
function initMap() {
    try {
        mapboxgl.accessToken = 'pk.eyJ1IjoiamlueGdpcmkiLCJhIjoiY202MzM2ZHJ3MHVkMjJ3c2V1ZTE4em13MiJ9.M6tDB0ZXH9TMwOaGr5NFjg';
        
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [78.9629, 20.5937], // India center coordinates
            zoom: 4
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());

        // Add markers for each store
        ecoStores.forEach((store) => {
            // Create a DOM element for the marker
            const el = document.createElement('div');
            el.className = 'marker';
            
            // Create a popup
            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                    <h6>${store.name}</h6>
                    <p>${store.description}</p>
                `);

            // Add marker to the map
            new mapboxgl.Marker(el)
                .setLngLat(store.coordinates)
                .setPopup(popup)
                .addTo(map);
        });

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

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initMap();
        setupEventListeners();
        
        // Initialize typed.js
        const typed = new Typed('.auto-type', {
            strings: [
                "Melting Glaciers, Warming Futures.",
                "Save Earth, Shop Smart.",
                "Choose Eco, Choose Future.",
                "Small Changes, Big Impact."
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true
        });
    });
} else {
    initMap();
}

// Search products function
function searchProducts() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const heroSection = document.querySelector('.hero');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const productsContainer = document.getElementById('productsContainer');
    
    if (!productsContainer) {
        console.error('Products container not found');
        return;
    }
    
    if (query) {
        // Hide hero and welcome message, show products
        if (heroSection) heroSection.style.display = 'none';
        if (welcomeMessage) welcomeMessage.style.display = 'none';
        productsContainer.style.display = 'flex';
        
        // Filter products
        const filteredProducts = sampleProducts.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        
        // Display results
        if (filteredProducts.length > 0) {
            displayProducts(filteredProducts);
        } else {
            productsContainer.innerHTML = `
                <div class="col-12 text-center my-5">
                    <h3>No products found</h3>
                    <p>Try searching with different keywords</p>
                    <button class="btn btn-outline-success mt-3" onclick="resetSearch()">
                        <i class="fas fa-undo"></i> Reset Search
                    </button>
                </div>
            `;
        }
    } else {
        // Show hero and welcome message, hide products
        if (heroSection) heroSection.style.display = 'block';
        if (welcomeMessage) welcomeMessage.style.display = 'block';
        productsContainer.style.display = 'none';
    }
}

// Display products in container
function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!container) {
        console.error('Products container not found');
        return;
    }
    
    container.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 mb-4';
        productCard.innerHTML = `
            <div class="card h-100 product-card">
                <div class="position-relative">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
                    <span class="sustainability-badge">
                        <i class="fas fa-leaf"></i> ${product.sustainability_score}/10
                    </span>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.description}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="h5 mb-0 text-success">₹${product.price}</span>
                                <small class="text-success d-block">
                                    <i class="fas fa-store"></i> ${product.sellerName}
                                </small>
                            </div>
                            <div class="btn-group">
                                <a href="product-details.html?id=${product.id}" class="btn btn-outline-success">View Details</a>
                                <button class="btn btn-success" onclick="addToCart(${product.id})">
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.btn-success[onclick="searchProducts()"]');

    if (searchButton) {
        searchButton.removeAttribute('onclick');
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            searchProducts();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchProducts();
            }
        });
    }
}

// Reset search function
function resetSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    const productsContainer = document.getElementById('productsContainer');
    if (productsContainer) {
        productsContainer.style.display = 'none';
    }
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.display = 'block';
    }
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'block';
    }
}

// Authentication related functions
function checkLoginState() {
    const user = JSON.parse(localStorage.getItem('user'));
    const guestLinks = document.querySelector('.guest-links');
    const userInfo = document.querySelector('.user-info');
    const userNameSpan = document.getElementById('userName');

    if (user) {
        guestLinks.classList.add('d-none');
        userInfo.classList.remove('d-none');
        userNameSpan.textContent = user.name || 'User';
    } else {
        guestLinks.classList.remove('d-none');
        userInfo.classList.add('d-none');
    }
}

function logout() {
    localStorage.removeItem('user');
    checkLoginState();
    window.location.href = 'index.html';
}

// Cart functions
function addToCart(productId) {
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Map marker functions
function addMarkersToMap() {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];

    // Add markers for eco stores
    ecoStores.forEach(store => {
        const marker = new mapboxgl.Marker({ color: '#28a745' })
            .setLngLat(store.coordinates)
            .setPopup(new mapboxgl.Popup().setHTML(`
                <h6>${store.name}</h6>
                <p>${store.description}</p>
            `))
            .addTo(map);
        markers.push(marker);
    });
}

function addMarkersForProducts(stores) {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];

    // Add new markers
    stores.forEach(store => {
        const marker = new mapboxgl.Marker({ color: '#28a745' })
            .setLngLat(store.coordinates)
            .setPopup(new mapboxgl.Popup().setHTML(`
                <h6>${store.name}</h6>
                <p>${store.description}</p>
            `))
            .addTo(map);
        markers.push(marker);
    });
}

// Helper functions
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}