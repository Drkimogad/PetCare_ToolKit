"use strict";

// IndexedDB setup for storing pet medical records and emergency plans
let db;
const request = indexedDB.open('emergencyKit', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  const petStore = db.createObjectStore('petRecords', { keyPath: 'id', autoIncrement: true });
  petStore.createIndex('petName', 'petName', { unique: false });
  const planStore = db.createObjectStore('emergencyPlans', { keyPath: 'id', autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayRecords();
  displayPlans();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Add pet medical record
function addPetRecord(petName, allergies, medications, vetContact, microchipNumber, tags, photo) {
  const transaction = db.transaction(['petRecords'], 'readwrite');
  const store = transaction.objectStore('petRecords');
  store.add({ petName, allergies, medications, vetContact, microchipNumber, tags, photo });

  transaction.oncomplete = function() {
    displayRecords();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Add emergency plan
function addEmergencyPlan(evacuationRoutes, petFriendlyShelters) {
  const transaction = db.transaction(['emergencyPlans'], 'readwrite');
  const store = transaction.objectStore('emergencyPlans');
  store.add({ evacuationRoutes, petFriendlyShelters });

  transaction.oncomplete = function() {
    displayPlans();
  };

  transaction.onerror = function(event) {
    console.error('Transaction error:', event.target.errorCode);
  };
}

// Display pet medical records
function displayRecords() {
  const transaction = db.transaction(['petRecords'], 'readonly');
  const store = transaction.objectStore('petRecords');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const records = event.target.result;
    const recordContainer = document.getElementById('recordContainer');
    recordContainer.innerHTML = '';

    records.forEach(record => {
      const recordItem = document.createElement('div');
      recordItem.className = 'record-item';
      recordItem.innerHTML = `
        <h3>${record.petName}</h3>
        <p>Allergies: ${record.allergies}</p>
        <p>Medications: ${record.medications}</p>
        <p>Vet Contact: ${record.vetContact}</p>
        <p>Microchip Number: ${record.microchipNumber}</p>
        <p>Tags: ${record.tags}</p>
        <img src="${record.photo}" alt="Pet Photo" style="max-width: 100px;" />
      `;
      recordContainer.appendChild(recordItem);
    });
  };
}

// Display emergency plans
function displayPlans() {
  const transaction = db.transaction(['emergencyPlans'], 'readonly');
  const store = transaction.objectStore('emergencyPlans');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const plans = event.target.result;
    const planContainer = document.getElementById('planContainer');
    planContainer.innerHTML = '';

    plans.forEach(plan => {
      const planItem = document.createElement('div');
      planItem.className = 'plan-item';
      planItem.innerHTML = `
        <h3>Emergency Plan</h3>
        <p>Evacuation Routes: ${plan.evacuationRoutes}</p>
        <p>Pet-Friendly Shelters: ${plan.petFriendlyShelters}</p>
      `;
      planContainer.appendChild(planItem);
    });
  };
}

// Set critical info using localStorage
function setCriticalInfo(info) {
  localStorage.setItem('criticalInfo', JSON.stringify(info));
}

// Get critical info from localStorage
function getCriticalInfo() {
  return JSON.parse(localStorage.getItem('criticalInfo')) || {};
}

// Add event listeners for form submissions
document.getElementById('recordForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const petName = document.getElementById('petName').value;
  const allergies = document.getElementById('allergies').value;
  const medications = document.getElementById('medications').value;
  const vetContact = document.getElementById('vetContact').value;
  const microchipNumber = document.getElementById('microchipNumber').value;
  const tags = document.getElementById('tags').value;
  const photo = document.getElementById('photo').src;

  addPetRecord(petName, allergies, medications, vetContact, microchipNumber, tags, photo);
});

document.getElementById('planForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const evacuationRoutes = document.getElementById('evacuationRoutes').value;
  const petFriendlyShelters = document.getElementById('petFriendlyShelters').value;

  addEmergencyPlan(evacuationRoutes, petFriendlyShelters);
});

document.getElementById('criticalInfoForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const criticalInfo = {
    emergencyContact: document.getElementById('emergencyContact').value,
    vetContact: document.getElementById('vetContact').value,
    preferredShelter: document.getElementById('preferredShelter').value
  };

  setCriticalInfo(criticalInfo);
  displayCriticalInfo();
});

// Display critical info
function displayCriticalInfo() {
  const info = getCriticalInfo();
  const criticalInfoContainer = document.getElementById('criticalInfoContainer');
  criticalInfoContainer.innerHTML = `
    <h3>Critical Info</h3>
    <p>Emergency Contact: ${info.emergencyContact}</p>
    <p>Vet Contact: ${info.vetContact}</p>
    <p>Preferred Shelter: ${info.preferredShelter}</p>
  `;
}

// Initialize display
window.onload = function() {
  displayRecords();
  displayPlans();
  displayCriticalInfo();
};
