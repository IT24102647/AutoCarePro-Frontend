document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    // Access control
    if (role !== "user") {
        window.location.href = "login.html";
        return;
    }

    // show welcome message
    const messageBox = document.getElementById("message");
    if (email && messageBox) {
        messageBox.style.display = "block";
        messageBox.textContent = `Welcome back, ${email}`;
        messageBox.style.backgroundColor = "#d1e7dd";
        messageBox.style.color = "#0f5132";
        messageBox.style.padding = "10px";
        messageBox.style.border = "1px solid #badbcc";
        messageBox.style.borderRadius = "5px";
        messageBox.style.marginBottom = "15px";
    }

    // Logout handler
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "login.html";
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    // existing auth check...

    const addCarBtn = document.getElementById("addCarBtn");
    const addFirstCarBtn = document.getElementById("addFirstCarBtn");

    if (addCarBtn) {
        addCarBtn.addEventListener("click", () => {
            window.location.href = "add-car.html";
        });
    }

    if (addFirstCarBtn) {
        addFirstCarBtn.addEventListener("click", () => {
            window.location.href = "add-car.html";
        });
    }
});
