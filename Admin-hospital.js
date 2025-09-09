class HospitalManager {
  constructor() {
    this.hospitals = JSON.parse(localStorage.getItem('quickcare_hospitals')) || [];
    this.currentEditId = null;

    this.initializeSampleHospitals();
    this.initializeEventListeners();
    this.loadHospitals();
  }

  initializeEventListeners() {
    const addForm = document.getElementById('addHospitalForm');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddHospital();
      });
    }

    const search = document.getElementById('hospitalSearch');
    if (search) search.addEventListener('input', () => this.filterHospitals());

    const filterType = document.getElementById('filterType');
    if (filterType) filterType.addEventListener('change', () => this.filterHospitals());

    const filterCity = document.getElementById('filterCity');
    if (filterCity) filterCity.addEventListener('change', () => this.filterHospitals());

    const filterVerification = document.getElementById('filterVerification');
    if (filterVerification) filterVerification.addEventListener('change', () => this.filterHospitals());

    const clearBtn = document.querySelector('.btn.clear');
    if (clearBtn) clearBtn.addEventListener('click', () => this.resetForm());
  }

  initializeSampleHospitals() {
    if (this.hospitals.length === 0) {
      const mockHospitals = [
        {
          id: 1,
          name: "City General Hospital",
          type: "Govt",
          city: "delhi",
          image: "https://www.vecteezy.com/free-vector/hospital",
          reviews: 234,
          address: "123 Main Street, Connaught Place",
          phone: "+91 11 2345 6789",
          email: "citygeneral@example.com",
          verified: true
        },
        {
          id: 2,
          name: "Green Valley Multi-speciality",
          type: "Private",
          city: "mumbai",
          image: "https://www.vecteezy.com/free-vector/hospital",
          reviews: 156,
          address: "456 Marine Drive, Colaba",
          phone: "+91 22 9876 5432",
          email: "greenvalley@example.com",
          verified: true
        },
        // ... other hospitals with rating and distance removed
      ];
      this.hospitals = mockHospitals.map(h => ({
        ...h,
        createdAt: new Date().toISOString(),
        verified: h.verified !== undefined ? h.verified : true
      }));
      this.saveHospitals();
    }
  }

  handleAddHospital() {
    const formData = this.getFormData();

    if (!this.validateForm(formData)) return;

    if (this.currentEditId) {
      this.updateHospital(this.currentEditId, formData);
    } else {
      this.addHospital(formData);
    }

    this.resetForm();
  }

  getFormData() {
    const val = (id) => (document.getElementById(id)?.value || '').trim();
    const checked = (id) => document.getElementById(id)?.checked;

    return {
      name: val('hospitalName'),
      type: val('hospitalType'),
      city: val('hospitalCity'),
      address: val('hospitalAddress'),
      phone: val('hospitalPhone'),
      email: val('hospitalEmail'),
      reviews: parseInt(val('hospitalReviews'), 10),
      verified: checked('hospitalVerified')
    };
  }

  validateForm(data) {
    this.clearErrors();
    let isValid = true;

    if (!data.name) {
      this.showError('hospitalName', 'Name is required');
      isValid = false;
    }
    if (!data.type) {
      this.showError('hospitalType', 'Type is required');
      isValid = false;
    }
    if (!data.city) {
      this.showError('hospitalCity', 'City is required');
      isValid = false;
    }
    if (!data.address) {
      this.showError('hospitalAddress', 'Address is required');
      isValid = false;
    }
    if (!data.phone) {
      this.showError('hospitalPhone', 'Phone is required');
      isValid = false;
    } else if (!/^\+?\d{10,15}$/.test(data.phone)) {
      this.showError('hospitalPhone', 'Please enter a valid phone number');
      isValid = false;
    }
    if (!data.email || !this.isValidEmail(data.email)) {
      this.showError('hospitalEmail', 'Please enter a valid email address');
      isValid = false;
    }
    if (isNaN(data.reviews) || data.reviews < 0) {
      this.showError('hospitalReviews', 'Reviews must be a non-negative number');
      isValid = false;
    }

    if (!this.currentEditId && this.hospitals.some(h => h.name.toLowerCase() === data.name.toLowerCase())) {
      this.showError('hospitalName', 'A hospital with this name already exists');
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    field.parentNode && field.parentNode.appendChild(errorDiv);
  }

  clearErrors() {
    document.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach((el) => el.remove());
  }

  addHospital(hospitalData) {
    const newHospital = {
      id: Date.now(),
      ...hospitalData,
      createdAt: new Date().toISOString()
    };

    this.hospitals.push(newHospital);
    this.saveHospitals();
    this.loadHospitals();
    this.showMessage('Hospital added successfully!', 'success');
  }

  updateHospital(id, updatedData) {
    const index = this.hospitals.findIndex((hospital) => hospital.id == id);
    if (index !== -1) {
      this.hospitals[index] = {
        ...this.hospitals[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      this.saveHospitals();
      this.loadHospitals();
      this.showMessage('Hospital updated successfully!', 'success');
    }
  }

  editHospital(id) {
    const hospital = this.hospitals.find((h) => h.id == id);
    if (!hospital) return;

    document.getElementById('hospitalName').value = hospital.name;
    document.getElementById('hospitalType').value = hospital.type;
    document.getElementById('hospitalCity').value = hospital.city;
    document.getElementById('hospitalAddress').value = hospital.address;
    document.getElementById('hospitalPhone').value = hospital.phone;
    document.getElementById('hospitalEmail').value = hospital.email;
    document.getElementById('hospitalReviews').value = hospital.reviews;
    document.getElementById('hospitalVerified').checked = hospital.verified;

    this.currentEditId = id;
    const addBtn = document.querySelector('.btn.add');
    if (addBtn) addBtn.textContent = 'Update Hospital';
  }

  deleteHospital(id) {
    if (!confirm('Are you sure you want to delete this hospital?')) return;

    this.hospitals = this.hospitals.filter((hospital) => hospital.id != id);
    this.saveHospitals();
    this.loadHospitals();
    this.showMessage('Hospital deleted successfully!', 'success');
  }

  loadHospitals() {
    const tableBody = document.getElementById('hospitalListBody');
    if (!tableBody) return;

    if (!this.hospitals || this.hospitals.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <h3>No hospitals found</h3>
            <p>Add your first hospital to get started.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = this.hospitals
      .map(
        (hospital) => `
        <tr>
          <td>${this.escapeHtml(hospital.name)}</td>
          <td>${this.escapeHtml(this.formatType(hospital.type))}</td>
          <td>${this.escapeHtml(this.formatCity(hospital.city))}</td>
          <td>${hospital.reviews}</td>
          <td><span class="status-badge ${hospital.verified ? 'verified-true' : 'verified-false'}">${hospital.verified ? '✅ Verified' : '⏳ Pending'}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-edit" onclick="hospitalManager.editHospital('${hospital.id}')">Edit</button>
              <button class="btn btn-delete" onclick="hospitalManager.deleteHospital('${hospital.id}')">Delete</button>
            </div>
          </td>
        </tr>`
      )
      .join('');
  }

  filterHospitals() {
    const searchTerm = (document.getElementById('hospitalSearch')?.value || '').toLowerCase();
    const typeFilter = document.getElementById('filterType')?.value || '';
    const cityFilter = document.getElementById('filterCity')?.value || '';
    const verificationFilter = document.getElementById('filterVerification')?.value;

    let filteredHospitals = this.hospitals || [];

    if (searchTerm) {
      filteredHospitals = filteredHospitals.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchTerm) ||
          hospital.city.toLowerCase().includes(searchTerm) ||
          hospital.address.toLowerCase().includes(searchTerm)
      );
    }

    if (typeFilter) {
      filteredHospitals = filteredHospitals.filter((hospital) => hospital.type.toLowerCase() === typeFilter.toLowerCase());
    }

    if (cityFilter) {
      filteredHospitals = filteredHospitals.filter((hospital) => hospital.city.toLowerCase() === cityFilter.toLowerCase());
    }

    if (verificationFilter !== '' && verificationFilter !== undefined) {
      const isVerified = verificationFilter === 'true';
      filteredHospitals = filteredHospitals.filter(hospital => hospital.verified === isVerified);
    }

    this.renderFilteredHospitals(filteredHospitals);
  }

  renderFilteredHospitals(hospitals) {
    const tableBody = document.getElementById('hospitalListBody');
    if (!tableBody) return;

    if (!hospitals || hospitals.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <h3>No matching hospitals found</h3>
            <p>Try adjusting your search criteria.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = hospitals
      .map(
        (hospital) => `
        <tr>
          <td>${this.escapeHtml(hospital.name)}</td>
          <td>${this.escapeHtml(this.formatType(hospital.type))}</td>
          <td>${this.escapeHtml(this.formatCity(hospital.city))}</td>
          <td>${hospital.reviews}</td>
          <td><span class="status-badge ${hospital.verified ? 'verified-true' : 'verified-false'}">${hospital.verified ? '✅ Verified' : '⏳ Pending'}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-edit" onclick="hospitalManager.editHospital('${hospital.id}')">Edit</button>
              <button class="btn btn-delete" onclick="hospitalManager.deleteHospital('${hospital.id}')">Delete</button>
            </div>
          </td>
        </tr>`
      )
      .join('');
  }

  formatType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  formatCity(city) {
    const cities = {
      delhi: 'Delhi', mumbai: 'Mumbai', bengaluru: 'Bengaluru', kolkata: 'Kolkata',
      chennai: 'Chennai', hyderabad: 'Hyderabad', pune: 'Pune', lucknow: 'Lucknow'
    };
    return cities[city] || city;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
  }

  resetForm() {
    document.getElementById('addHospitalForm')?.reset();
    document.getElementById('hospitalVerified').checked = false;
    this.clearErrors();
    this.currentEditId = null;
    const addBtn = document.querySelector('.btn.add');
    if (addBtn) addBtn.textContent = 'Add Hospital';
  }

  saveHospitals() {
    localStorage.setItem('quickcare_hospitals', JSON.stringify(this.hospitals || []));
  }

  showMessage(message, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) existingMessage.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    const container = document.querySelector('.hospital-management-section');
    if (container) container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => messageDiv.remove(), 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.hospitalManager = new HospitalManager();
});