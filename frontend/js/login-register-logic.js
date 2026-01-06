// login-register-logic.js
// Lógica de login y registro con redirección automática para admin

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginMessageDiv = document.getElementById('login-message');
    const registerMessageDiv = document.getElementById('register-message');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const loginFormWrapper = document.getElementById('login-form-wrapper');
    const registerFormWrapper = document.getElementById('register-form-wrapper');

    // Elementos para UI de autenticación (en header)
    const userLoggedInSpan = document.getElementById('userLoggedIn');
    const loginRegisterButtons = document.getElementById('loginRegisterButtons');
    const authButtons = document.getElementById('authButtons');
    const logoutButton = document.getElementById('logoutButton');

    // URL base del backend
    const BASE_URL = 'http://localhost:5000';

    // Función para mostrar mensajes
    function showMessage(target, msg, type = 'success') {
        if (target) {
            target.textContent = msg;
            target.className = `message ${type}`;
            target.style.display = 'block';
            setTimeout(() => target.style.display = 'none', 3000);
        }
    }

    // Función para actualizar la UI según estado de autenticación
    function updateAuthUI(loggedIn, username = '') {
        if (!userLoggedInSpan || !loginRegisterButtons || !authButtons) return;

        if (loggedIn) {
            userLoggedInSpan.textContent = `Bienvenido, ${username}`;
            userLoggedInSpan.style.display = 'block';
            loginRegisterButtons.style.display = 'none';
            authButtons.style.display = 'block';
        } else {
            userLoggedInSpan.textContent = '';
            userLoggedInSpan.style.display = 'none';
            loginRegisterButtons.style.display = 'block';
            authButtons.style.display = 'none';
        }
    }

    // Inicializar UI según localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUsername = localStorage.getItem('username');
    updateAuthUI(isLoggedIn, currentUsername);

    // Mostrar/ocultar formularios en popup
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', e => {
            e.preventDefault();
            loginFormWrapper.style.display = 'none';
            registerFormWrapper.style.display = 'block';
        });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener('click', e => {
            e.preventDefault();
            registerFormWrapper.style.display = 'none';
            loginFormWrapper.style.display = 'block';
        });
    }

    // Registro
    if (registerForm) {
        registerForm.addEventListener('submit', async e => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm_password').value;

            if (password !== confirmPassword) {
                showMessage(registerMessageDiv, 'Las contraseñas no coinciden.', 'error');
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await response.json();

                if (response.ok) {
                    showMessage(registerMessageDiv, data.msg || 'Registro exitoso. Inicia sesión.', 'success');
                    registerForm.reset();
                    loginFormWrapper.style.display = 'block';
                    registerFormWrapper.style.display = 'none';
                } else {
                    showMessage(registerMessageDiv, data.msg || 'Error en el registro.', 'error');
                }
            } catch (err) {
                console.error('Error de red:', err);
                showMessage(registerMessageDiv, 'No se pudo conectar con el servidor.', 'error');
            }
        });
    }

    // Login con redirección automática para admin
    if (loginForm) {
        loginForm.addEventListener('submit', async e => {
            e.preventDefault();
            try {
                const response = await fetch(`${BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: document.getElementById('username').value,
                        password: document.getElementById('password').value
                    })
                });
                const data = await response.json();
                console.log('Login response:', data);

                if (!response.ok) {
                    showMessage(loginMessageDiv, data.msg || 'Credenciales incorrectas.', 'error');
                    return;
                }

                // Guardar en localStorage
localStorage.setItem('user', JSON.stringify({
  username: data.username,
  role: data.role,
  token: data.token
}));


                // Redirigir si es admin
                if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                    return;
                }

                // Flujo para usuarios normales
                showMessage(loginMessageDiv, data.msg || 'Inicio de sesión exitoso.', 'success');
                updateAuthUI(true, data.username);
                loginForm.reset();
                document.getElementById('login-toggle').checked = false;

            } catch (err) {
                console.error('Error de red o servidor:', err);
                showMessage(loginMessageDiv, 'No se pudo conectar con el servidor.', 'error');
            }
        });
    }

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            updateAuthUI(false);
        });
    }
});
