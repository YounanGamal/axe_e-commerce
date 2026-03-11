
const authBtn = document.getElementById('auth-btn');
const authOverlay = document.getElementById('auth-overlay');
const authClose = document.getElementById('auth-close');
const loginBox = document.getElementById('login-box');
const registerBox = document.getElementById('register-box');
const goToRegister = document.getElementById('go-to-register');
const goToLogin = document.getElementById('go-to-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');


let currentUser = JSON.parse(localStorage.getItem('axestore-current-user')) || null;
const users = JSON.parse(localStorage.getItem('axestore-users')) || [];

document.addEventListener("DOMContentLoaded", () => {
    if (!currentUser) {
        document.body.classList.add("lock-scroll");
    }
});

function protectSections() {

    const protectedLinks = document.querySelectorAll(
        'a[href="#categories"], a[href="#products"], a[href="#featured"], a[href="#contact"]'
    );

    protectedLinks.forEach(link => {

        link.addEventListener("click", function (e) {

            if (!currentUser) {

                e.preventDefault();

                if (typeof openAuth === "function") {
                    openAuth();
                }

                if (typeof showNotification === "function") {
                    showNotification("Please login to access this section", "error");
                }

            }

        });

    });

}

document.addEventListener("DOMContentLoaded", protectSections);

function openAuth() {

    authOverlay.classList.add('active');

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    showLogin();
}
function closeAuth() {

    authOverlay.classList.remove('active');

    setTimeout(() => {

        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';

        const homeSection = document.querySelector("#home");

        if (homeSection) {
            homeSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    }, 300);
}

function showLogin() {
    loginBox.classList.add('active');
    registerBox.classList.remove('active');
}

function showRegister() {
    loginBox.classList.remove('active');
    registerBox.classList.add('active');
}


if (authBtn) {
    authBtn.addEventListener('click', () => {
        if (currentUser) {
            logoutUser();
        } else {
            openAuth();
        }
    });
}

if (authClose) authClose.addEventListener('click', closeAuth);
if (authOverlay) {
    authOverlay.addEventListener('click', (e) => {

        if (!currentUser) return;

        if (e.target === authOverlay) {
            closeAuth();
        }

    });

}

if (goToRegister) {
    goToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showRegister();
    });
}

if (goToLogin) {
    goToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });
}


if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (password !== confirmPassword) {
            if (typeof showNotification === 'function') {
                showNotification('Passwords do not match', 'error');
            } else {
                alert('Passwords do not match');
            }
            return;
        }

        if (users.find(u => u.email === email)) {
            if (typeof showNotification === 'function') {
                showNotification('User with this email already exists', 'error');
            } else {
                alert('User with this email already exists');
            }
            return;
        }

        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('axestore-users', JSON.stringify(users));

        if (typeof showNotification === 'function') {
            showNotification('Account created successfully! Please log in.', 'success');
        } else {
            alert('Account created successfully! Please log in.');
        }
        showLogin();
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            loginUser(user);
        } else {
            if (typeof showNotification === 'function') {
                showNotification('Invalid email or password', 'error');
            } else {
                alert('Invalid email or password');
            }
        }
    });
}

function loginUser(user) {
    currentUser = user;
    localStorage.setItem('axestore-current-user', JSON.stringify(user));
    if (typeof showNotification === 'function') {
        showNotification(`Welcome back, ${user.name}!`, 'success');
    }
    if (authOverlay) closeAuth();
    updateAuthUI();

    if (window.location.pathname.includes('auth.html')) {
        setTimeout(() => window.location.href = 'index.html', 1500);
    }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('axestore-current-user');
    if (typeof showNotification === 'function') {
        showNotification('Logged out successfully', 'success');
    }
    updateAuthUI();

    if (window.location.pathname.includes('auth.html')) {
        setTimeout(() => window.location.href = 'index.html', 1000);
    }
}

function updateAuthUI() {
    if (!authBtn) return;
    if (currentUser) {
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        authBtn.innerHTML = `<div class="user-avatar">${initials}</div>`;
        authBtn.title = `Logged in as ${currentUser.name} (Click to logout)`;
    } else {
        authBtn.innerHTML = '<i class="fas fa-user"></i>';
        authBtn.title = 'User Account';
    }
}

function protectScroll() {

    window.addEventListener("scroll", () => {

        if (!currentUser) {

            const scrollPosition = window.scrollY;

            const homeHeight = document.querySelector("#home").offsetHeight;

            if (scrollPosition > homeHeight - 50) {

                openAuth();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }

    });

}


document.addEventListener("DOMContentLoaded", () => {
    protectSections();
    protectScroll();
    updateAuthUI();
});
