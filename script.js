
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ohhorhynwzsqxssylbsl.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Login functionality
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault()
    
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) throw error

        // Successful login
        alert('Logged in successfully!')
        window.location.href = 'index.html'
    } catch (error) {
        alert('Error logging in: ' + error.message)
    }
})

// Signup functionality
document.getElementById('signupForm')?.addEventListener('submit', async function(e) {
    e.preventDefault()
    
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirmPassword').value

    if (password !== confirmPassword) {
        alert("Passwords don't match!")
        return
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })

        if (error) throw error

        // Successful signup
        alert('Signed up successfully! Please check your email for verification.')
        window.location.href = 'login.html'
    } catch (error) {
        alert('Error signing up: ' + error.message)
    }
})

// Check authentication status
async function checkAuth() {
    const {  { user } } = await supabase.auth.getUser()
    if (!user) {
        // Redirect to login if not authenticated
        const protectedPages = ['dashboard.html'] // Add your protected pages
        const currentPage = window.location.pathname.split('/').pop()
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login.html'
        }
    }
}

// Run auth check when page loads
checkAuth()
