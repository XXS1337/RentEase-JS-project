// Initialize the page with all logged in users flats
window.onload = function () {
  if (!loadLoggedInUser()) {
    alert('No logged-in user found.');
    window.location = '../login/login.html';
  } else {
    displayFlats(loggedInUser.flats);
    checkSessionExpiry(); // Check session expiry immediately when the page loads
    setInterval(checkSessionExpiry, 60 * 1000); // Check every minute
  }
};

// Retrieve the logged-in user from localStorage
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
let users = JSON.parse(localStorage.getItem('users')) || [];

// Retrieves the logged-in user data and checks if he exists
function loadLoggedInUser() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  return loggedInUser && Object.keys(loggedInUser).length > 0;
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

// Function to display flats in the sortedFlatsContainer
function displayFlats(flats) {
  const sortedFlatsContainer = document.querySelector('.sortedFlatsContainer');
  sortedFlatsContainer.innerHTML = ''; // Clear content

  flats.forEach((flat) => {
    const flatDiv = document.createElement('div');
    flatDiv.classList.add('sortedFlatsDiv', 'flex');

    // Create flats in HTML
    flatDiv.innerHTML = `
      <div class="sortedFlatsDiv">
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
          <button class="toggleFavoriteButton" toggleFavoriteFlatId="${flat.flatId}">
            ${flat.favorite ? 'Unmark Favorite' : 'Mark as Favorite'}
          </button>
          <button class="deleteFlatButton" deleteFlatId="${flat.flatId}">Delete</button>
        </div>
      </div>
    `;

    sortedFlatsContainer.appendChild(flatDiv);
  });

  // Add event listeners to toggle favorite buttons
  document.querySelectorAll('.toggleFavoriteButton').forEach((button) => {
    button.addEventListener('click', (e) => {
      const flatId = e.target.getAttribute('toggleFavoriteFlatId');
      toggleFavorite(flatId); // Toggle favorite status when clicked
    });
  });

  // Add event listeners to delete flat buttons
  document.querySelectorAll('.deleteFlatButton').forEach((button) => {
    button.addEventListener('click', (e) => {
      const flatId = e.target.getAttribute('deleteFlatId');
      deleteFlat(flatId); // Delete the flat when clicked
    });
  });
}

// Filter flats based on user input
function filterFlats() {
  const cityInput = document.querySelector('.filterCityInput').value.trim().toLowerCase();
  const minPrice = parseFloat(document.querySelector('.filterMinPrice').value) || 0;
  const maxPrice = parseFloat(document.querySelector('.filterMaxPrice').value) || Infinity;
  const minArea = parseFloat(document.querySelector('.filterMinArea').value) || 0;
  const maxArea = parseFloat(document.querySelector('.filterMaxArea').value) || Infinity;

  let filteredFlats = loggedInUser.flats.filter((flat) => {
    const matchesCity = flat.city.toLowerCase().includes(cityInput);
    const matchesPrice = flat.rentPrice >= minPrice && flat.rentPrice <= maxPrice;
    const matchesArea = flat.areaSize >= minArea && flat.areaSize <= maxArea;

    return matchesCity && matchesPrice && matchesArea;
  });

  sortFlats(filteredFlats); // Apply sorting after filtering
}

// Reset filters
function resetFilters() {
  document.querySelector('.filterCityInput').value = '';
  document.querySelector('.filterMinPrice').value = '';
  document.querySelector('.filterMaxPrice').value = '';
  document.querySelector('.filterMinArea').value = '';
  document.querySelector('.filterMaxArea').value = '';

  displayFlats(loggedInUser.flats); // Display all flats again
}

// Sort flats based on the selected criteria
function sortFlats(flats) {
  const sortOption = document.querySelector('.sortOptions').value;

  flats.sort((a, b) => {
    if (sortOption === 'cityAsc') return a.city.localeCompare(b.city); // To compare strings
    if (sortOption === 'cityDesc') return b.city.localeCompare(a.city);
    if (sortOption === 'priceAsc') return a.rentPrice - b.rentPrice; // To compare numbers
    if (sortOption === 'priceDesc') return b.rentPrice - a.rentPrice;
    if (sortOption === 'areaAsc') return a.areaSize - b.areaSize;
    if (sortOption === 'areaDesc') return b.areaSize - a.areaSize;
  });

  displayFlats(flats); // Display sorted flats
}

// Toggle favorite status for a flat
function toggleFavorite(flatId) {
  flatId = Number(flatId);

  // Find and update the flat in the logged-in user's flats
  loggedInUser.flats.forEach((flat) => {
    if (flat.flatId === flatId) {
      flat.favorite = !flat.favorite;
    }
  });

  // Update the flat in the global users array
  const userIndex = users.findIndex((user) => user.userId === loggedInUser.userId);
  if (userIndex !== -1) {
    users[userIndex].flats = loggedInUser.flats;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
  }

  filterFlats(); // Re-filter and display flats with updated favorite status
}

// Delete a flat
function deleteFlat(flatId) {
  flatId = Number(flatId);

  // Remove the flat from the logged-in user's flats
  loggedInUser.flats = loggedInUser.flats.filter((flat) => flat.flatId !== flatId);

  // Find and update the user in the global users array
  const userIndex = users.findIndex((user) => user.userId === loggedInUser.userId);
  if (userIndex !== -1) {
    users[userIndex].flats = loggedInUser.flats;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
  }

  filterFlats(); // Re-filter and display flats after deletion
}

// Event listeners for filter and reset buttons
document.querySelector('.filterButton').addEventListener('click', filterFlats);
document.querySelector('.resetFilterButton').addEventListener('click', resetFilters);

// Event listener for sort options
document.querySelector('.sortOptions').addEventListener('change', filterFlats);

// Button hover effects
let filterButton = document.querySelector('.filterButton');
filterButton.addEventListener('mouseover', () => {
  filterButton.classList.add('buttonHoverEffects');
});
filterButton.addEventListener('mouseout', () => {
  filterButton.classList.remove('buttonHoverEffects');
});

let resetFilterButton = document.querySelector('.resetFilterButton');
resetFilterButton.addEventListener('mouseover', () => {
  resetFilterButton.classList.add('buttonHoverEffects');
});
resetFilterButton.addEventListener('mouseout', () => {
  resetFilterButton.classList.remove('buttonHoverEffects');
});

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
