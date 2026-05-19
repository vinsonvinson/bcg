// Global Configuration
const API_BASE_URL = "http://localhost:3000/api";

// Utility Functions
const getToken = () => localStorage.getItem("token");
const setToken = (token) => localStorage.setItem("token", token);
const removeToken = () => localStorage.removeItem("token");

const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));
const removeUser = () => localStorage.removeItem("user");

const isLoggedIn = () => !!getToken();

// Redirect to login if not logged in
const checkAuth = () => {
    if (
        !isLoggedIn() &&
        !window.location.pathname.endsWith("index.html") &&
        window.location.pathname !== "/"
    ) {
        window.location.href = "/";
    }
};

// API Helper
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // PERBAIKAN DI SINI:
        if (response.status === 401) {
            removeToken();
            removeUser();

            // Hanya alihkan halaman jika error 401 BUKAN berasal dari endpoint login
            if (!endpoint.includes("login") && !endpoint.includes("auth")) {
                window.location.href = "/";
                return;
            }
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "API Error");
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// Theme Management
function initTheme() {
    const theme = localStorage.getItem("theme") || "light";
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";

    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${newTheme}-theme`);

    localStorage.setItem("theme", newTheme);

    updateThemeButtonText(newTheme);
}

function updateThemeButtonText(theme) {
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
        themeBtn.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
    }
}

// Setup theme toggle listeners
document.addEventListener("DOMContentLoaded", () => {
    initTheme();

    const themeBtns = document.querySelectorAll("#themeToggle");
    themeBtns.forEach((btn) => {
        btn.addEventListener("click", toggleTheme);
        const currentTheme = document.body.classList.contains("light-theme")
            ? "light"
            : "dark";
        updateThemeButtonText(currentTheme);
    });

    checkAuth();
});

// Navigation
function navigateTo(path) {
    window.location.href = path;
}

// Show loading spinner
function showLoading() {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.style.display = "flex";
}

// Hide loading spinner
function hideLoading() {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.style.display = "none";
}

// Format number to Indonesian currency
function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(value);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// Show notification
function showNotification(message, type = "info") {
    // Simple notification - can be enhanced with toast library
    const timeoutId = setTimeout(() => {
        alert(message);
    }, 100);
    return timeoutId;
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification("Copied to clipboard", "success");
    });
}

function handleLogout(e) {
    if (e) e.preventDefault(); // Mencegah reload halaman bawaan tag <a> atau <form>

    // 1. Hapus kredensial dari LocalStorage
    removeToken();
    removeUser();

    // 2. Redirect (Arahkan) kembali ke halaman Login
    // Ubah '/' menjadi 'index.html' jika saat dijalankan manual halamannya bernama index.html
    window.location.href = "index.html";
}

// Pasangkan fungsi ke tombol saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    // Cari tombol dengan ID btnLogout
    const logoutBtn = document.getElementById("btnLogout");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }
});
