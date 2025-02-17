"use strict";

// IndexedDB setup for storing training tutorials
let db;
const request = indexedDB.open('trainingGuide', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const tutorialStore = db.createObjectStore('trainingTutorials', { keyPath: 'id', autoIncrement: true });
  tutorialStore.createIndex('moduleName', 'moduleName', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayTutorials();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Add training tutorial
function addTrainingTutorial(moduleName, content) {
  const transaction = db.transaction(['trainingTutorials'], 'readwrite');
  const store = transaction.objectStore('trainingTutorials');
  store.add({ moduleName, content });

  transaction.oncomplete = function() {
    displayTutorials();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Display training tutorials
function displayTutorials() {
  const transaction = db.transaction(['trainingTutorials'], 'readonly');
  const store = transaction.objectStore('trainingTutorials');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const tutorials = event.target.result;
    const tutorialContainer = document.getElementById('tutorialContainer');
    tutorialContainer.innerHTML = '';

    tutorials.forEach(tutorial => {
      const tutorialItem = document.createElement('div');
      tutorialItem.className = 'tutorial-item';
      tutorialItem.innerHTML = `
        <h3>${tutorial.moduleName}</h3>
        <p>${tutorial.content}</p>
        <button onclick="logTrainingSession('${tutorial.moduleName}')">Log Session</button>
        <button onclick="trackProgress('${tutorial.moduleName}')">Track Progress</button>
      `;
      tutorialContainer.appendChild(tutorialItem);
    });
  };
}

// Log successful training session
function logTrainingSession(moduleName) {
  const sessions = JSON.parse(localStorage.getItem('trainingSessions')) || [];
  sessions.push({ moduleName, date: new Date().toISOString() });
  localStorage.setItem('trainingSessions', JSON.stringify(sessions));
  alert('Training session logged successfully.');
}

// Track progress for each training module
function trackProgress(moduleName) {
  const progress = JSON.parse(localStorage.getItem('trainingProgress')) || {};
  progress[moduleName] = (progress[moduleName] || 0) + 1;
  localStorage.setItem('trainingProgress', JSON.stringify(progress));
  displayProgress();
}

// Display training progress
function displayProgress() {
  const progress = JSON.parse(localStorage.getItem('trainingProgress')) || {};
  const progressContainer = document.getElementById('progressContainer');
  progressContainer.innerHTML = '';

  for (const [module, count] of Object.entries(progress)) {
    const progressItem = document.createElement('div');
    progressItem.className = 'progress-item';
    progressItem.innerHTML = `<p>${module}: ${count} sessions</p>`;
    progressContainer.appendChild(progressItem);
  }
}

// Add event listeners for form submissions
document.getElementById('tutorialForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const moduleName = document.getElementById('moduleName').value;
  const content = document.getElementById('content').value;

  addTrainingTutorial(moduleName, content);
});

// Initialize display
window.onload = function() {
  displayTutorials();
  displayProgress();
};
