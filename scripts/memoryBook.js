"use strict";

// IndexedDB setup for storing media files
let db;
const request = indexedDB.open('memoryBook', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const mediaStore = db.createObjectStore('media', { keyPath: 'id', autoIncrement: true });
  mediaStore.createIndex('date', 'date', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayMemories();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Add new memory
function addMemory(file, caption, date) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const transaction = db.transaction(['media'], 'readwrite');
    const store = transaction.objectStore('media');
    store.add({ file: event.target.result, caption, date });

    transaction.oncomplete = function() {
      displayMemories();
    };

    transaction.onerror = function(event) {
      console.error('Transaction error:', event.target.errorCode);
    };
  };
  reader.readAsDataURL(file);
}

// Display all memories
function displayMemories() {
  const transaction = db.transaction(['media'], 'readonly');
  const store = transaction.objectStore('media');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const memories = event.target.result;
    const memoryContainer = document.getElementById('memoryContainer');
    memoryContainer.innerHTML = '';

    memories.forEach(memory => {
      const memoryItem = document.createElement('div');
      memoryItem.className = 'memory-item';
      memoryItem.innerHTML = `
        <img src="${memory.file}" alt="Memory Image" />
        <p>Caption: ${memory.caption}</p>
        <p>Date: ${memory.date}</p>
      `;
      memoryContainer.appendChild(memoryItem);
    });

    createTimeline(memories);
  };
}

// Create timeline of significant events
function createTimeline(memories) {
  const timelineContainer = document.getElementById('timelineContainer');
  timelineContainer.innerHTML = '';

  memories.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(memory => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.innerHTML = `
      <p>${memory.date}: ${memory.caption}</p>
    `;
    timelineContainer.appendChild(timelineItem);
  });
}

// Add event listeners for form submissions
document.getElementById('memoryForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const file = document.getElementById('file').files[0];
  const caption = document.getElementById('caption').value;
  const date = document.getElementById('date').value;

  addMemory(file, caption, date);
});

// Initialize display
window.onload = function() {
  displayMemories();
};
