"use strict";

// IndexedDB setup for storing weight logs
let db;
const request = indexedDB.open('weightMonitor', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const weightStore = db.createObjectStore('weightLogs', { keyPath: 'id', autoIncrement: true });
  weightStore.createIndex('petName', 'petName', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayWeightLogs();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Add weight log
function addWeightLog(petName, weight, date) {
  const transaction = db.transaction(['weightLogs'], 'readwrite');
  const store = transaction.objectStore('weightLogs');
  store.add({ petName, weight, date });

  transaction.oncomplete = function() {
    displayWeightLogs();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Display weight logs
function displayWeightLogs() {
  const transaction = db.transaction(['weightLogs'], 'readonly');
  const store = transaction.objectStore('weightLogs');
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
        <p>Weight: ${log.weight}</p>
        <p>Date: ${log.date}</p>
      `;
      logContainer.appendChild(logItem);
    });

    visualizeWeightTrends(logs);
  };
}

// Visualize weight trends with charts
function visualizeWeightTrends(logs) {
  const ctx = document.getElementById('weightChart').getContext('2d');
  const labels = logs.map(log => log.date);
  const data = logs.map(log => log.weight);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Weight',
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Set weight goals and reminders using localStorage
function setWeightGoal(petName, goalWeight, reminderDate) {
  const goals = JSON.parse(localStorage.getItem('weightGoals')) || [];
  goals.push({ petName, goalWeight, reminderDate });
  localStorage.setItem('weightGoals', JSON.stringify(goals));
  displayGoals();
}

// Display weight goals and reminders
function displayGoals() {
  const goals = JSON.parse(localStorage.getItem('weightGoals')) || [];
  const goalContainer = document.getElementById('goalContainer');
  goalContainer.innerHTML = '';

  goals.forEach(goal => {
    const goalItem = document.createElement('div');
    goalItem.className = 'goal-item';
    goalItem.innerHTML = `
      <h3>${goal.petName}</h3>
      <p>Goal Weight: ${goal.goalWeight}</p>
      <p>Reminder Date: ${goal.reminderDate}</p>
    `;
    goalContainer.appendChild(goalItem);
  });
}

// Add event listeners for form submissions
document.getElementById('logForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const petName = document.getElementById('petName').value;
  const weight = document.getElementById('weight').value;
  const date = document.getElementById('date').value;

  addWeightLog(petName, weight, date);
});

document.getElementById('goalForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const petName = document.getElementById('goalPetName').value;
  const goalWeight = document.getElementById('goalWeight').value;
  const reminderDate = document.getElementById('reminderDate').value;

  setWeightGoal(petName, goalWeight, reminderDate);
});

// Initialize display
window.onload = function() {
  displayWeightLogs();
  displayGoals();
};
