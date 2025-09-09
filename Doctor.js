// Dummy Data (for demonstration purposes)
let DUMMY_PRESCRIPTIONS = [
    {
        date: "2025-09-05",
        patientName: "John Doe",
        medicines: "Amoxicillin 500mg (twice a day for 7 days)",
    },
    {
        date: "2025-09-01",
        patientName: "Jane Smith",
        medicines: "Ibuprofen 200mg (as needed for pain), Rest",
    },
];

let DUMMY_PATIENTS = [
    {
        name: "John Doe",
        age: 35,
        lastVisit: "2025-09-08",
        phone: "9876543210",
    },
    {
        name: "Jane Smith",
        age: 28,
        lastVisit: "2025-09-09",
        phone: "9876543211",
    },
];

// Utility function to format date
function getFormattedDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Function to render patient table
function renderPatientTable() {
    const patientTableBody = document.getElementById("patientTableBody");
    if (!patientTableBody) return;

    if (DUMMY_PATIENTS.length === 0) {
        patientTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No patients added yet.</td></tr>`;
        return;
    }

    patientTableBody.innerHTML = DUMMY_PATIENTS.map(
        (p, index) => `
        <tr>
            <td>${p.name}</td>
            <td>${p.age}</td>
            <td>${p.lastVisit}</td>
            <td>${p.phone}</td>
            <td>
                <button class="btn btn-secondary btn-small view-patient-btn" data-index="${index}">View</button>
            </td>
        </tr>
    `).join("");
}

// Function to render prescriptions table
function renderPrescriptionTable() {
    const prescriptionTableBody = document.getElementById("prescriptionTableBody");
    if (!prescriptionTableBody) return;

    if (DUMMY_PRESCRIPTIONS.length === 0) {
        prescriptionTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No prescriptions issued yet.</td></tr>`;
        return;
    }

    prescriptionTableBody.innerHTML = DUMMY_PRESCRIPTIONS.map(
        (p, index) => `
        <tr>
            <td>${p.date}</td>
            <td>${p.patientName}</td>
            <td>${p.medicines}</td>
            <td>
                <button class="btn btn-secondary btn-small view-prescription-btn" data-index="${index}">View</button>
            </td>
        </tr>
    `).join("");
}

// Function to update dashboard stats
function updateDashboardStats() {
    document.getElementById("totalPatients").textContent = DUMMY_PATIENTS.length;
    document.getElementById("doctorRating").textContent = "4.8"; // Dummy value
    document.getElementById("doctorName").textContent = "Dr. Alex Johnson"; // Dummy value
}

// Modal management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("show");
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("show");
    }
}

// Function to handle viewing details
function viewDetails(type, data) {
    const modal = document.getElementById("viewDetailsModal");
    const content = document.getElementById("viewDetailsContent");

    if (type === 'patient') {
        content.innerHTML = `
            <h4>Patient Details</h4>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Age:</strong> ${data.age}</p>
            <p><strong>Last Visit:</strong> ${data.lastVisit}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
        `;
    } else if (type === 'prescription') {
        content.innerHTML = `
            <h4>Prescription Details</h4>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Patient Name:</strong> ${data.patientName}</p>
            <p><strong>Medicines:</strong></p>
            <pre>${data.medicines}</pre>
        `;
    }
    openModal("viewDetailsModal");
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    updateDashboardStats();
    renderPatientTable();
    renderPrescriptionTable();

    // Open/Close Modals
    document.getElementById("addPatientBtn").addEventListener("click", () => openModal("addPatientModal"));
    document.getElementById("issuePrescriptionBtn").addEventListener("click", () => openModal("issuePrescriptionModal"));
    
    document.querySelectorAll(".close-btn").forEach(button => {
        button.addEventListener("click", () => {
            closeModal("addPatientModal");
            closeModal("issuePrescriptionModal");
            closeModal("viewDetailsModal");
        });
    });

    // Form Submissions
    document.getElementById("addPatientForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("patientName").value;
        const age = document.getElementById("patientAge").value;
        const phone = document.getElementById("patientPhone").value;
        DUMMY_PATIENTS.push({ name, age, lastVisit: getFormattedDate(), phone });
        renderPatientTable();
        updateDashboardStats();
        closeModal("addPatientModal");
        e.target.reset();
    });

    document.getElementById("issuePrescriptionForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const patientName = document.getElementById("prescriptionPatient").value;
        const medicines = document.getElementById("prescriptionMedicines").value;
        DUMMY_PRESCRIPTIONS.unshift({ date: getFormattedDate(), patientName, medicines });
        renderPrescriptionTable();
        closeModal("issuePrescriptionModal");
        e.target.reset();
    });

    // View Details Buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-patient-btn')) {
            const index = e.target.getAttribute('data-index');
            viewDetails('patient', DUMMY_PATIENTS[index]);
        }
        if (e.target.classList.contains('view-prescription-btn')) {
            const index = e.target.getAttribute('data-index');
            viewDetails('prescription', DUMMY_PRESCRIPTIONS[index]);
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("show");
    });
});
