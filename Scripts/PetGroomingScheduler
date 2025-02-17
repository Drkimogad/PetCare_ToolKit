"use strict";

// IndexedDB setup for grooming schedules
let db;
const request = indexedDB.open('PetGroomingScheduler', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const store = db.createObjectStore('groomingSchedules', { keyPath: 'id', autoIncrement: true });
  store.createIndex('petName', 'petName', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displaySchedules();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Add grooming schedule
function addGroomingSchedule(petName, groomingType, date, notes) {
  const transaction = db.transaction(['groomingSchedules'], 'readwrite');
  const store = transaction.objectStore('groomingSchedules');
  store.add({ petName, groomingType, date, notes });

  transaction.oncomplete = function() {
    displaySchedules();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Display grooming schedules
function displaySchedules() {
  const transaction = db.transaction(['groomingSchedules'], 'readonly');
  const store = transaction.objectStore('groomingSchedules');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const schedules = event.target.result;
    const scheduleContainer = document.getElementById('scheduleContainer');
    scheduleContainer.innerHTML = '';

    schedules.forEach(schedule => {
      const scheduleItem = document.createElement('div');
      scheduleItem.className = 'schedule-item';
      scheduleItem.innerHTML = `
        <h3>${schedule.petName}</h3>
        <p>Type: ${schedule.groomingType}</p>
        <p>Date: ${schedule.date}</p>
        <p>Notes: ${schedule.notes}</p>
      `;
      scheduleContainer.appendChild(scheduleItem);
    });
  };
}

// Set reminder for grooming tasks using localStorage
function setReminder(petName, groomingType, date) {
  const reminders = JSON.parse(localStorage.getItem('groomingReminders')) || [];
  reminders.push({ petName, groomingType, date });
  localStorage.setItem('groomingReminders', JSON.stringify(reminders));
}

// Display reminders
function displayReminders() {
  const reminders = JSON.parse(localStorage.getItem('groomingReminders')) || [];
  const reminderContainer = document.getElementById('reminderContainer');
  reminderContainer.innerHTML = '';

  reminders.forEach(reminder => {
    const reminderItem = document.createElement('div');
    reminderItem.className = 'reminder-item';
    reminderItem.innerHTML = `
      <h3>${reminder.petName}</h3>
      <p>Type: ${reminder.groomingType}</p>
      <p>Date: ${reminder.date}</p>
    `;
    reminderContainer.appendChild(reminderItem);
  });
}

// Add event listeners for form submissions
document.getElementById('groomingForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const petName = document.getElementById('petName').value;
  const groomingType = document.getElementById('groomingType').value;
  const date = document.getElementById('groomingDate').value;
  const notes = document.getElementById('groomingNotes').value;

  addGroomingSchedule(petName, groomingType, date, notes);
  setReminder(petName, groomingType, date);
});

document.getElementById('reminderForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const petName = document.getElementById('reminderPetName').value;
  const groomingType = document.getElementById('reminderGroomingType').value;
  const date = document.getElementById('reminderDate').value;

  setReminder(petName, groomingType, date);
  displayReminders();
});

// Initialize display
window.onload = function() {
  displaySchedules();
  displayReminders();
};
