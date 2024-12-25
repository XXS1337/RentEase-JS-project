// When the window loads, add blur event listeners to form fields to trigger validation when the user moves away from the input field
window.onload = function () {
  document.querySelector('.firstName').addEventListener('blur', validateFirstNameField);
  document.querySelector('.lastName').addEventListener('blur', validateLastNameField);
  document.querySelector('.email').addEventListener('blur', validateEmailField);
  document.querySelector('.password').addEventListener('blur', validatePasswordField);
  document.querySelector('.confirmPassword').addEventListener('blur', validateConfirmPasswordField);
  document.querySelector('.birthDate').addEventListener('blur', validateBirthDateField);
};

// Submit button hover effects
let submitButton = document.querySelector('.submitButton');

submitButton.addEventListener('mouseover', () => {
  submitButton.classList.add('submitButtonHoverEffects');
});

submitButton.addEventListener('mouseout', () => {
  submitButton.classList.remove('submitButtonHoverEffects');
});

// Register Form submission:
document.querySelector('.registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Create a user object with the form input values
  const user = {
    firstName: document.querySelector('.firstName').value,
    lastName: document.querySelector('.lastName').value,
    email: document.querySelector('.email').value,
    password: document.querySelector('.password').value,
    birthDate: document.querySelector('.birthDate').value,
    flats: [],
  };

  // Validate the form fields
  const isValid = validateForm(user);

  // If all fields are valid, save the user and reset the form
  if (isValid) {
    saveUser(user);
    alert('You account has been successfully created!');
    document.querySelector('.registerForm').reset();
    resetErrors();

    // Redirect to the login page after registration
    window.location = '../login/login.html';
  }
});

// Function to reset error messages for all fields
function resetErrors() {
  document.querySelectorAll('.error').forEach((e) => (e.innerHTML = ''));
}

// Validate the form before submission
function validateForm(user) {
  let isValid = true;

  if (!validateFirstNameField()) isValid = false;
  if (!validateLastNameField()) isValid = false;
  if (!validateEmailField()) isValid = false;
  if (!validatePasswordField()) isValid = false;
  if (!validateConfirmPasswordField()) isValid = false;
  if (!validateBirthDateField()) isValid = false;
  return isValid;
}

// All fields validation functions
function validateFirstNameField() {
  const firstName = document.querySelector('.firstName').value.trim();
  if (firstName.length < 2) {
    showError('.firstNameError', 'First name must be at least 2 characters long.');
    return false;
  } else {
    clearError('.firstNameError');
    return true;
  }
}

function validateLastNameField() {
  const lastName = document.querySelector('.lastName').value.trim();
  if (lastName.length < 2) {
    showError('.lastNameError', 'Last name must be at least 2 characters long.');
    return false;
  } else {
    clearError('.lastNameError');
    return true;
  }
}

function validateEmailField() {
  const email = document.querySelector('.email').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const users = JSON.parse(localStorage.getItem('users')) || [];

  if (!emailPattern.test(email)) {
    showError('.emailError', 'Invalid email format.');
    return false;
  } else if (users.some((user) => user.email === email)) {
    showError('.emailError', 'This email is already registered!');
    return false;
  } else {
    clearError('.emailError');
    return true;
  }
}

function validatePasswordField() {
  const password = document.querySelector('.password').value.trim();
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;

  if (!passwordPattern.test(password)) {
    showError('.passwordError', 'Password must be at least 6 characters long, contain letters, numbers, and special characters.');
    return false;
  } else {
    clearError('.passwordError');
    return true;
  }
}

function validateConfirmPasswordField() {
  const password = document.querySelector('.password').value.trim();
  const confirmPassword = document.querySelector('.confirmPassword').value.trim();

  // Check if the confirm password field is empty
  if (!confirmPassword) {
    showError('.confirmPasswordError', 'Please confirm your password.');
    return false;
  }

  // Check if the passwords match
  if (confirmPassword !== password) {
    showError('.confirmPasswordError', 'Passwords do not match.');
    return false;
  } else {
    clearError('.confirmPasswordError');
    return true;
  }
}

function validateBirthDateField() {
  const birthDate = document.querySelector('.birthDate').value;

  if (!birthDate) {
    showError('.birthDateError', 'Birth date is required.');
    return false;
  }

  const birthDateObj = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  const dayDiff = today.getDate() - birthDateObj.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  if (age < 18 || age > 120) {
    showError('.birthDateError', 'Age must be between 18 and 120.');
    return false;
  } else {
    clearError('.birthDateError');
    return true;
  }
}
// Show and clear error functions
function showError(elementClass, message) {
  document.querySelector(elementClass).innerText = message;
}

function clearError(elementClass) {
  document.querySelector(elementClass).innerText = '';
}

// Save user to local storage:
function saveUser(user) {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const userId = Date.now();

  users.push({
    userId: userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
    birthDate: user.birthDate,
    flats: [], // Initialize flats as an empty array
  });

  // Save the updated users array to localStorage
  localStorage.setItem('users', JSON.stringify(users));
}
