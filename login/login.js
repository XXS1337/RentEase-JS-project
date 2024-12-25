// When the window loads, add blur event listeners to the email and password fields to trigger validation when the user moves away from the input field
window.onload = function () {
  document.querySelector('.email').addEventListener('blur', validateEmailField);
  document.querySelector('.password').addEventListener('blur', validatePasswordField);
};

// Submit button hover effects
let submitButton = document.querySelector('.submitButton');

submitButton.addEventListener('mouseover', () => {
  submitButton.classList.add('submitButtonHoverEffects');
});

submitButton.addEventListener('mouseout', () => {
  submitButton.classList.remove('submitButtonHoverEffects');
});

// Login Form submission:
document.querySelector('.loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get values directly from input fields
  const email = document.querySelector('.email').value.trim();
  const password = document.querySelector('.password').value.trim();

  // Validate the form fields before attempting login
  const isValid = validateForm(email, password);

  // If the form is valid, attempt to log in the user
  if (isValid) {
    const loginSuccess = loginUser(email, password);
    if (loginSuccess) {
      alert('Login successful');
      window.location = '../homepage/homepage.html';
    } else {
      alert('Invalid credentials');
      window.location = '../register/register.html';
    }
  }
});

// Form validation for email and password
function validateForm(email, password) {
  let isValid = true;
  if (!validateEmailField()) isValid = false;
  if (!validatePasswordField()) isValid = false;
  return isValid;
}

function validateEmailField() {
  const email = document.querySelector('.email').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showError('.emailError', 'Invalid email format.');
    return false;
  } else {
    clearError('.emailError');
    return true;
  }
}

function validatePasswordField() {
  const password = document.querySelector('.password').value.trim();

  if (password.length === 0) {
    showError('.passwordError', 'Password is required.');
    return false;
  } else {
    clearError('.passwordError');
    return true;
  }
}

// Validate user email and password for login process
function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const foundUser = users.find((storedUser) => storedUser.email === email && storedUser.password === password);

  if (foundUser) {
    localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
    localStorage.setItem('loginTime', Date.now());
    return true;
  } else {
    return false;
  }
}

// Show and clear error functions
function showError(elementClass, message) {
  document.querySelector(elementClass).innerText = message;
}

function clearError(elementClass) {
  document.querySelector(elementClass).innerText = '';
}
