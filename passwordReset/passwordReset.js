// When the window is loaded, add blur event listener to the email input field
window.onload = function () {
  document.querySelector('.email').addEventListener('blur', validateEmailField);
};

// Button hover effect
let submitButton = document.querySelector('.submitButton');

submitButton.addEventListener('mouseover', () => {
  submitButton.classList.add('submitButtonHoverEffects');
});

submitButton.addEventListener('mouseout', () => {
  submitButton.classList.remove('submitButtonHoverEffects');
});

// Reset Form submission:
document.querySelector('.resetForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.querySelector('.email').value.trim();
  const isValid = validateForm(email);

  if (isValid) {
    const resetSuccess = resetPassword(email);
    if (resetSuccess) {
      alert('Password reset successful. You will be redirected to the register page.');
      window.location = '../register/register.html';
    } else {
      alert('Credentials are wrong. Redirecting to register page.');
      window.location = '../register/register.html';
    }
  }
});

// Email and password validation
function validateForm(email) {
  let isValid = true;
  if (!validateEmailField()) isValid = false;
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

// Reset user email (delete user) based on its email address
function resetPassword(email) {
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const userIndex = users.findIndex((user) => user.email === email);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    localStorage.setItem('users', JSON.stringify(users));
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
