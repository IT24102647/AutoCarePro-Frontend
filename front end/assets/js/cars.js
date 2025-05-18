document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addCarBtn = document.getElementById('addCarBtn');
    const carModal = document.getElementById('carModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeBtns = document.querySelectorAll('.close');
    const carForm = document.getElementById('carForm');
    const yearSelect = document.getElementById('year');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');
    
    // Populate year dropdown (current year - 30 years)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 30; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    
    // Modal open/close functions
    function openModal(modal) {
        modal.style.display = 'block';
    }
    
    function closeModal(modal) {
        modal.style.display = 'none';
    }
    
    // Event Listeners
    addCarBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Add New Vehicle';
        carForm.reset();
        openModal(carModal);
    });
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Edit button handlers
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            document.getElementById('modalTitle').textContent = 'Edit Vehicle';
            
            // Populate form with row data (in a real app, you'd fetch from the backend)
            document.getElementById('make').value = row.cells[0].textContent;
            document.getElementById('model').value = row.cells[1].textContent;
            document.getElementById('year').value = row.cells[2].textContent;
            document.getElementById('licensePlate').value = row.cells[3].textContent;
            
            openModal(carModal);
        });
    });
    
    // Delete button handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real app, you'd set the ID of the car to delete
            openModal(deleteModal);
        });
    });
    
    cancelDelete.addEventListener('click', () => closeModal(deleteModal));
    
    confirmDelete.addEventListener('click', function() {
        // In a real app, you'd send a delete request to the backend
        alert('Vehicle deleted successfully!');
        closeModal(deleteModal);
        // Then refresh the table or remove the row
    });
    
    // Form submission
    carForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real app, you'd send this data to your backend
        const formData = {
            make: document.getElementById('make').value,
            model: document.getElementById('model').value,
            year: document.getElementById('year').value,
            licensePlate: document.getElementById('licensePlate').value,
            vin: document.getElementById('vin').value,
            color: document.getElementById('color').value
        };
        
        console.log('Form submitted:', formData);
        alert('Vehicle saved successfully!');
        closeModal(carModal);
        // Then refresh the table or add the new row
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const cars = [

        {
            make: 'Honda',
            model: 'CR-V',
            year: 2018,
            plate: 'XYZ-1234',
            lastService: '02 Mar 2023'
        }
    ];

    const tableBody = document.getElementById('carsTableBody');
    const template = document.getElementById('carRowTemplate');

    cars.forEach(car => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.car-make').textContent = car.make;
        clone.querySelector('.car-model').textContent = car.model;
        clone.querySelector('.car-year').textContent = car.year;
        clone.querySelector('.car-plate').textContent = car.plate;
        clone.querySelector('.car-service').textContent = car.lastService;

        // Optional: attach event listeners to buttons (edit/delete/history)
        const editBtn = clone.querySelector('.edit-btn');
        const deleteBtn = clone.querySelector('.delete-btn');
        const historyBtn = clone.querySelector('.history-btn');

        editBtn.addEventListener('click', () => handleEdit(car));
        deleteBtn.addEventListener('click', () => handleDelete(car));
        historyBtn.addEventListener('click', () => viewHistory(car));

        tableBody.appendChild(clone);
    });

    function handleEdit(car) {
        console.log('Editing car:', car);
        // Populate the modal form and show it
    }

    function handleDelete(car) {
        console.log('Deleting car:', car);
        // Open confirmation modal
    }

    function viewHistory(car) {
        console.log('Viewing history for:', car);
        // Redirect or open history modal
    }
});

async function loadCars() {
    try {
        const res = await fetch('/api/vehicle');          // GET all cars
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const cars = await res.json();                 // [{…}, …]

        renderCars(cars);                              // reuse your template logic
    } catch (err) {
        console.error(err);
        alert('Couldn’t load cars. Please try again.');
    }
}

function renderCars(cars) {
    tableBody.innerHTML = '';                        // clear existing rows
    cars.forEach(car => addRow(car));
}

function addRow(car) {
    const clone = template.content.cloneNode(true);
    clone.querySelector('.car-make').textContent   = car.make;
    clone.querySelector('.car-model').textContent  = car.model;
    clone.querySelector('.car-year').textContent   = car.year;
    clone.querySelector('.car-plate').textContent  = car.plate;
    clone.querySelector('.car-service').textContent= car.lastService;

    clone.querySelector('.edit-btn').onclick    = () => handleEdit(car);
    clone.querySelector('.delete-btn').onclick  = () => handleDelete(car);
    clone.querySelector('.history-btn').onclick = () => viewHistory(car);

    tableBody.appendChild(clone);
}

