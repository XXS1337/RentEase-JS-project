// Add window.onload to ensure user data is loaded before trying to render flats
window.onload = function () {
  if (!loadLoggedInUser()) {
    alert('No logged-in user found.');
    window.location = '../login/login.html';
  } else {
    displayFavoriteFlats(favoriteFlats);
    checkSessionExpiry(); // Check session expiry immediately when the page loads
    setInterval(checkSessionExpiry, 60 * 1000); // * Check every second (- change to 60*1000 for final - Check every minute)
  }
};

// Retrieve the logged-in user from localStorage
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};

// Retrieves the logged-in user data and checks if he exists
function loadLoggedInUser() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  return loggedInUser && Object.keys(loggedInUser).length > 0; // Check if user exists
}

// Logout button event listener
document.querySelector('.navbarLogout').addEventListener('click', function () {
  localStorage.setItem('loggedInUser', '{}');
  localStorage.setItem('loginTime', '{}');
  alert('You have been logged out.');
  window.location = '../login/login.html';
});

// Greeting message
let navbarGreeting = document.querySelector('.navbarGreeting');
if (loggedInUser.firstName && loggedInUser.lastName) {
  navbarGreeting.innerHTML = `Hello, ${loggedInUser.firstName} ${loggedInUser.lastName}`;
}

// Create the array with favorite flats
let favoriteFlats = loggedInUser.flats ? loggedInUser.flats.filter((flat) => flat.favorite === true) : [];

// Function to remove flat from favorites
function removeFromFavorites(flatId) {
  // Convert flatId to number for comparison
  flatId = Number(flatId);

  // Find the flat in the logged-in user's flats list and set favorite to false
  loggedInUser.flats.forEach((flat) => {
    if (flat.flatId === flatId) {
      flat.favorite = false; // Unmark it as a favorite
    }
  });

  // Retrieve users array from localStorage
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex((user) => user.userId === loggedInUser.userId); // Use userId for matching

  if (userIndex !== -1) {
    // Update the flats for the correct user
    users[userIndex].flats = loggedInUser.flats;
    localStorage.setItem('users', JSON.stringify(users)); // Save updated users array
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser)); // Update loggedInUser
  }

  // Re-filter the favorite flats and re-render them
  favoriteFlats = loggedInUser.flats.filter((flat) => flat.favorite === true);
  displayFavoriteFlats(favoriteFlats);
}

// Function to create the HTML for each flat and append it to the container
function displayFavoriteFlats(favoriteFlats) {
  const favoriteFlatsContainer = document.querySelector('.favoriteFlatsContainer');
  favoriteFlatsContainer.innerHTML = ''; // Clear content

  favoriteFlats.forEach((flat) => {
    const flatDiv = document.createElement('div');
    flatDiv.classList.add('favoriteFlatsMainDiv', 'flex');

    // Create flats in HTML
    flatDiv.innerHTML = `
      <div class="favoriteFlatsDiv">
        <div class="flatPictureDiv">
          <img class="flatPicture" src="${flat.imagePath}" alt="${flat.adTitle}">
        </div>
        <div class="flatDetailsDiv">
          <h3>${flat.adTitle}</h3>
          <p>City: ${flat.city}</p>
          <p>Street name: ${flat.streetName}</p>
          <p>Street number: ${flat.streetNumber}</p>
          <p>Area size (m²): ${flat.areaSize}</p>
          <p>Has AC?: ${flat.hasAC ? 'Yes' : 'No'}</p>
          <p>Year built: ${flat.yearBuilt}</p>
          <p>Rent price (€/month): ${flat.rentPrice}</p>
          <p>Date available: ${new Date(flat.dateAvailable).toLocaleDateString()}</p>
          <button class="removeButton" removeButtonFlatId="${flat.flatId}">Remove favorite</button>
        </div>
      </div>
    `;

    favoriteFlatsContainer.appendChild(flatDiv);
  });

  // Add event listeners to all remove buttons
  document.querySelectorAll('.removeButton').forEach((button) => {
    button.addEventListener('click', (e) => {
      const flatId = e.target.getAttribute('removeButtonFlatId');
      removeFromFavorites(flatId); // Call the remove function when clicked
    });
  });
}

// Check if the session has expired
function checkSessionExpiry() {
  const loginTime = localStorage.getItem('loginTime');
  const currentTime = Date.now();

  // 60 minutes in milliseconds
  const sessionDuration = 60 * 60 * 1000; // * 3000 for testing, in final change to 60 * 60 * 1000

  if (loginTime && currentTime - loginTime > sessionDuration) {
    alert('Session expired. You will be logged out.');
    logoutUser();
  }
}

// Logout the user and redirect to the login page
function logoutUser() {
  localStorage.setItem('loggedInUser', '{}');
  localStorage.setItem('loginTime', '{}');
  localStorage.removeItem('loginTime');
  window.location.href = '../login/login.html'; // Redirect to login page
}
