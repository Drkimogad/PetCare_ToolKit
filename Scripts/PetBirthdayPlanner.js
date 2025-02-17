"use strict";

// IndexedDB setup for storing event details
let db;
const request = indexedDB.open('PetBirthdayPlanner', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const eventStore = db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
  eventStore.createIndex('date', 'date', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayEvents();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Add new event
function addEvent(petName, date, guests, giftIdeas, photos) {
  const transaction = db.transaction(['events'], 'readwrite');
  const store = transaction.objectStore('events');
  store.add({ petName, date, guests, giftIdeas, photos });

  transaction.oncomplete = function() {
    displayEvents();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Display all events
function displayEvents() {
  const transaction = db.transaction(['events'], 'readonly');
  const store = transaction.objectStore('events');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const events = event.target.result;
    const eventContainer = document.getElementById('eventContainer');
    eventContainer.innerHTML = '';

    events.forEach(event => {
      const eventItem = document.createElement('div');
      eventItem.className = 'event-item';
      eventItem.innerHTML = `
        <h3>${event.petName}'s Birthday</h3>
        <p>Date: ${event.date}</p>
        <p>Guests: ${event.guests.join(', ')}</p>
        <p>Gift Ideas: ${event.giftIdeas.join(', ')}</p>
        <p>Photos: ${event.photos.join(', ')}</p>
      `;
      eventContainer.appendChild(eventItem);
    });
  };
}

// Set birthday reminders using localStorage
function setReminder(petName, date) {
  const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
  reminders.push({ petName, date });
  localStorage.setItem('reminders', JSON.stringify(reminders));
  displayReminders();
}

// Display birthday reminders
function displayReminders() {
  const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
  const reminderContainer = document.getElementById('reminderContainer');
  reminderContainer.innerHTML = '';

  reminders.forEach(reminder => {
    const reminderItem = document.createElement('div');
    reminderItem.className = 'reminder-item';
    reminderItem.innerHTML = `
      <h3>Reminder for ${reminder.petName}</h3>
      <p>Date: ${reminder.date}</p>
    `;
    reminderContainer.appendChild(reminderItem);
  });
}

// Add event listeners for form submissions
document.getElementById('eventForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const petName = document.getElementById('petName').value;
  const date = document.getElementById('date').value;
  const guests = document.getElementById('guests').value.split(',');
  const giftIdeas = document.getElementById('giftIdeas').value.split(',');
  const photos = document.getElementById('photos').value.split(',');

  addEvent(petName, date, guests, giftIdeas, photos);
});

document.getElementById('reminderForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const petName = document.getElementById('reminderPetName').value;
  const date = document.getElementById('reminderDate').value;

  setReminder(petName, date);
});

// Initialize display
window.onload = function() {
  displayEvents();
  displayReminders();
};
