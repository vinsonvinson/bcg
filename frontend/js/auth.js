document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePasswordBtn.textContent = "👁️‍🗨️";
            } else {
                passwordInput.type = "password";
                togglePasswordBtn.textContent = "👁️";
            }
        });
    }

    if (isLoggedIn()) {
        const currentPage = window.location.pathname;
        if (currentPage === "/" || currentPage.endsWith("index.html")) {
            window.location.href = "/dashboard";
        }
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("loginError");

    if (!username || !password) {
        showError("Username and password are required", errorDiv);
        return;
    }

    showLoading();

    try {
        const response = await apiCall("/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });

        setToken(response.token);
        setUser(response.user);

        hideLoading();

        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 500);
    } catch (error) {
        hideLoading();
        showError(error.message || "Login failed", errorDiv);
    }
}

function showError(message, element) {
    if (element) {
        element.textContent = message;
        element.style.display = "block";

        setTimeout(() => {
            element.style.display = "none";
        }, 5000);
    }
}

function handleLogout() {
    removeToken();
    removeUser();
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", function () {
    const logoutBtns = document.querySelectorAll("#logoutBtn");
    logoutBtns.forEach((btn) => {
        btn.addEventListener("click", handleLogout);
    });
});
