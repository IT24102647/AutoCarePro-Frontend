document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("userRole");

    if (role !== "user") {
        window.location.href = "login.html";
        return;
    }

    // Handle logout button globally
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "login.html";
        });
    }
});
