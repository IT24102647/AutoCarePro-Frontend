document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    const ADMIN_EMAIL = "admin@autocare.com";
    const ADMIN_PASSWORD = "admin123";

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            showMessage("Please enter both email and password.", "error");
            return;
        }

        if (email === ADMIN_EMAIL) {
            if (password === ADMIN_PASSWORD) {
                localStorage.setItem("userRole", "admin");
                showMessage("Redirecting to admin dashboard...", "success");
                setTimeout(() => {
                    location.href = "../admin/admin.html";
                }, 1000);
            } else {
                showMessage("Incorrect admin password.", "error");
            }
        } else {
            if (password.length >= 1) {
                localStorage.setItem("userRole", "user");
                showMessage("Redirecting to your garage...", "success");
                setTimeout(() => {
                    location.href = "../user/profile.html";
                }, 1000);
            } else {
                showMessage("Invalid user credentials.", "error");
            }
        }
    });

    function showMessage(msg, type = "info") {
        loginMessage.style.display = "block";
        loginMessage.textContent = msg;
        loginMessage.style.backgroundColor = type === "error" ? "#f8d7da" : "#d1e7dd";
        loginMessage.style.color = type === "error" ? "#842029" : "#0f5132";
        loginMessage.style.border = `1px solid ${type === "error" ? "#f5c2c7" : "#badbcc"}`;
    }
});
