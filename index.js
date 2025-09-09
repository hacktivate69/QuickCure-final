// home.js

document.addEventListener('DOMContentLoaded', () => {
  const menuToggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  // Toggle mobile menu visibility and aria attributes
  menuToggleBtn.addEventListener('click', () => {
    const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
    menuToggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    mobileMenu.classList.toggle('active');

    // Update aria-hidden on mobile menu
    if (mobileMenu.classList.contains('active')) {
      mobileMenu.setAttribute('aria-hidden', 'false');
    } else {
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // Close mobile menu when clicking outside or on a link
  document.addEventListener('click', (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      e.target !== menuToggleBtn &&
      mobileMenu.classList.contains('active')
    ) {
      mobileMenu.classList.remove('active');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // Close mobile menu when a link inside it is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
  });
});