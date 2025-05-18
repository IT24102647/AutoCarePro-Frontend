document.addEventListener("DOMContentLoaded", () => {
    let users = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
            isAdmin: false,
            registered: "2024-12-01"
        }
    ];

    const usersTableBody = document.querySelector("#usersTable tbody");
    const userModal = document.getElementById("userModal");
    const modalClose = document.querySelector(".modal .close");
    const userForm = document.getElementById("userForm");
    const messageBox = document.getElementById("message");

    // Fetch users and populate table
    function fetchAndPopulateUsers() {
        usersTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Loading...</td></tr>`;
        fetch("http://localhost:8080/api/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                users = data.length ? data : users; // Use fetched data if available, else keep initial users
                populateTable();
            })
            .catch((error) => {
                console.error("Error:", error);
                showMessage("Failed to fetch users.", false);
                populateTable(); // Show initial users as fallback
            });
    }

    // Show message
    function showMessage(message, isSuccess = true) {
        messageBox.textContent = message;
        messageBox.className = `message-box ${isSuccess ? "message-success" : "message-error"}`;
        messageBox.classList.remove("hidden");
        setTimeout(() => messageBox.classList.add("hidden"), 3000);
    }

    // Populate table
    function populateTable() {
        if (!usersTableBody) {
            console.error("Table body not found");
            return;
        }
        usersTableBody.innerHTML = "";
        if (!users || users.length === 0) {
            usersTableBody.innerHTML = `<tr><td colspan="7" class="text-center">No users found</td></tr>`;
            return;
        }

        const fragment = document.createDocumentFragment();
        users.forEach((user) => {
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
            fragment.appendChild(row);
        });
        usersTableBody.appendChild(fragment);
    }

    // Open modal
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

    // Close modal
    function closeModal() {
        userModal.style.display = "none";
        userForm.reset();
    }

    // Update user (with backend sync)
    function updateUser(data) {
        const updateData = {
            id: parseInt(data.id),
            name: data.name,
            email: data.email,
            phone: data.phone,
            isAdmin: data.isAdmin
        };
        if (data.password) {
            updateData.password = data.password;
        }

        // Send PUT request to backend
        fetch(`http://localhost:8080/api/users/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update user");
                }
                return response.json();
            })
            .then((updatedUser) => {
                const index = users.findIndex((u) => u.id === parseInt(data.id));
                if (index !== -1) {
                    users[index] = updatedUser;
                    showMessage("User updated successfully.");
                    populateTable();
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                showMessage("Failed to update user.", false);
            });
    }

    // Delete user (with backend sync)
    function deleteUser(id) {
        fetch(`http://localhost:8080/api/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete user");
                }
                users = users.filter((u) => u.id !== parseInt(id));
                showMessage("User deleted.");
                populateTable();
            })
            .catch((error) => {
                console.error("Error:", error);
                showMessage("Failed to delete user.", false);
            });
    }

    // Event listeners
    usersTableBody.addEventListener("click", (e) => {
        if (e.target.closest(".editBtn")) {
            const id = parseInt(e.target.closest(".editBtn").dataset.id);
            const user = users.find((u) => u.id === id);
            if (user) openModal(user);
        }
        if (e.target.closest(".deleteBtn")) {
            const id = parseInt(e.target.closest(".deleteBtn").dataset.id);
            if (confirm("Are you sure you want to delete this user?")) {
                deleteUser(id);
            }
        }
    });

    userForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("userId").value;
        const name = document.getElementById("userName").value.trim();
        const email = document.getElementById("userEmail").value.trim();
        const phone = document.getElementById("userPhone").value.trim();
        const password = document.getElementById("userPassword").value.trim();
        const isAdmin = document.getElementById("userIsAdmin").checked;

        updateUser({ id, name, email, phone, password, isAdmin });
        closeModal();
    });

    modalClose.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
        if (e.target === userModal) closeModal();
    });
    modalClose.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === "Escape") closeModal();
    });

    // Initialize
    fetchAndPopulateUsers();
});