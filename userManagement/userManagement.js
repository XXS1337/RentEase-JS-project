window.onload = function () {
  // Check if the user is logged in
  if (!loadLoggedInUser()) {
    alert('No logged-in user found.');
    window.location.href = '../login/login.html';
  } else {
    checkSessionExpiry();
    setInterval(checkSessionExpiry, 60 * 1000);

    // Add validation event listeners if logged in
    document.querySelector('.firstName').addEventListener('blur', validateFirstNameField);
    document.querySelector('.lastName').addEventListener('blur', validateLastNameField);
    document.querySelector('.email').addEventListener('blur', validateEmailField);
    document.querySelector('.birthDate').addEventListener('blur', validateBirthDateField);
    document.querySelector('.password').addEventListener('blur', validatePasswordField);
    document.querySelector('.confirmPassword').addEventListener('blur', validateConfirmPasswordField);
  }
};

// Logout button event listener
document.querySelector('.navbarLogout').addEventListener('click', function () {
  localStorage.setItem('loggedInUser', '{}');
  localStorage.setItem('loginTime', '{}');
  alert('You have been logged out.');
  window.location = '../login/login.html';
});

// Submit Button hover effect
let submitButton = document.querySelector('.submitButton');

submitButton.addEventListener('mouseover', () => {
  submitButton.classList.add('submitButtonHoverEffects');
});

submitButton.addEventListener('mouseout', () => {
  submitButton.classList.remove('submitButtonHoverEffects');
});

// Update user info form submission:
document.querySelector('.userManagementForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get updated values directly from form inputs
  const firstName = document.querySelector('.firstName').value.trim();
  const lastName = document.querySelector('.lastName').value.trim();
  const email = document.querySelector('.email').value.trim();
  const password = document.querySelector('.password').value.trim();
  const birthDate = document.querySelector('.birthDate').value;

  // Validate the form before submission
  const isValid = validateForm(firstName, lastName, email, password, birthDate);
  if (isValid) {
    updateUserProfile(firstName, lastName, email, password, birthDate); // Update user's profile in local storage
    alert('User information updated successfully.');
    window.location = '../homepage/homepage.html'; // Redirect to homepage
  }
});

// Show the logged-in user's profile details into the form fields
function loadLoggedInUser() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  if (loggedInUser && Object.keys(loggedInUser).length > 0 && loggedInUser.userId) {
    // Populate the form with the user's details
    document.querySelector('.firstName').value = loggedInUser.firstName || '';
    document.querySelector('.lastName').value = loggedInUser.lastName || '';
    document.querySelector('.email').value = loggedInUser.email || '';
    document.querySelector('.password').value = ''; // Don't pre-fill the password field
    document.querySelector('.birthDate').value = loggedInUser.birthDate || '';
    return true;
  }
  return false;
}

// Form validation and all fields
function validateForm(firstName, lastName, email, password, birthDate) {
  let isValid = true;
  if (!validateFirstNameField()) isValid = false;
  if (!validateLastNameField()) isValid = false;
  if (!validateEmailField()) isValid = false;
  if (!validatePasswordField()) isValid = false;
  if (!validateBirthDateField()) isValid = false;
  return isValid;
}

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
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  if (!emailPattern.test(email)) {
    showError('.emailError', 'Invalid email format.');
    return false;
  } else if (users.some((user) => user.email === email && user.email !== loggedInUser.email)) {
    showError('.emailError', 'This email is already registered to another user.');
    return false;
  } else {
    clearError('.emailError');
    return true;
  }
}

// Validate password (optional, only if a new password is entered)
function validatePasswordField() {
  const password = document.querySelector('.password').value.trim();
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;

  if (password.length > 0 && !passwordPattern.test(password)) {
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

  if (password.length > 0 && password !== confirmPassword) {
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

// Update the user profile in localStorage
function updateUserProfile(firstName, lastName, email, password, birthDate) {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Find the logged-in user by userId
  const userIndex = users.findIndex((user) => user.userId === loggedInUser.userId);

  if (userIndex !== -1) {
    // Update the details in the 'users' array
    users[userIndex].firstName = firstName;
    users[userIndex].lastName = lastName;
    users[userIndex].email = email;
    users[userIndex].birthDate = birthDate;
    if (password.length > 0) {
      users[userIndex].password = password; // Update password only if a new one is provided
    }

    // Save updated users list back to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Update the loggedInUser
    loggedInUser.firstName = firstName;
    loggedInUser.lastName = lastName;
    loggedInUser.email = email;
    loggedInUser.birthDate = birthDate;
    if (password.length > 0) {
      loggedInUser.password = password;
    }

    // Save the updated logged-in user to localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
  } else {
    alert('Error: Could not find the logged-in user in the users list.');
  }
}

// Show and clear error functions
function showError(elementClass, message) {
  document.querySelector(elementClass).innerText = message;
}

function clearError(elementClass) {
  document.querySelector(elementClass).innerText = '';
}

// Check if 60 minutes have passed since login
function checkSessionExpiry() {
  const loginTime = localStorage.getItem('loginTime');
  const currentTime = Date.now();

  const sessionDuration = 60 * 60 * 1000; // 60 minutes in milliseconds

  if (loginTime && currentTime - loginTime > sessionDuration) {
    alert('Session expired. You will be logged out.');
    logoutUser();
  }
}

// Logout the user and redirect to the login page
function logoutUser() {
  localStorage.setItem('loggedInUser', '{}');
  localStorage.setItem('loginTime', '{}');
  window.location.href = '../login/login.html'; // Redirect to login
}
