document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const logoutBtns = document.querySelectorAll(".logout-btn");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const editPersonalBtn = document.getElementById("editPersonalBtn");
  const editModal = document.getElementById("editModal");
  const closeModalBtn = document.getElementById("closeModal");
  const cancelEditBtn = document.getElementById("cancelEdit");
  const editForm = document.getElementById("editForm");
  const modalTitle = document.getElementById("modalTitle");

  const fullNameSpan = document.getElementById("fullName");
  const dateOfBirthSpan = document.getElementById("dateOfBirth");
  const genderSpan = document.getElementById("gender");
  const bloodGroupSpan = document.getElementById("bloodGroup");
  const phoneSpan = document.getElementById("phone");
  const patientEmailSpan = document.getElementById("patientEmail");
  const patientNameHeading = document.getElementById("patientName");

  const notification = document.getElementById("notification");

  const statusFilter = document.getElementById("statusFilter");
  const dateFilter = document.getElementById("dateFilter");
  const appointmentsTableBody = document.querySelector("#appointmentsTable tbody");
  const appointmentsMobile = document.getElementById("appointmentsMobile");

  const viewModal = document.getElementById("viewModal");
  const closeViewModalBtn = document.getElementById("closeViewModal");
  const closeViewBtn = document.getElementById("closeView");
  const appointmentDetailsDiv = document.getElementById("appointmentDetails");
  const cancelAppointmentBtn = document.getElementById("cancelAppointmentBtn");

  // Profile picture upload elements
  const profilePicInput = document.getElementById("profilePicInput");
  const uploadPicBtn = document.getElementById("uploadPicBtn");
  const profileAvatarImg = document.getElementById("profileAvatarImg");
  const defaultAvatarIcon = document.getElementById("defaultAvatarIcon");

  // Sample user data (would come from backend in real app)
  let userProfile = {
    fullName: fullNameSpan.textContent,
    email: patientEmailSpan.textContent,
    dateOfBirth: dateOfBirthSpan.textContent,
    gender: genderSpan.textContent,
    bloodGroup: bloodGroupSpan.textContent,
    phone: phoneSpan.textContent,
  };

  // Sample appointments data
  let appointments = [
    {
      id: 1,
      date: "2025-02-15",
      time: "10:00 AM",
      doctor: "Dr. Smith",
      hospital: "City Hospital",
      specialty: "Cardiology",
      status: "Confirmed",
      notes: "Regular checkup",
    },
    {
      id: 2,
      date: "2025-03-01",
      time: "02:30 PM",
      doctor: "Dr. Lee",
      hospital: "Downtown Clinic",
      specialty: "Dermatology",
      status: "Pending",
      notes: "Skin rash consultation",
    },
    {
      id: 3,
      date: "2025-01-20",
      time: "11:00 AM",
      doctor: "Dr. Patel",
      hospital: "HealthCare Center",
      specialty: "Neurology",
      status: "Completed",
      notes: "Migraine follow-up",
    },
  ];

  // Utility: Show notification
  function showNotification(message, duration = 3000) {
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
      notification.textContent = "";
    }, duration);
  }

  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
  });

  // Logout handler (customize as needed)
  logoutBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showNotification("Logging out...");
      // Add your logout logic here, e.g., clear session/localStorage and redirect
      // localStorage.clear();
      // window.location.href = "login.html";
    });
  });

  // Load saved profile picture from localStorage (if any)
  function loadProfilePicture() {
    const savedPic = localStorage.getItem("profilePicture");
    if (savedPic) {
      profileAvatarImg.src = savedPic;
      profileAvatarImg.style.display = "block";
      defaultAvatarIcon.style.display = "none";
    } else {
      profileAvatarImg.style.display = "none";
      defaultAvatarIcon.style.display = "block";
    }
  }

  // Trigger file input when upload button clicked
  uploadPicBtn.addEventListener("click", () => {
    profilePicInput.click();
  });

  // Handle file input change
  profilePicInput.addEventListener("change", () => {
    const file = profilePicInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        profileAvatarImg.src = e.target.result;
        profileAvatarImg.style.display = "block";
        defaultAvatarIcon.style.display = "none";
        // Save to localStorage for persistence (demo purpose)
        localStorage.setItem("profilePicture", e.target.result);
        showNotification("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  });

  // Call on page load
  loadProfilePicture();

  // Open edit modal and populate form
  function openEditModal(section) {
    editForm.innerHTML = ""; // Clear previous form fields

    if (section === "profile") {
      modalTitle.textContent = "Edit Profile";
      // For simplicity, editing personal info only here
      openEditModal("personal");
      return;
    }

    if (section === "personal") {
      modalTitle.textContent = "Edit Personal Information";

      // Create form fields dynamically including email
      const fields = [
        { label: "Full Name", id: "fullNameInput", type: "text", value: userProfile.fullName, required: true },
        { label: "Email", id: "emailInput", type: "email", value: userProfile.email, required: true },
        { label: "Date of Birth", id: "dateOfBirthInput", type: "date", value: formatDateForInput(userProfile.dateOfBirth), required: true },
        { label: "Gender", id: "genderInput", type: "select", options: ["Male", "Female", "Other"], value: userProfile.gender, required: true },
        { label: "Blood Group", id: "bloodGroupInput", type: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], value: userProfile.bloodGroup, required: true },
        { label: "Phone", id: "phoneInput", type: "tel", value: userProfile.phone, required: true },
      ];

      fields.forEach(field => {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");

        const label = document.createElement("label");
        label.setAttribute("for", field.id);
        label.textContent = field.label;
        formGroup.appendChild(label);

        let input;
        if (field.type === "select") {
          input = document.createElement("select");
          input.id = field.id;
          input.name = field.id;
          field.options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            if (opt === field.value) option.selected = true;
            input.appendChild(option);
          });
        } else {
          input = document.createElement("input");
          input.type = field.type;
          input.id = field.id;
          input.name = field.id;
          input.value = field.value;
        }
        if (field.required) input.required = true;

        formGroup.appendChild(input);
        editForm.appendChild(formGroup);
      });

      // Show modal
      editModal.style.display = "block";
    }
  }

  // Format date string like "January 15, 1990" to "1990-01-15" for input[type=date]
  function formatDateForInput(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Format date from input[type=date] (YYYY-MM-DD) to readable format like "January 15, 1990"
  function formatDateReadable(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  // Close edit modal
  function closeEditModal() {
    editModal.style.display = "none";
    editForm.reset();
  }

  // Save edited personal info
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get values
    const fullName = document.getElementById("fullNameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const dateOfBirth = document.getElementById("dateOfBirthInput").value;
    const gender = document.getElementById("genderInput").value;
    const bloodGroup = document.getElementById("bloodGroupInput").value;
    const phone = document.getElementById("phoneInput").value.trim();

    if (!fullName || !email || !dateOfBirth || !gender || !bloodGroup || !phone) {
      showNotification("Please fill all required fields.");
      return;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showNotification("Please enter a valid email address.");
      return;
    }

    // Update userProfile object
    userProfile.fullName = fullName;
    userProfile.email = email;
    userProfile.dateOfBirth = formatDateReadable(dateOfBirth);
    userProfile.gender = gender;
    userProfile.bloodGroup = bloodGroup;
    userProfile.phone = phone;

    // Update UI
    fullNameSpan.textContent = userProfile.fullName;
    patientEmailSpan.textContent = userProfile.email;
    patientNameHeading.textContent = userProfile.fullName;
    dateOfBirthSpan.textContent = userProfile.dateOfBirth;
    genderSpan.textContent = userProfile.gender;
    bloodGroupSpan.textContent = userProfile.bloodGroup;
    phoneSpan.textContent = userProfile.phone;

    showNotification("Profile updated successfully!");
    closeEditModal();
  });

  // Event listeners for opening edit modal
  editProfileBtn.addEventListener("click", () => openEditModal("profile"));
  editPersonalBtn.addEventListener("click", () => openEditModal("personal"));

  // Close modal buttons
  closeModalBtn.addEventListener("click", closeEditModal);
  cancelEditBtn.addEventListener("click", closeEditModal);

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === editModal) closeEditModal();
    if (e.target === viewModal) closeViewModal();
  });

  // --- Appointments ---

  // Render appointments in table and mobile views
  function renderAppointments() {
    // Clear current
    appointmentsTableBody.innerHTML = "";
    appointmentsMobile.innerHTML = "";

    // Apply filters
    const statusVal = statusFilter.value;
    const dateVal = dateFilter.value;

    let filtered = appointments;

    if (statusVal) {
      filtered = filtered.filter(app => app.status === statusVal);
    }
    if (dateVal) {
      filtered = filtered.filter(app => app.date === dateVal);
    }

    if (filtered.length === 0) {
      appointmentsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No appointments found.</td></tr>`;
      appointmentsMobile.innerHTML = `<p style="text-align:center;">No appointments found.</p>`;
      return;
    }

    // Desktop table rows
    filtered.forEach(app => {
      const tr = document.createElement("tr");

      // Status badge class
      const statusClass = `status-${app.status.toLowerCase()}`;

      tr.innerHTML = `
        <td>${formatDateReadable(app.date)}</td>
        <td>${app.time}</td>
        <td>${app.doctor}</td>
        <td>${app.hospital}</td>
        <td>${app.specialty}</td>
        <td><span class="${statusClass}">${app.status}</span></td>
        <td>
          <button class="btn btn-small btn-primary view-appointment-btn" data-id="${app.id}">
            <i class="fas fa-eye"></i> View
          </button>
        </td>
      `;

      appointmentsTableBody.appendChild(tr);
    });

    // Mobile cards
    filtered.forEach(app => {
      const card = document.createElement("div");
      card.classList.add("appointment-card");
      card.classList.add(app.status.toLowerCase());

      card.innerHTML = `
        <div class="card-header-mobile">
          <div>
            <p class="card-date">${formatDateReadable(app.date)}</p>
            <p class="card-time">${app.time}</p>
          </div>
          <div>
            <span class="card-status ${app.status.toLowerCase()}">${app.status}</span>
          </div>
        </div>
        <div class="card-body">
          <p class="card-doctor">${app.doctor}</p>
          <p class="card-details">${app.hospital}</p>
          <p class="card-details">${app.specialty}</p>
        </div>
        <div class="card-actions">
          <button class="btn btn-small btn-primary view-appointment-btn" data-id="${app.id}">
            <i class="fas fa-eye"></i> View
          </button>
        </div>
      `;
      appointmentsMobile.appendChild(card);
    });

    // Add event listeners to all view buttons
    document.querySelectorAll(".view-appointment-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        openViewModal(id);
      });
    });
  }

  // Filters change
  statusFilter.addEventListener("change", renderAppointments);
  dateFilter.addEventListener("change", renderAppointments);

  // View appointment modal
  function openViewModal(appointmentId) {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return;

    appointmentDetailsDiv.innerHTML = `
      <p><strong>Date:</strong> ${formatDateReadable(appointment.date)}</p>
      <p><strong>Time:</strong> ${appointment.time}</p>
      <p><strong>Doctor:</strong> ${appointment.doctor}</p>
      <p><strong>Hospital:</strong> ${appointment.hospital}</p>
      <p><strong>Specialty:</strong> ${appointment.specialty}</p>
      <p><strong>Status:</strong> ${appointment.status}</p>
      <p><strong>Notes:</strong> ${appointment.notes}</p>
    `;

    // Show cancel button only if status is Confirmed or Pending
    if (appointment.status === "Confirmed" || appointment.status === "Pending") {
      cancelAppointmentBtn.style.display = "inline-block";
      cancelAppointmentBtn.onclick = () => cancelAppointment(appointmentId);
    } else {
      cancelAppointmentBtn.style.display = "none";
      cancelAppointmentBtn.onclick = null;
    }

    viewModal.style.display = "block";
  }

  // Close view modal
  function closeViewModal() {
    viewModal.style.display = "none";
    appointmentDetailsDiv.innerHTML = "";
  }

  closeViewModalBtn.addEventListener("click", closeViewModal);
  closeViewBtn.addEventListener("click", closeViewModal);

  // Cancel appointment
  function cancelAppointment(appointmentId) {
    const index = appointments.findIndex(app => app.id === appointmentId);
    if (index === -1) return;

    if (confirm("Are you sure you want to cancel this appointment?")) {
      appointments[index].status = "Cancelled";
      showNotification("Appointment cancelled.");
      closeViewModal();
      renderAppointments();
    }
  }

  // Initial render
  renderAppointments();
});