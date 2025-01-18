// Function to toggle between the login and signup forms
function toggleForm(formType) {
    const loginForm = document.getElementById('login-form-container');
    const signupForm = document.getElementById('signup-form-container');

    if (formType === 'signup') {
        loginForm.classList.remove('show');
        signupForm.classList.add('show');
    } else {
        signupForm.classList.remove('show');
        loginForm.classList.add('show');
    }
}

// Show the login form by default
window.onload = function() {
    toggleForm('login');
};

// Validate the login form
function validateLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please fill in both email and password!');
        return false;
    }
    // You can add more complex validation or API calls here
    alert('Login successful!');
    return true;
}

// Validate the signup form
function validateSignUp() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields!');
        return false;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return false;
    }

    // You can add more complex validation or API calls here
    alert('Sign Up successful!');
    return true;
}
