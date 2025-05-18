document.addEventListener('DOMContentLoaded', () => {
    const customerTableBody = document.querySelector('#customersTable tbody');
    const customerCountEl = document.getElementById('customerCount');
    const addCustomerBtn = document.getElementById('addCustomerBtn');
    const customerModal = document.getElementById('customerModal');
    const closeModalBtn = customerModal.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const customerForm = document.getElementById('customerForm');
    const searchInput = document.getElementById('searchCustomers');

    const modalTitle = document.getElementById('modalTitle');
    const modalName = document.getElementById('modalName');
    const modalEmail = document.getElementById('modalEmail');
    const modalPhone = document.getElementById('modalPhone');
    const modalPassword = document.getElementById('modalPassword');
    const modalCustomerId = document.getElementById('customerId');

    let customers = [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "555-1234", registered: "2024-10-01" },
    ];

    function renderCustomers(list = customers) {
        customerTableBody.innerHTML = '';
        list.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.registered}</td>
                <td>
                    <button class="btn btn-small" onclick="editCustomer(${customer.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-small btn-danger" onclick="deleteCustomer(${customer.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            customerTableBody.appendChild(row);
        });
        customerCountEl.textContent = list.length;
    }

    window.editCustomer = function(id) {
        const customer = customers.find(c => c.id === id);
        if (!customer) return;

        modalTitle.textContent = "Edit Customer";
        modalCustomerId.value = customer.id;
        modalName.value = customer.name;
        modalEmail.value = customer.email;
        modalPhone.value = customer.phone;
        modalPassword.value = "";
        openModal();
    }

    window.deleteCustomer = function(id) {
        if (confirm("Are you sure you want to delete this customer?")) {
            customers = customers.filter(c => c.id !== id);
            renderCustomers();
        }
    }

    function openModal() {
        customerModal.style.display = 'block';
    }

    function closeModal() {
        customerModal.style.display = 'none';
        customerForm.reset();
        modalCustomerId.value = '';
        modalTitle.textContent = "Add New Customer";
    }

    addCustomerBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    window.onclick = function(event) {
        if (event.target === customerModal) closeModal();
    };

    customerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const id = modalCustomerId.value;
        const name = modalName.value.trim();
        const email = modalEmail.value.trim();
        const phone = modalPhone.value.trim();

        if (!name || !email || !phone) {
            alert("Please fill all required fields.");
            return;
        }

        if (id) {
            const customer = customers.find(c => c.id == id);
            customer.name = name;
            customer.email = email;
            customer.phone = phone;
        } else {
            const newId = customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1;
            customers.push({
                id: newId,
                name,
                email,
                phone,
                registered: new Date().toISOString().split('T')[0]
            });
        }

        renderCustomers();
        closeModal();
    });

    searchInput.addEventListener('input', function() {
        const keyword = this.value.toLowerCase();
        const filtered = customers.filter(c =>
            c.name.toLowerCase().includes(keyword) ||
            c.email.toLowerCase().includes(keyword) ||
            c.phone.includes(keyword)
        );
        renderCustomers(filtered);
    });

    renderCustomers();
});
