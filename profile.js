// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Update profile information
    updateProfileDisplay(user);
});

function updateProfileDisplay(user) {
    // Update header
    document.getElementById('userName').textContent = user.name;
    
    // Update profile card
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    
    // Update form fields
    document.getElementById('fullName').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('address').value = user.address || '';
}

function editProfile() {
    // Enable form fields
    const formFields = ['fullName', 'phone', 'address'];
    formFields.forEach(field => {
        document.getElementById(field).disabled = false;
    });
    
    // Show edit buttons
    document.getElementById('editButtons').classList.remove('d-none');
}

function saveProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Update user data
    user.name = document.getElementById('fullName').value;
    user.phone = document.getElementById('phone').value;
    user.address = document.getElementById('address').value;
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    // Disable form fields
    const formFields = ['fullName', 'phone', 'address'];
    formFields.forEach(field => {
        document.getElementById(field).disabled = true;
    });
    
    // Hide edit buttons
    document.getElementById('editButtons').classList.add('d-none');
    
    // Update display
    updateProfileDisplay(user);
    
    // Show success message
    alert('Profile updated successfully!');
}

function cancelEdit() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Reset form fields
    updateProfileDisplay(user);
    
    // Disable form fields
    const formFields = ['fullName', 'phone', 'address'];
    formFields.forEach(field => {
        document.getElementById(field).disabled = true;
    });
    
    // Hide edit buttons
    document.getElementById('editButtons').classList.add('d-none');
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

// Initialize cart count
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});
