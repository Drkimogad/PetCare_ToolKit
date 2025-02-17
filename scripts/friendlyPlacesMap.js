"use strict";

// IndexedDB setup for storing location data
let db;
const request = indexedDB.open('friendlyPlacesMap', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const placeStore = db.createObjectStore('places', { keyPath: 'id', autoIncrement: true });
  placeStore.createIndex('type', 'type', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayPlaces();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Add new place
function addPlace(name, type, notes, latitude, longitude) {
  const transaction = db.transaction(['places'], 'readwrite');
  const store = transaction.objectStore('places');
  store.add({ name, type, notes, latitude, longitude });

  transaction.oncomplete = function() {
    displayPlaces();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Display all places
function displayPlaces() {
  const transaction = db.transaction(['places'], 'readonly');
  const store = transaction.objectStore('places');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const places = event.target.result;
    const placeContainer = document.getElementById('placeContainer');
    placeContainer.innerHTML = '';

    places.forEach(place => {
      const placeItem = document.createElement('div');
      placeItem.className = 'place-item';
      placeItem.innerHTML = `
        <h3>${place.name}</h3>
        <p>Type: ${place.type}</p>
        <p>Notes: ${place.notes}</p>
        <p>Location: (${place.latitude}, ${place.longitude})</p>
        <button onclick="saveFavorite(${place.id})">Save as Favorite</button>
      `;
      placeContainer.appendChild(placeItem);
    });
  };
}

// Save favorite place using localStorage
function saveFavorite(placeId) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(placeId)) {
    favorites.push(placeId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Place saved as favorite.');
  } else {
    alert('Place is already in favorites.');
  }
}

// Filter places by type
function filterPlaces(type) {
  const transaction = db.transaction(['places'], 'readonly');
  const store = transaction.objectStore('places');
  const index = store.index('type');
  const request = index.getAll(type);

  request.onsuccess = function(event) {
    const places = event.target.result;
    const placeContainer = document.getElementById('placeContainer');
    placeContainer.innerHTML = '';

    places.forEach(place => {
      const placeItem = document.createElement('div');
      placeItem.className = 'place-item';
      placeItem.innerHTML = `
        <h3>${place.name}</h3>
        <p>Type: ${place.type}</p>
        <p>Notes: ${place.notes}</p>
        <p>Location: (${place.latitude}, ${place.longitude})</p>
        <button onclick="saveFavorite(${place.id})">Save as Favorite</button>
      `;
      placeContainer.appendChild(placeItem);
    });
  };
}

// Add event listeners for form submissions
document.getElementById('placeForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const type = document.getElementById('type').value;
  const notes = document.getElementById('notes').value;
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);

  addPlace(name, type, notes, latitude, longitude);
});

document.getElementById('filterForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const type = document.getElementById('filterType').value;
  
  filterPlaces(type);
});

// Initialize display
window.onload = function() {
  displayPlaces();
};
