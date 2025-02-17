"use strict";

// IndexedDB setup for behavior logs
let db;
const request = indexedDB.open('PetBehaviorTracker', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const store = db.createObjectStore('behaviorLogs', { keyPath: 'id', autoIncrement: true });
  store.createIndex('petName', 'petName', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayLogs();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Add behavior log
function addBehaviorLog(petName, behaviorType, date, triggers, notes) {
  const transaction = db.transaction(['behaviorLogs'], 'readwrite');
  const store = transaction.objectStore('behaviorLogs');
  store.add({ petName, behaviorType, date, triggers, notes });

  transaction.oncomplete = function() {
    displayLogs();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Display behavior logs
function displayLogs() {
  const transaction = db.transaction(['behaviorLogs'], 'readonly');
  const store = transaction.objectStore('behaviorLogs');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const logs = event.target.result;
    const logContainer = document.getElementById('logContainer');
    logContainer.innerHTML = '';

    logs.forEach(log => {
      const logItem = document.createElement('div');
      logItem.className = 'log-item';
      logItem.innerHTML = `
        <h3>${log.petName}</h3>
        <p>Behavior: ${log.behaviorType}</p>
        <p>Date: ${log.date}</p>
        <p>Triggers: ${log.triggers}</p>
        <p>Notes: ${log.notes}</p>
      `;
      logContainer.appendChild(logItem);
    });
  };
}

// Set user settings using localStorage
function setUserSettings(settings) {
  localStorage.setItem('userSettings', JSON.stringify(settings));
}

// Get user settings from localStorage
function getUserSettings() {
  return JSON.parse(localStorage.getItem('userSettings')) || {};
}

// Add event listeners for form submissions
document.getElementById('behaviorForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const petName = document.getElementById('petName').value;
  const behaviorType = document.getElementById('behaviorType').value;
  const date = document.getElementById('behaviorDate').value;
  const triggers = document.getElementById('behaviorTriggers').value;
  const notes = document.getElementById('behaviorNotes').value;

  addBehaviorLog(petName, behaviorType, date, triggers, notes);
});

document.getElementById('settingsForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const settings = {
    reminderFrequency: document.getElementById('reminderFrequency').value,
    darkMode: document.getElementById('darkMode').checked
  };

  setUserSettings(settings);
  applyUserSettings();
});

// Apply user settings
function applyUserSettings() {
  const settings = getUserSettings();
  if (settings.darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Initialize display
window.onload = function() {
  displayLogs();
  applyUserSettings();
};
