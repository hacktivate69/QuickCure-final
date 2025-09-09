document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('show'); // Toggle 'show' class to display mobile menu
  });

  // Close mobile menu when clicking a link inside it
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('show');
    });
  });

  // Logout buttons
  const logoutBtnDesktop = document.getElementById('logoutBtnDesktop');
  const logoutBtnMobile = document.getElementById('logoutBtnMobile');

  function logout() {
    // Clear user session or token here if applicable
    alert('You have been logged out.');
    // Redirect to login page or homepage
    window.location.href = '../index.html';
  }

  logoutBtnDesktop.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  logoutBtnMobile.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  // Populate specialty and city dropdowns
  const specialties = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Psychiatry',
    'General Medicine',
  ];

  const cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
  ];

  const specialtySelect = document.getElementById('specialty');
  const citySelect = document.getElementById('city');

  function populateSelect(selectElement, options) {
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      selectElement.appendChild(opt);
    });
  }

  populateSelect(specialtySelect, specialties);
  populateSelect(citySelect, cities);

  // Notification helper
  const notification = document.getElementById('notification');

  function showNotification(message, duration = 3000) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
      notification.textContent = '';
    }, duration);
  }

  // Handle Find Available Doctors button click
  const nextBtn = document.getElementById('nextBtn');

  nextBtn.addEventListener('click', () => {
    const selectedSpecialty = specialtySelect.value;
    const selectedCity = citySelect.value;

    if (!selectedSpecialty) {
      showNotification('Please select a specialty.');
      return;
    }

    if (!selectedCity) {
      showNotification('Please select a city.');
      return;
    }

    showNotification(`Searching doctors for ${selectedSpecialty} in ${selectedCity}...`);

    // Example: redirect to a doctors listing page with query params
    // Uncomment below line to enable redirection
    // window.location.href = `doctors-list.html?specialty=${encodeURIComponent(selectedSpecialty)}&city=${encodeURIComponent(selectedCity)}`;
  });
});