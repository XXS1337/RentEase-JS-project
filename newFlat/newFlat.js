window.onload = function () {
  // Check if the user is logged in
  if (!loadLoggedInUser()) {
    alert('No logged-in user found.');
    window.location = '../login/login.html';
  } else {
    // Start checking for session expiry
    checkSessionExpiry(); // Check session expiry immediately when the page loads
    setInterval(checkSessionExpiry, 60 * 1000); // Check every minute
  }

  // Add validation event listeners to each field
  document.querySelector('.flatAdTitle').addEventListener('blur', validateFlatAdTitle);
  document.querySelector('.flatCity').addEventListener('blur', validateFlatCity);
  document.querySelector('.flatStreetName').addEventListener('blur', validateFlatStreetName);
  document.querySelector('.flatStreetNumber').addEventListener('blur', validateFlatStreetNumber);
  document.querySelector('.flatAreaSize').addEventListener('blur', validateFlatAreaSize);
  document.querySelector('.flatYearBuilt').addEventListener('blur', validateFlatYearBuilt);
  document.querySelector('.flatRentPrice').addEventListener('blur', validateFlatRentPrice);
  document.querySelector('.flatDateAvailable').addEventListener('blur', validateFlatDateAvailable);
  document.querySelector('.flatImage').addEventListener('change', validateFlatImage);
};

// Greeting message
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
let navbarGreeting = document.querySelector('.navbarGreeting');
navbarGreeting.innerHTML = `Hello, ${loggedInUser.firstName} ${loggedInUser.lastName}`;

// Logout button event listener
document.querySelector('.navbarLogout').addEventListener('click', function () {
  localStorage.setItem('loggedInUser', '{}');
  localStorage.setItem('loginTime', '{}');
  alert('You have been logged out.');
  window.location = '../login/login.html';
});

// Button hover effects
let submitButton = document.querySelector('.submitButton');
submitButton.addEventListener('mouseover', () => {
  submitButton.classList.add('submitButtonHoverEffects');
});
submitButton.addEventListener('mouseout', () => {
  submitButton.classList.remove('submitButtonHoverEffects');
});

// Form submission:
document.querySelector('.newFlatForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const flatId = Date.now();

  // Validate the image first - without this it wont show the error in Select picture of the flat
  if (!validateFlatImage()) {
    return; // Stop form submission if the image validation fails
  }

  // Capture the image path and filename
  const flatImageInput = document.querySelector('.flatImage');
  const flatImagePath = `../images/flats/${flatImageInput.files[0].name}`; //Get the first and only file complete and correct path

  const newFlat = {
    flatId: flatId,
    adTitle: document.querySelector('.flatAdTitle').value.trim(),
    city: document.querySelector('.flatCity').value.trim(),
    streetName: document.querySelector('.flatStreetName').value.trim(),
    streetNumber: document.querySelector('.flatStreetNumber').value.trim(),
    areaSize: document.querySelector('.flatAreaSize').value.trim(),
    hasAC: document.querySelector('.flatAC').checked,
    yearBuilt: document.querySelector('.flatYearBuilt').value.trim(),
    rentPrice: document.querySelector('.flatRentPrice').value.trim(),
    dateAvailable: new Date(document.querySelector('.flatDateAvailable').value), // Date format
    imagePath: flatImagePath, // Add image path to new flat data
    favorite: true, // Automatically set as favorite flat
  };

  // Validate the form before submission
  const isValid = validateFlatForm(newFlat);
  if (isValid) {
    addFlatToUser(newFlat);
    alert('New flat added successfully.');
    window.location.reload();
  }
});

// Retrieves the logged-in user data and checks if they exist
function loadLoggedInUser() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  return loggedInUser && Object.keys(loggedInUser).length > 0; // Check if user exists
}

// Form validation and all fields validation
function validateFlatForm(flat) {
  let isValid = true;
  if (!validateFlatAdTitle()) isValid = false;
  if (!validateFlatCity()) isValid = false;
  if (!validateFlatStreetName()) isValid = false;
  if (!validateFlatStreetNumber()) isValid = false;
  if (!validateFlatAreaSize()) isValid = false;
  if (!validateFlatYearBuilt()) isValid = false;
  if (!validateFlatRentPrice()) isValid = false;
  if (!validateFlatDateAvailable()) isValid = false;
  if (!validateFlatImage()) isValid = false;

  return isValid;
}

function validateFlatAdTitle() {
  const adTitle = document.querySelector('.flatAdTitle').value.trim();
  if (adTitle.length < 5 || adTitle.length > 60) {
    showError('.flatAdTitleError', 'Ad title must be between 5 and 60 characters.');
    return false;
  } else {
    clearError('.flatAdTitleError');
    return true;
  }
}

function validateFlatCity() {
  const city = document.querySelector('.flatCity').value.trim();
  if (city.length < 1) {
    showError('.flatCityError', 'City is required.');
    return false;
  } else {
    clearError('.flatCityError');
    return true;
  }
}

function validateFlatStreetName() {
  const streetName = document.querySelector('.flatStreetName').value.trim();
  if (streetName.length < 1) {
    showError('.flatStreetNameError', 'Street name is required.');
    return false;
  } else {
    clearError('.flatStreetNameError');
    return true;
  }
}

function validateFlatStreetNumber() {
  const streetNumber = document.querySelector('.flatStreetNumber').value.trim();
  if (streetNumber.length < 1) {
    showError('.flatStreetNumberError', 'Street number is required.');
    return false;
  } else {
    clearError('.flatStreetNumberError');
    return true;
  }
}

function validateFlatAreaSize() {
  const areaSize = document.querySelector('.flatAreaSize').value.trim();
  if (!areaSize || isNaN(areaSize) || areaSize <= 0) {
    showError('.flatAreaSizeError', 'Please enter a valid area size in m²');
    return false;
  } else {
    clearError('.flatAreaSizeError');
    return true;
  }
}

function validateFlatYearBuilt() {
  const yearBuilt = document.querySelector('.flatYearBuilt').value.trim();
  const currentYear = new Date().getFullYear();
  if (!yearBuilt || isNaN(yearBuilt) || yearBuilt < 1900 || yearBuilt > currentYear) {
    showError('.flatYearBuiltError', 'Please enter a valid year (between 1900 and current year).');
    return false;
  } else {
    clearError('.flatYearBuiltError');
    return true;
  }
}

function validateFlatRentPrice() {
  const rentPrice = document.querySelector('.flatRentPrice').value.trim();
  if (!rentPrice || isNaN(rentPrice) || rentPrice <= 0) {
    showError('.flatRentPriceError', 'Please enter a valid rent price.');
    return false;
  } else {
    clearError('.flatRentPriceError');
    return true;
  }
}

function validateFlatDateAvailable() {
  const dateAvailableInput = document.querySelector('.flatDateAvailable');
  const dateAvailable = dateAvailableInput.value;

  // Get today's date and reset the time to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0); //without it will show error if I select today.

  // Calculate one year after today
  const oneYearAfter = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

  // Convert the selected date to a Date object and set time to midnight - in order to compare only the date part
  const selectedDate = new Date(dateAvailable);
  selectedDate.setHours(0, 0, 0, 0);

  // For debugging purposes
  // console.log(selectedDate);
  // console.log(today);

  if (!dateAvailable) {
    showError('.flatDateAvailableError', 'Date must be today or within one year from today.');
    return false;
  } else if (selectedDate < today || selectedDate > oneYearAfter) {
    showError('.flatDateAvailableError', 'Date must be today or within one year from today.');
    return false;
  } else {
    clearError('.flatDateAvailableError');
    return true;
  }
}

function validateFlatImage() {
  const flatImageInput = document.querySelector('.flatImage');

  // Check if no file has been selected
  if (flatImageInput.files.length === 0) {
    showError('.flatImageError', 'You must select a picture of the flat.');
    return false;
  } else {
    clearError('.flatImageError');
    return true;
  }
}

// Function to add flat
function addFlatToUser(newFlat) {
  // Get the user data from local storage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Find the logged-in user in the users array based on userId
  const userIndex = users.findIndex((user) => user.userId === loggedInUser.userId);

  // Check to see if we have the correct users - debugging purposes
  // console.log('Logged In User:', loggedInUser);
  // console.log('User Index:', userIndex);
  // console.log('Users Array:', users);

  // Ensure the flats array exists for the user
  users[userIndex].flats = users[userIndex].flats || [];

  // Add the new flat to the user's flats array
  users[userIndex].flats.push(newFlat);

  // Update the loggedInUser's flats as well (to keep in sync with users)
  loggedInUser.flats = loggedInUser.flats || [];
  loggedInUser.flats.push(newFlat);

  // Save updates in localStorage
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
}

// Show and clear error functions
function showError(elementClass, message) {
  document.querySelector(elementClass).innerText = message;
}

function clearError(elementClass) {
  document.querySelector(elementClass).innerText = '';
}

// Check if the session has expired
function checkSessionExpiry() {
  const loginTime = localStorage.getItem('loginTime');
  const currentTime = Date.now();

  // 60 minutes in milliseconds
  const sessionDuration = 60 * 60 * 1000;

  if (loginTime && currentTime - loginTime > sessionDuration) {
    alert('Session expired. You will be logged out.');
    logoutUser();
  }
}

// Logout the user and redirect to the login page
function logoutUser() {
  localStorage.setItem('loggedInUser', '{}');
  localStorage.setItem('loginTime', '{}');
  window.location.href = '../login/login.html'; // Redirect to login page
}
