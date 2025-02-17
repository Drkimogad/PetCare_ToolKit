"use strict";

// IndexedDB setup for storing detailed first aid guides
let db;
const request = indexedDB.open('firstAidGuide', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const guideStore = db.createObjectStore('firstAidGuides', { keyPath: 'id', autoIncrement: true });
  guideStore.createIndex('emergencyType', 'emergencyType', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayGuides();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Add first aid guide
function addFirstAidGuide(emergencyType, instructions) {
  const transaction = db.transaction(['firstAidGuides'], 'readwrite');
  const store = transaction.objectStore('firstAidGuides');
  store.add({ emergencyType, instructions });

  transaction.oncomplete = function() {
    displayGuides();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Display first aid guides
function displayGuides() {
  const transaction = db.transaction(['firstAidGuides'], 'readonly');
  const store = transaction.objectStore('firstAidGuides');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const guides = event.target.result;
    const guideContainer = document.getElementById('guideContainer');
    guideContainer.innerHTML = '';

    guides.forEach(guide => {
      const guideItem = document.createElement('div');
      guideItem.className = 'guide-item';
      guideItem.innerHTML = `
        <h3>${guide.emergencyType}</h3>
        <p>${guide.instructions}</p>
      `;
      guideContainer.appendChild(guideItem);
    });
  };
}

// Store pet-specific first aid notes using localStorage
function addFirstAidNote(petName, note) {
  const notes = JSON.parse(localStorage.getItem('firstAidNotes')) || [];
  notes.push({ petName, note });
  localStorage.setItem('firstAidNotes', JSON.stringify(notes));
  displayNotes();
}

// Display pet-specific first aid notes
function displayNotes() {
  const notes = JSON.parse(localStorage.getItem('firstAidNotes')) || [];
  const noteContainer = document.getElementById('noteContainer');
  noteContainer.innerHTML = '';

  notes.forEach(note => {
    const noteItem = document.createElement('div');
    noteItem.className = 'note-item';
    noteItem.innerHTML = `
      <h3>${note.petName}</h3>
      <p>${note.note}</p>
    `;
    noteContainer.appendChild(noteItem);
  });
}

// Store vet contact information using localStorage
function setVetContact(contactInfo) {
  localStorage.setItem('vetContact', JSON.stringify(contactInfo));
  displayVetContact();
}

// Display vet contact information
function displayVetContact() {
  const contactInfo = JSON.parse(localStorage.getItem('vetContact')) || {};
  const contactContainer = document.getElementById('contactContainer');
  contactContainer.innerHTML = `
    <h3>Vet Contact Information</h3>
    <p>Name: ${contactInfo.name}</p>
    <p>Phone: ${contactInfo.phone}</p>
    <p>Address: ${contactInfo.address}</p>
  `;
}

// Add event listeners for form submissions
document.getElementById('guideForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const emergencyType = document.getElementById('emergencyType').value;
  const instructions = document.getElementById('instructions').value;

  addFirstAidGuide(emergencyType, instructions);
});

document.getElementById('noteForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const petName = document.getElementById('petName').value;
  const note = document.getElementById('note').value;

  addFirstAidNote(petName, note);
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const contactInfo = {
    name: document.getElementById('vetName').value,
    phone: document.getElementById('vetPhone').value,
    address: document.getElementById('vetAddress').value
  };

  setVetContact(contactInfo);
});

// Initialize display
window.onload = function() {
  displayGuides();
  displayNotes();
  displayVetContact();
};
