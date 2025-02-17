"use strict";

// IndexedDB setup for storing profiles and media
let db;
const request = indexedDB.open('petSocialNetwork', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const profileStore = db.createObjectStore('profiles', { keyPath: 'id', autoIncrement: true });
  const mediaStore = db.createObjectStore('media', { keyPath: 'id', autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayProfiles();
  displayMedia();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Add new profile
function addProfile(name, type, age) {
  const transaction = db.transaction(['profiles'], 'readwrite');
  const store = transaction.objectStore('profiles');
  store.add({ name, type, age });

  transaction.oncomplete = function() {
    displayProfiles();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Display all profiles
function displayProfiles() {
  const transaction = db.transaction(['profiles'], 'readonly');
  const store = transaction.objectStore('profiles');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const profiles = event.target.result;
    const profileContainer = document.getElementById('profileContainer');
    profileContainer.innerHTML = '';

    profiles.forEach(profile => {
      const profileItem = document.createElement('div');
      profileItem.className = 'profile-item';
      profileItem.innerHTML = `
        <h3>${profile.name}</h3>
        <p>Type: ${profile.type}</p>
        <p>Age: ${profile.age}</p>
      `;
      profileContainer.appendChild(profileItem);
    });
  };
}

// Add new media
function addMedia(profileId, type, content) {
  const transaction = db.transaction(['media'], 'readwrite');
  const store = transaction.objectStore('media');
  store.add({ profileId, type, content });

  transaction.oncomplete = function() {
    displayMedia();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Display all media
function displayMedia() {
  const transaction = db.transaction(['media'], 'readonly');
  const store = transaction.objectStore('media');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const media = event.target.result;
    const mediaContainer = document.getElementById('mediaContainer');
    mediaContainer.innerHTML = '';

    media.forEach(item => {
      const mediaItem = document.createElement('div');
      mediaItem.className = 'media-item';
      mediaItem.innerHTML = `
        <p>Profile ID: ${item.profileId}</p>
        <p>Type: ${item.type}</p>
        <p>Content: ${item.content}</p>
      `;
      mediaContainer.appendChild(mediaItem);
    });
  };
}

// Add event listeners for form submissions
document.getElementById('profileForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const type = document.getElementById('type').value;
  const age = document.getElementById('age').value;

  addProfile(name, type, age);
});

document.getElementById('mediaForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const profileId = document.getElementById('profileId').value;
  const type = document.getElementById('mediaType').value;
  const content = document.getElementById('content').value;

  addMedia(profileId, type, content);
});

// Initialize display
window.onload = function() {
  displayProfiles();
  displayMedia();
};
