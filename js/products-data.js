// Sample products data
const sampleProducts = [
    {
        id: 1,
        name: "Bamboo Toothbrush Set",
        price: 299,
        sustainability_score: 9,
        image: "assets/images/products/bamboo-toothbrush-set.jpg",
        type: "regular",
        category: "Personal Care",
        description: "Eco-friendly bamboo toothbrushes for sustainable oral care"
    },
    {
        id: 2,
        name: "Cotton Produce Bags",
        price: 199,
        sustainability_score: 8,
        image: "assets/images/products/cotton-produce-bags.jpg",
        type: "regular",
        category: "Bags",
        description: "Reusable cotton bags for grocery shopping"
    },
    {
        id: 3,
        name: "Bamboo Cutlery Set",
        price: 399,
        sustainability_score: 9,
        image: "assets/images/products/bamboo-cutlery-set.jpg",
        type: "regular",
        category: "Kitchen",
        description: "Portable bamboo cutlery set for eco-friendly dining"
    },
    {
        id: 4,
        name: "Steel Water Bottle",
        price: 599,
        sustainability_score: 9,
        image: "assets/images/products/steel-water-bottle.jpg",
        type: "regular",
        category: "Kitchen",
        description: "Durable stainless steel water bottle for daily use"
    },
    {
        id: 5,
        name: "Beeswax Food Wraps",
        price: 349,
        sustainability_score: 8,
        image: "assets/images/products/beeswax-wraps.jpg",
        type: "regular",
        category: "Kitchen",
        description: "Natural beeswax wraps to replace plastic wrap"
    },
    {
        id: 6,
        name: "Bamboo Pen Set",
        price: 249,
        sustainability_score: 7,
        image: "assets/images/products/bamboo-pen-set.jpg",
        type: "regular",
        category: "Stationery",
        description: "Eco-friendly bamboo pens for sustainable writing"
    },
    {
        id: 7,
        name: "Coconut Bowl Set",
        price: 499,
        sustainability_score: 8,
        image: "assets/images/products/coconut-bowl-set.jpg",
        type: "regular",
        category: "Kitchen",
        description: "Natural coconut shell bowls for sustainable dining"
    },
    {
        id: 8,
        name: "Cotton Tote Bag",
        price: 299,
        sustainability_score: 8,
        image: "assets/images/products/cotton-tote-bag.jpg",
        type: "regular",
        category: "Bags",
        description: "Durable cotton tote bag for everyday use"
    },
    {
        id: 9,
        name: "Eco-Friendly Phone Case",
        price: 599,
        sustainability_score: 7,
        image: "assets/images/products/eco-phone-case.jpg",
        type: "regular",
        category: "Accessories",
        description: "Biodegradable phone case for sustainable protection"
    }
];

// Organic products data
const organicProducts = [
    {
        id: 101,
        name: "Organic Apples",
        category: "Fruits",
        price: 180,
        priceUnit: "kg",
        image: "assets/images/products/organic-apples.jpg",
        certification: "NPOP-NAB-0716",
        certificationAuthority: "APEDA",
        seasonal: true,
        type: "organic",
        description: "Fresh, pesticide-free apples from Himachal Pradesh",
        nutritionInfo: {
            calories: 52,
            protein: "0.3g",
            fiber: "2.4g",
            vitamins: ["Vitamin C", "Vitamin B6"]
        },
        farmDetails: {
            name: "Himalayan Organic Farms",
            location: "Kullu, Himachal Pradesh",
            distance: "850km"
        }
    },
    {
        id: 102,
        name: "Organic Bananas",
        category: "Fruits",
        price: 80,
        priceUnit: "dozen",
        image: "assets/images/products/organic-bananas.jpg",
        certification: "NPOP-NAB-0892",
        certificationAuthority: "APEDA",
        seasonal: false,
        type: "organic",
        description: "Sweet and nutritious bananas from Kerala",
        nutritionInfo: {
            calories: 89,
            protein: "1.1g",
            fiber: "2.6g",
            vitamins: ["Vitamin B6", "Vitamin C"]
        },
        farmDetails: {
            name: "Kerala Organic Collective",
            location: "Wayanad, Kerala",
            distance: "1200km"
        }
    }
];

// Function to initialize products in localStorage
function initializeProducts() {
    // Initialize regular products if not exists
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
    
    // Initialize organic products if not exists
    if (!localStorage.getItem('organicProducts')) {
        localStorage.setItem('organicProducts', JSON.stringify(organicProducts));
    }
}

// Function to get all products
function getAllProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const organic = JSON.parse(localStorage.getItem('organicProducts') || '[]');
    return [...products, ...organic];
}

// Function to get organic products
function getOrganicProducts() {
    return JSON.parse(localStorage.getItem('organicProducts') || '[]');
}

// Function to get regular products
function getRegularProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}

// Function to add a new organic product
function addOrganicProduct(product) {
    const products = getOrganicProducts();
    products.push(product);
    localStorage.setItem('organicProducts', JSON.stringify(products));
}

// Function to update an organic product
function updateOrganicProduct(productId, updatedProduct) {
    const products = getOrganicProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        localStorage.setItem('organicProducts', JSON.stringify(products));
        return true;
    }
    return false;
}

// Function to delete an organic product
function deleteOrganicProduct(productId) {
    const products = getOrganicProducts();
    const filtered = products.filter(p => p.id !== productId);
    localStorage.setItem('organicProducts', JSON.stringify(filtered));
}

// Initialize products when the script loads
initializeProducts();
