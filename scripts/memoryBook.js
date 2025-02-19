"use strict";

// IndexedDB setup for storing media files
let db;
const request = indexedDB.open('memoryBook', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const mediaStore = db.createObjectStore('media', { keyPath: 'id', autoIncrement: true });
  mediaStore.createIndex('date', 'date', { unique: false });
  mediaStore.createIndex('category', 'category', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayMemories();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Toggle Dark Mode
document.getElementById('darkModeToggle').addEventListener('click', () => {
  document.documentElement.setAttribute('data-theme', 
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  );
});


// Add new memory with category
function addMemory(file, caption, date, category) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const transaction = db.transaction(['media'], 'readwrite');
    const store = transaction.objectStore('media');
    store.add({ file: event.target.result, caption, date, category });

    transaction.oncomplete = function() {
      displayMemories();
    };

    transaction.onerror = function(event) {
      console.error('Transaction error:', event.target.errorCode);
    };
  };
  reader.readAsDataURL(file);
}

// Display all memories with Edit, Delete, and Export options
function displayMemories() {
  const transaction = db.transaction(['media'], 'readonly');
  const store = transaction.objectStore('media');
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = function(event) {
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
        <p>Category: ${memory.category}</p>
        <button onclick="editMemory(${memory.id})">Edit</button>
        <button onclick="deleteMemory(${memory.id})">Delete</button>
        <button onclick="exportMemory(${memory.id})">Export</button>
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

  memories.sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(memory => {
      const timelineItem = document.createElement('div');
      timelineItem.className = 'timeline-item';
      timelineItem.innerHTML = `<p>${memory.date}: ${memory.caption} (${memory.category})</p>`;
      timelineContainer.appendChild(timelineItem);
    });
}

// Edit memory using prompt inputs (for simplicity)
function editMemory(id) {
  const transaction = db.transaction(['media'], 'readwrite');
  const store = transaction.objectStore('media');
  const request = store.get(id);

  request.onsuccess = function(event) {
    const memory = event.target.result;
    if (memory) {
      const newCaption = prompt("Edit caption:", memory.caption) || memory.caption;
      const newDate = prompt("Edit date (YYYY-MM-DD):", memory.date) || memory.date;
      const newCategory = prompt("Edit category:", memory.category) || memory.category;
      
      memory.caption = newCaption;
      memory.date = newDate;
      memory.category = newCategory;

      const updateRequest = store.put(memory);
      updateRequest.onsuccess = function() {
        displayMemories();
      };
      updateRequest.onerror = function(event) {
        console.error('Update error:', event.target.errorCode);
      };
    }
  };
}

// Delete memory
function deleteMemory(id) {
  const transaction = db.transaction(['media'], 'readwrite');
  const store = transaction.objectStore('media');
  const request = store.delete(id);

  request.onsuccess = function() {
    displayMemories();
  };

  request.onerror = function(event) {
    console.error('Delete error:', event.target.errorCode);
  };
}

// Export memory as a JSON file
function exportMemory(id) {
  const transaction = db.transaction(['media'], 'readonly');
  const store = transaction.objectStore('media');
  const request = store.get(id);

  request.onsuccess = function(event) {
    const memory = event.target.result;
    if (memory) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(memory));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "memory_" + id + ".json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };
}

// Image preview functionality
document.getElementById('file').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imagePreview = document.getElementById('imagePreview');
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// Handle memory form submission
document.getElementById('memoryForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const file = document.getElementById('file').files[0];
  const caption = document.getElementById('caption').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;

  if (file && caption && date && category) {
    addMemory(file, caption, date, category);
  } else {
    alert("Please fill all the fields.");
  }
});

// Dark mode toggle functionality
document.getElementById('darkModeToggle').addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
});

// Add new profile functionality (placeholder)
document.getElementById('addNewProfile').addEventListener('click', function() {
  alert("Add New Profile functionality coming soon!");
});

// Set memory reminder functionality (placeholder)
document.getElementById('setReminder').addEventListener('click', function() {
  const reminderTime = document.getElementById('reminderTime').value;
  if (reminderTime) {
    alert('Memory reminder set for: ' + reminderTime);
    // Future implementation: schedule notifications or push alerts
  } else {
    alert('Please select a valid date and time for reminder.');
  }
});

// Initialize display
window.onload = function() {
  displayMemories();
};
