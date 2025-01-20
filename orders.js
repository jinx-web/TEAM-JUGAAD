// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Update username in header
    document.getElementById('userName').textContent = user.name;

    // Load orders
    loadOrders();
    updateCartCount();
});

function loadOrders() {
    // Get orders from localStorage or fetch from server
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Split orders into active and completed
    const activeOrders = orders.filter(order => order.status !== 'completed');
    const completedOrders = orders.filter(order => order.status === 'completed');
    
    // Display orders
    displayOrders('activeOrders', activeOrders);
    displayOrders('completedOrders', completedOrders);
}

function displayOrders(containerId, orders) {
    const container = document.getElementById(containerId);
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                <p class="text-muted">No orders to display</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0">Order #${order.id}</h5>
                    <span class="badge bg-${getStatusBadgeColor(order.status)}">${order.status}</span>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <p class="mb-1"><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                        <p class="mb-1"><strong>Total Amount:</strong> ₹${order.total}</p>
                        <p class="mb-1"><strong>Shipping Address:</strong> ${order.address}</p>
                    </div>
                    <div class="col-md-4 text-md-end">
                        <button class="btn btn-outline-success btn-sm" onclick="viewOrderDetails(${order.id})">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusBadgeColor(status) {
    switch (status.toLowerCase()) {
        case 'processing':
            return 'warning';
        case 'shipped':
            return 'info';
        case 'delivered':
        case 'completed':
            return 'success';
        case 'cancelled':
            return 'danger';
        default:
            return 'secondary';
    }
}

function viewOrderDetails(orderId) {
    // Implement order details view
    // This could open a modal or navigate to a detailed view
    alert('Order details functionality will be implemented here');
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Cart functionality
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}
