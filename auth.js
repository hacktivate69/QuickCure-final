function redirectByRole(role) {
  if (role === "patient") window.location.href = "Patient.html";
  else if (role === "doctor") window.location.href = "Doctor.html";
  else window.location.href = "Home.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const step1 = document.getElementById("step1");
  const step2Doctor = document.getElementById("step2-doctor");
  const step3 = document.getElementById("step3");
  const nextStepBtn = document.getElementById("nextStepBtn");
  const nextStep2Btn = document.getElementById("nextStep2Btn");
  const prevStepBtn = document.getElementById("prevStepBtn");
  const prevStep2Btn = document.getElementById("prevStep2Btn");

  // Step 1 -> Step 2 (for doctors) or Step 3 (for patients)
  nextStepBtn.addEventListener("click", () => {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const phone = document.getElementById("phone").value.trim();
    const userType = document.getElementById("userType").value;

    if (!firstName || !lastName || !email || !phone || !userType) {
      alert("Please fill all basic required fields.");
      return;
    }

    if (userType === 'doctor') {
      step1.style.display = "none";
      step2Doctor.style.display = "block";
    } else {
      step1.style.display = "none";
      step3.style.display = "block";
    }
  });

  // Step 2 (doctors) -> Step 3
  nextStep2Btn.addEventListener("click", () => {
    const license = document.getElementById("license")?.value.trim() || '';
    const hospitalAffiliation = document.getElementById("hospitalAffiliation")?.value || '';
    const specialization = document.getElementById("specialization")?.value || '';
    const experience = document.getElementById("experience")?.value;
    const qualification = document.getElementById("qualification")?.value.trim() || '';

    if (!license || !hospitalAffiliation || !specialization || !experience || !qualification) {
      alert("Please fill all doctor-specific fields.");
      return;
    }

    step2Doctor.style.display = "none";
    step3.style.display = "block";
  });

  // Step 2 -> Step 1 (back button)
  prevStepBtn.addEventListener("click", () => {
    step2Doctor.style.display = "none";
    step1.style.display = "block";
  });

  // Step 3 -> Step 1 or Step 2 (back button)
  prevStep2Btn.addEventListener("click", () => {
    const userType = document.getElementById("userType").value;
    if (userType === 'doctor') {
      step3.style.display = "none";
      step2Doctor.style.display = "block";
    } else {
      step3.style.display = "none";
      step1.style.display = "block";
    }
  });

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Gather all form data
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const phone = document.getElementById("phone").value.trim();
      const userType = document.getElementById("userType").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const photoInput = document.getElementById("profilePhoto");
      const photoFile = photoInput?.files[0];

      // Final validation (passwords, terms, etc.)
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      
      if (!document.getElementById("terms").checked) {
          alert("You must agree to the Terms of Service and Privacy Policy.");
          return;
      }

      let photoBase64 = '';
      if (photoFile) {
        photoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject('Error reading photo file');
          reader.readAsDataURL(photoFile);
        });
      }

      // Prepare payload
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        role: userType,
        password,
        profilePhoto: photoBase64,
      };

      if (userType === 'doctor') {
        payload.licenseNumber = document.getElementById("license")?.value.trim() || '';
        payload.hospital = document.getElementById("hospitalAffiliation")?.value || '';
        payload.specialization = document.getElementById("specialization")?.value || '';
        payload.yearsOfExperience = parseInt(document.getElementById("experience")?.value, 10) || 0;
        payload.qualification = document.getElementById("qualification")?.value.trim() || '';
      }

      try {
        const res = await fetch("http://localhost:3040/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok) {
          alert("Account created successfully!");
          redirectByRole(data.user.role);
        } else {
          alert(data.msg || data.error || "Registration failed");
        }
      } catch (err) {
        console.error(err);
        alert("Error registering user");
      }
    });
  }
});