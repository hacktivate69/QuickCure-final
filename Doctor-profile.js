document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
  });

  // Modal elements
  const profileModal = document.getElementById('profileModal');
  const availabilityModal = document.getElementById('availabilityModal');
  const appointmentModal = document.getElementById('appointmentModal');

  // Buttons to open modals
  const editProfileBtn = document.getElementById('editProfileBtn');
  const addAvailabilityBtn = document.getElementById('addAvailabilityBtn');

  // Close buttons
  const closeProfileModalBtn = document.getElementById('closeProfileModal');
  const closeAvailabilityModalBtn = document.getElementById('closeAvailabilityModal');
  const closeAppointmentModalBtn = document.getElementById('closeAppointmentModal');

  // Cancel buttons inside modals
  const cancelProfileBtn = document.getElementById('cancelProfileBtn');
  const cancelAvailabilityBtn = document.getElementById('cancelAvailabilityBtn');
  const cancelAppointmentBtn = document.getElementById('cancelAppointmentBtn');

  // Forms
  const profileForm = document.getElementById('profileForm');
  const availabilityForm = document.getElementById('availabilityForm');

  // Appointment filters
  const appointmentDateInput = document.getElementById('appointmentDate');
  const appointmentStatusSelect = document.getElementById('appointmentStatus');

  // Appointment table body
  const appointmentsTableBody = document.querySelector('#appointmentsTable tbody');

  // Appointment modal actions
  const cancelAppointmentBtnAction = document.getElementById('cancelAppointmentBtn');
  const completeAppointmentBtn = document.getElementById('completeAppointmentBtn');

  // Profile avatar upload elements
  const avatarUploadInput = document.getElementById('avatarUpload');
  const profileAvatarImg = document.getElementById('profileAvatar');

  // Helper functions to show/hide modals
  function showModal(modal) {
    modal.classList.add('show');
  }

  function hideModal(modal) {
    modal.classList.remove('show');
  }

  // Open Profile Edit Modal and pre-fill form
  editProfileBtn.addEventListener('click', () => {
    document.getElementById('editName').value = document.getElementById('profileName').textContent;
    document.getElementById('editSpeciality').value = document.getElementById('profileSpeciality').textContent;
    const expText = document.getElementById('profileExperience').textContent;
    document.getElementById('editExperience').value = expText.match(/\d+/) ? expText.match(/\d+/)[0] : '';
    document.getElementById('editEmail').value = document.getElementById('profileEmail').textContent;
    document.getElementById('editPhone').value = document.getElementById('profilePhone').textContent;

    document.getElementById('editCity').value = document.getElementById('profileCity').textContent;
    document.getElementById('editLicenseNo').value = document.getElementById('profileLicenseNo').textContent;
    document.getElementById('editHospital').value = document.getElementById('profileHospital').textContent;
    document.getElementById('editQualifications').value = document.getElementById('profileQualifications').textContent;

    showModal(profileModal);
  });

  // Close Profile Modal
  closeProfileModalBtn.addEventListener('click', () => hideModal(profileModal));
  cancelProfileBtn.addEventListener('click', () => hideModal(profileModal));

  // Handle Profile Form submission
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Update profile display
    document.getElementById('profileName').textContent = document.getElementById('editName').value;
    document.getElementById('profileSpeciality').textContent = document.getElementById('editSpeciality').value;
    document.getElementById('profileExperience').textContent = document.getElementById('editExperience').value + ' years';
    document.getElementById('profileEmail').textContent = document.getElementById('editEmail').value;
    document.getElementById('profilePhone').textContent = document.getElementById('editPhone').value;

    document.getElementById('profileCity').textContent = document.getElementById('editCity').value;
    document.getElementById('profileLicenseNo').textContent = document.getElementById('editLicenseNo').value;
    document.getElementById('profileHospital').textContent = document.getElementById('editHospital').value;
    document.getElementById('profileQualifications').textContent = document.getElementById('editQualifications').value;

    alert('Profile updated successfully!');
    hideModal(profileModal);
  });

  // Avatar upload preview
  avatarUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      avatarUploadInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      profileAvatarImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Open Availability Modal
  addAvailabilityBtn.addEventListener('click', () => {
    document.getElementById('availabilityModalTitle').textContent = 'Add Availability';
    availabilityForm.reset();
    document.getElementById('editAvailabilityId').value = '';
    document.getElementById('saveAvailabilityBtn').textContent = 'Add Availability';
    showModal(availabilityModal);
  });

  // Close Availability Modal
  closeAvailabilityModalBtn.addEventListener('click', () => hideModal(availabilityModal));
  cancelAvailabilityBtn.addEventListener('click', () => hideModal(availabilityModal));

  // Handle Availability Form submission (mock)
  availabilityForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // For demo, just alert and close modal
    alert('Availability saved successfully!');
    hideModal(availabilityModal);

    // TODO: Implement dynamic availability list update
  });

  // Appointment filters change event (mock)
  function filterAppointments() {
    appointmentsTableBody.innerHTML = '';

    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6;
    td.textContent = 'Filtered appointments would appear here.';
    td.style.textAlign = 'center';
    td.style.fontStyle = 'italic';
    tr.appendChild(td);
    appointmentsTableBody.appendChild(tr);
  }

  appointmentDateInput.addEventListener('change', filterAppointments);
  appointmentStatusSelect.addEventListener('change', filterAppointments);

  // Close Appointment Modal
  closeAppointmentModalBtn.addEventListener('click', () => hideModal(appointmentModal));

  // Cancel Appointment button
  cancelAppointmentBtnAction.addEventListener('click', () => {
    alert('Appointment cancelled.');
    hideModal(appointmentModal);
  });

  // Complete Appointment button
  completeAppointmentBtn.addEventListener('click', () => {
    alert('Appointment marked as complete.');
    hideModal(appointmentModal);
  });

  // Close modals when clicking outside modal content
  [profileModal, availabilityModal, appointmentModal].forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal(modal);
      }
    });
  });
});