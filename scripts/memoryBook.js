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

// Utility function to read file as data URL
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
});

// Save Memory (and Pet Profile) functionality
document.getElementById('saveMemory').addEventListener('click', function() {
  // Get pet profile fields
  const petName = document.getElementById('petName').value.trim();
  const petBreed = document.getElementById('petBreed').value.trim();
  const petPhotoFile = document.getElementById('petPhoto').files[0];

  // Get memory entry fields
  const memoryFile = document.getElementById('memoryFile').files[0];
  const caption = document.getElementById('caption').value.trim();
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const reminderTime = document.getElementById('reminderTime').value;

  // Validate required fields
  if (!petName || !petBreed || !memoryFile || !caption || !date || !category) {
    alert("Please fill all required fields.");
    return;
  }

  // Read files (pet photo is optional)
  let petPhotoPromise = petPhotoFile ? readFile(petPhotoFile) : Promise.resolve(null);
  let memoryFilePromise = readFile(memoryFile);

  Promise.all([petPhotoPromise, memoryFilePromise])
    .then(results => {
      const petPhotoData = results[0];
      const memoryImageData = results[1];

      // Create memory object with pet profile and memory data
      const memoryObj = {
        petName,
        petBreed,
        petPhoto: petPhotoData, // may be null if not provided
        memoryImage: memoryImageData,
        caption,
        date,
        category,
        reminderTime
      };

      // Save to IndexedDB
      const transaction = db.transaction(['media'], 'readwrite');
      const store = transaction.objectStore('media');
      store.add(memoryObj);

      transaction.oncomplete = function() {
        displayMemories();
        clearForm();
      };

      transaction.onerror = function(event) {
        console.error('Transaction error:', event.target.errorCode);
      };
    })
    .catch(error => {
      console.error("Error reading files:", error);
    });
});

// Function to clear form fields after saving
function clearForm() {
  document.getElementById('petName').value = "";
  document.getElementById('petBreed').value = "";
  document.getElementById('petPhoto').value = "";
  document.getElementById('petPhotoPreview').src = "";
  document.getElementById('petPhotoPreview').style.display = "none";

  document.getElementById('memoryFile').value = "";
  document.getElementById('memoryImagePreview').src = "";
  document.getElementById('memoryImagePreview').style.display = "none";

  document.getElementById('caption').value = "";
  document.getElementById('date').value = "";
  document.getElementById('category').value = "";
  document.getElementById('reminderTime').value = "";
}

// "Add New Profile" button clears the form for a new entry
document.getElementById('addNewProfile').addEventListener('click', function() {
  clearForm();
});

// Image preview for pet photo
document.getElementById('petPhoto').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    readFile(file).then(result => {
      const preview = document.getElementById('petPhotoPreview');
      preview.src = result;
      preview.style.display = 'block';
    }).catch(error => {
      console.error('Error reading pet photo file:', error);
    });
  }
});

// Image preview for memory image
document.getElementById('memoryFile').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    readFile(file).then(result => {
      const preview = document.getElementById('memoryImagePreview');
      preview.src = result;
      preview.style.display = 'block';
    }).catch(error => {
      console.error('Error reading memory image file:', error);
    });
  }
});

// Display all saved memories with Edit, Delete, and Export options
function displayMemories() {
  const transaction = db.transaction(['media'], 'readonly');
  const store = transaction.objectStore('media');
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = function(event) {
    const memories = event.target.result;
    const savedMemoriesContainer = document.getElementById('savedMemoriesContainer');
    savedMemoriesContainer.innerHTML = "";

    memories.forEach(memory => {
      const memoryItem = document.createElement('div');
      memoryItem.className = 'memory-item';
      memoryItem.innerHTML = `
        <div class="pet-profile">
          <p><strong>Pet Name:</strong> ${memory.petName}</p>
          <p><strong>Breed:</strong> ${memory.petBreed}</p>
          ${memory.petPhoto ? `<img src="${memory.petPhoto}" alt="Pet Photo" style="max-width:100px;">` : ''}
        </div>
        <div class="memory-details">
          <img src="${memory.memoryImage}" alt="Memory Image" style="max-width:100px;">
          <p><strong>Caption:</strong> ${memory.caption}</p>
          <p><strong>Date:</strong> ${memory.date}</p>
          <p><strong>Category:</strong> ${memory.category}</p>
          ${memory.reminderTime ? `<p><strong>Reminder:</strong> ${memory.reminderTime}</p>` : ''}
        </div>
        <div class="memory-actions">
          <button onclick="editMemory(${memory.id})">Edit</button>
          <button onclick="deleteMemory(${memory.id})">Delete</button>
          <button onclick="exportMemory(${memory.id})">Export</button>
        </div>
      `;
      savedMemoriesContainer.appendChild(memoryItem);
    });
  };
}

// Edit memory using prompt inputs for simplicity
function editMemory(id) {
  const transaction = db.transaction(['media'], 'readwrite');
  const store = transaction.objectStore('media');
  const request = store.get(id);

  request.onsuccess = function(event) {
    const memory = event.target.result;
    if (memory) {
      const newPetName = prompt("Edit Pet Name:", memory.petName) || memory.petName;
      const newPetBreed = prompt("Edit Breed Details:", memory.petBreed) || memory.petBreed;
      const newCaption = prompt("Edit Caption:", memory.caption) || memory.caption;
      const newDate = prompt("Edit Date (YYYY-MM-DD):", memory.date) || memory.date;
      const newCategory = prompt("Edit Category:", memory.category) || memory.category;
      const newReminder = prompt("Edit Reminder (YYYY-MM-DDTHH:MM):", memory.reminderTime) || memory.reminderTime;
      
      memory.petName = newPetName;
      memory.petBreed = newPetBreed;
      memory.caption = newCaption;
      memory.date = newDate;
      memory.category = newCategory;
      memory.reminderTime = newReminder;
      
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

// Return to Navigation Menu functionality
document.getElementById('returnToNav').addEventListener('click', function() {
  // Redirect to navigation board/menu (adjust URL as needed)
  window.location.href = "navigation.html";
});

// Initialize display on window load
window.onload = function() {
  displayMemories();
};
