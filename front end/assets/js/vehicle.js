document.addEventListener("DOMContentLoaded", () => {
    const addVehicleForm = document.getElementById("addVehicleForm");
    const messageBox     = document.getElementById("addVehicleMessage");

    // use the correct form reference
    addVehicleForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // grab form values
        const make        = document.getElementById("make").value.trim();
        const model       = document.getElementById("model").value.trim();
        const color       = document.getElementById("color").value.trim();
        const year        = document.getElementById("year").value.trim();
        const plateNumber = document.getElementById("licensePlate").value.trim();
        const vinNumber   = document.getElementById("vinNumber").value.trim();

        /* ---------- validation ---------- */
        if (!make || !model || !color || !year || !plateNumber) {
            return showMessage("Please fill in all required fields.", "error");
        }

        // Sri‑Lankan style: “WP CAF 1234”, “CAZ1234” …
        const platePattern = /^(?:[A-Z]{1,2}\s*)?[A-Z]{2,3}\s*\d{4}$/i;
        if (!platePattern.test(plateNumber)) {
            return showMessage("Plate should look like WP CAF 1234.", "error");
        }

        /* ---------- duplication check ---------- */
        const vehicles     = JSON.parse(localStorage.getItem("vehicles") || "[]");
        const plateExists  = vehicles.some(
            v => v.plateNumber.toLowerCase() === plateNumber.toLowerCase()
        );
        if (plateExists) {
            return showMessage("A vehicle with this plate number already exists.", "error");
        }

        /* ---------- build object ---------- */
        const newVehicle = {
            make,
            model,
            color,
            year,
            plateNumber,
            vinNumber
        };

        localStorage.setItem("vehicles", JSON.stringify([...vehicles, newVehicle]));

        fetch("http://localhost:8080/api/vehicle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newVehicle)
        })
            .then(res => {
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(data => {
                console.log("Saved to server:", data);
                showMessage("Registration successful!", "success");
                setTimeout(() => (window.location.href = "vehicle.html"), 1500);
            })
            .catch(err => {
                console.error(err);
                showMessage("Something went wrong while saving.", "error");
            });
    });

    /* ---------- helper ---------- */
    function showMessage(text, type) {
        messageBox.style.display       = "block";
        messageBox.textContent         = text;
        messageBox.style.backgroundColor = type === "error" ? "#f8d7da" : "#d4edda";
        messageBox.style.color           = type === "error" ? "#721c24" : "#155724";
        messageBox.style.border          = type === "error" ? "1px solid #f5c6cb" : "1px solid #c3e6cb";
    }
});
