// patient-appointment.js

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const logoutBtnDesktop = document.getElementById('logoutBtnDesktop');
  const logoutBtnMobile = document.getElementById('logoutBtnMobile');
  const doctorsGrid = document.getElementById('doctorsGrid');
  const noResults = document.getElementById('noResults');

  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModal');
  const bookingForm = document.getElementById('bookingForm');
  const doctorSummary = document.getElementById('doctorSummary');
  const selectedDoctorIdInput = document.getElementById('selectedDoctorId');
  const appointmentDateInput = document.getElementById('appointmentDate');
  const appointmentTimeSelect = document.getElementById('appointmentTime');
  const appointmentReasonInput = document.getElementById('appointmentReason');
  const cancelBookingBtn = document.getElementById('cancelBooking');

  const successModal = document.getElementById('successModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModal');
  const appointmentDetails = document.getElementById('appointmentDetails');
  const recommendationsList = document.getElementById('recommendationsList');

  const notification = document.getElementById('notification');

  // Sample doctors data (replace with real data or API call)
  const doctors = [
    {
      id: 'doc1',
      name: 'Dr. Alice Smith',
      specialty: 'Cardiology',
      city: 'New York',
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4.8,
      bio: 'Experienced cardiologist with 10+ years in patient care.',
      recommendations: [
        'Bring previous ECG reports',
        'Avoid caffeine before appointment',
        'List current medications',
      ],
    },
    {
      id: 'doc2',
      name: 'Dr. Bob Johnson',
      specialty: 'Dermatology',
      city: 'Los Angeles',
      photo: 'https://randomuser.me/api/portraits/men/46.jpg',
      rating: 4.5,
      bio: 'Specialist in skin conditions and cosmetic dermatology.',
      recommendations: [
        'Avoid applying creams on the day of visit',
        'Note any allergies',
      ],
    },
    {
      id: 'doc3',
      name: 'Dr. Clara Lee',
      specialty: 'Pediatrics',
      city: 'Chicago',
      photo: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 4.9,
      bio: 'Pediatrician focused on child health and wellness.',
      recommendations: [
        'Bring child’s vaccination records',
        'Prepare questions about child’s diet',
      ],
    },
  ];

  // Utility: Show notification
  function showNotification(message, duration = 3000) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
      notification.textContent = '';
    }, duration);
  }

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    const expanded = mobileMenu.getAttribute('aria-hidden') === 'false';
    mobileMenu.setAttribute('aria-hidden', expanded ? 'true' : 'false');
    mobileMenu.classList.toggle('active');
  });

  // Logout function
  function logout() {
    // TODO: Add real logout logic (clear session, tokens, etc.)
    alert('You have been logged out.');
    window.location.href = '../index.html';
  }

  logoutBtnDesktop.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });

  logoutBtnMobile.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });

  // Render doctors grid
  function renderDoctors(doctorsList) {
    doctorsGrid.innerHTML = '';
    if (doctorsList.length === 0) {
      noResults.style.display = 'block';
      return;
    }
    noResults.style.display = 'none';

    doctorsList.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'doctor-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-pressed', 'false');
      card.setAttribute('aria-label', `Book appointment with ${doc.name}, ${doc.specialty} in ${doc.city}`);

      card.innerHTML = `
        <img src="${doc.photo}" alt="Photo of ${doc.name}" class="doctor-photo" />
        <div class="doctor-info">
          <h3>${doc.name}</h3>
          <p><strong>Specialty:</strong> ${doc.specialty}</p>
          <p><strong>City:</strong> ${doc.city}</p>
          <p><strong>Rating:</strong> ${doc.rating} <i class="fas fa-star" aria-hidden="true"></i></p>
          <p class="doctor-bio">${doc.bio}</p>
          <button class="btn btn-primary book-btn" data-doctor-id="${doc.id}">Book Appointment</button>
        </div>
      `;

      doctorsGrid.appendChild(card);
    });
  }

  // Open booking modal for selected doctor
  function openBookingModal(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) {
      showNotification('Selected doctor not found.');
      return;
    }

    selectedDoctorIdInput.value = doctor.id;

    doctorSummary.innerHTML = `
      <img src="${doctor.photo}" alt="Photo of ${doctor.name}" class="modal-doctor-photo" />
      <div class="modal-doctor-info">
        <h4>${doctor.name}</h4>
        <p><strong>Specialty:</strong> ${doctor.specialty}</p>
        <p><strong>City:</strong> ${doctor.city}</p>
        <p>${doctor.bio}</p>
      </div>
    `;

    // Reset form fields
    bookingForm.reset();

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    appointmentDateInput.setAttribute('min', today);

    bookingModal.style.display = 'block';
    bookingModal.setAttribute('aria-hidden', 'false');
    appointmentDateInput.focus();
  }

  // Close booking modal
  function closeBookingModal() {
    bookingModal.style.display = 'none';
    bookingModal.setAttribute('aria-hidden', 'true');
  }

  // Close success modal
  function closeSuccessModal() {
    successModal.style.display = 'none';
    successModal.setAttribute('aria-hidden', 'true');
  }

  // Show success modal with appointment details and recommendations
  function showSuccessModal(appointment) {
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    if (!doctor) return;

    appointmentDetails.innerHTML = `
      <p><strong>Doctor:</strong> ${doctor.name} (${doctor.specialty})</p>
      <p><strong>Date:</strong> ${appointment.date}</p>
      <p><strong>Time:</strong> ${appointment.time}</p>
      <p><strong>Reason:</strong> ${appointment.reason || 'N/A'}</p>
    `;

    recommendationsList.innerHTML = '';
    doctor.recommendations.forEach(rec => {
      const li = document.createElement('li');
      li.textContent = rec;
      recommendationsList.appendChild(li);
    });

    successModal.style.display = 'block';
    successModal.setAttribute('aria-hidden', 'false');
    closeSuccessModalBtn.focus();
  }

  // Event delegation for book buttons
  doctorsGrid.addEventListener('click', e => {
    if (e.target.classList.contains('book-btn')) {
      const doctorId = e.target.getAttribute('data-doctor-id');
      openBookingModal(doctorId);
    }
  });

  // Close booking modal events
  closeModalBtn.addEventListener('click', closeBookingModal);
  cancelBookingBtn.addEventListener('click', closeBookingModal);

  // Close modals on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (bookingModal.style.display === 'block') {
        closeBookingModal();
      }
      if (successModal.style.display === 'block') {
        closeSuccessModal();
      }
    }
  });

  // Booking form submit handler
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();

    const doctorId = selectedDoctorIdInput.value;
    const date = appointmentDateInput.value;
    const time = appointmentTimeSelect.value;
    const reason = appointmentReasonInput.value.trim();

    if (!doctorId || !date || !time) {
      showNotification('Please fill in all required fields.');
      return;
    }

    // Validate date is today or later
    const today = new Date();
    const selectedDate = new Date(date + 'T00:00:00');
    if (selectedDate < new Date(today.toDateString())) {
      showNotification('Please select a valid date (today or later).');
      return;
    }

    // Here you would normally send booking data to backend API
    // For demo, simulate success after short delay
    closeBookingModal();

    const appointment = {
      doctorId,
      date,
      time,
      reason,
    };

    setTimeout(() => {
      showSuccessModal(appointment);
    }, 500);
  });

  // Close success modal button
  closeSuccessModalBtn.addEventListener('click', closeSuccessModal);

  // Initial render of doctors
  renderDoctors(doctors);
});