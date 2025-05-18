document.addEventListener("DOMContentLoaded", () => {
    const users = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
            isAdmin: false,
            registered: "2024-12-01"
        },
    ];

    const usersTableBody = document.querySelector("#usersTable tbody");
    const userModal = document.getElementById("userModal");
    const modalClose = document.querySelector(".modal .close");
    const userForm = document.getElementById("userForm");
    const messageBox = document.getElementById("message");

    function showMessage(message, isSuccess = true) {
        messageBox.textContent = message;
        messageBox.className = `message-box ${isSuccess ? "message-success" : "message-error"}`;
        messageBox.classList.remove("hidden");
        setTimeout(() => messageBox.classList.add("hidden"), 3000);
    }

    function populateTable() {
        usersTableBody.innerHTML = "";
        users.forEach(user => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.isAdmin ? '<i class="fas fa-check-circle text-green"></i>' : '<i class="fas fa-times-circle text-red"></i>'}</td>
                <td>${user.registered}</td>
                <td>
                    <button class="btn editBtn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn deleteBtn" data-id="${user.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;

            usersTableBody.appendChild(row);
        });
    }

    function openModal(user) {
        document.getElementById("userId").value = user.id;
        document.getElementById("userName").value = user.name;
        document.getElementById("userEmail").value = user.email;
        document.getElementById("userPhone").value = user.phone;
        document.getElementById("userPassword").value = "";
        document.getElementById("userIsAdmin").checked = user.isAdmin;
        document.getElementById("userModalTitle").textContent = "Edit User";
        userModal.style.display = "block";
    }

    function closeModal() {
        userModal.style.display = "none";
    }

    function updateUser(data) {
        const index = users.findIndex(u => u.id === parseInt(data.id));
        if (index !== -1) {
            users[index] = {
                ...users[index],
                name: data.name,
                email: data.email,
                phone: data.phone,
                isAdmin: data.isAdmin
            };
            showMessage("User updated successfully.");
            populateTable();
        }
    }

    usersTableBody.addEventListener("click", (e) => {
        if (e.target.closest(".editBtn")) {
            const id = parseInt(e.target.closest(".editBtn").dataset.id);
            const user = users.find(u => u.id === id);
            if (user) openModal(user);
        }

        if (e.target.closest(".deleteBtn")) {
            const id = parseInt(e.target.closest(".deleteBtn").dataset.id);
            const index = users.findIndex(u => u.id === id);
            if (index !== -1 && confirm("Are you sure you want to delete this user?")) {
                users.splice(index, 1);
                showMessage("User deleted.");
                populateTable();
            }
        }
    });

    userForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("userId").value;
        const name = document.getElementById("userName").value.trim();
        const email = document.getElementById("userEmail").value.trim();
        const phone = document.getElementById("userPhone").value.trim();
        const isAdmin = document.getElementById("userIsAdmin").checked;

        updateUser({ id, name, email, phone, isAdmin });
        closeModal();
    });

    modalClose.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
        if (e.target === userModal) closeModal();
    });
    modalClose.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === "Escape") closeModal();
    });

    populateTable();
});
