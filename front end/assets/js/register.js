document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const messageBox = document.getElementById("registerMessage");

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validation
        if (!fullName || !email || !phone || !password || !confirmPassword) {
            showMessage("Please fill in all required fields.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        if (!/^\+?[0-9]{7,15}$/.test(phone)) {
            showMessage("Please enter a valid phone number.", "error");
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const emailExists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());

        if (emailExists) {
            showMessage("A user with this email already exists.", "error");
            return;
        }

        // Create user
        const newUser = {
            id: 0,
            name: fullName,
            email,
            phone,
            password,
            role: "User",
        };
        fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        showMessage("Registration successful! Redirecting to login...", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    });

    function showMessage(text, type) {
        messageBox.style.display = "block";
        messageBox.textContent = text;
        messageBox.style.backgroundColor = type === "error" ? "#f8d7da" : "#d4edda";
        messageBox.style.color = type === "error" ? "#721c24" : "#155724";
        messageBox.style.border = type === "error" ? "1px solid #f5c6cb" : "1px solid #c3e6cb";
    }
});
