document.addEventListener("DOMContentLoaded", () => {
    const dbName = "healthTarckerDB";
    const dbVersion = 1;
    let db;

    // Open IndexedDB
    const request = indexedDB.open(dbName, dbVersion);
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("pets")) {
            db.createObjectStore("pets", { keyPath: "id", autoIncrement: true });
        }
        if (!db.objectStoreNames.contains("records")) {
            db.createObjectStore("records", { keyPath: "id", autoIncrement: true });
        }
    };
    request.onsuccess = (event) => {
        db = event.target.result;
        loadPets();
        loadRecords();
    };
    request.onerror = (event) => console.error("Database error: ", event.target.errorCode);

    // Store user preferences in localStorage
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.checked = localStorage.getItem("theme") === "dark";
    themeToggle.addEventListener("change", () => {
        localStorage.setItem("theme", themeToggle.checked ? "dark" : "light");
        document.body.classList.toggle("dark-theme", themeToggle.checked);
    });

    // Add Pet Profile
    document.getElementById("pet-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("pet-name").value;
        const breed = document.getElementById("pet-breed").value;
        const age = parseInt(document.getElementById("pet-age").value);
        const weight = parseFloat(document.getElementById("pet-weight").value);
        const pet = { name, breed, age, weight };
        savePet(pet);
    });

    function savePet(pet) {
        const transaction = db.transaction(["pets"], "readwrite");
        const store = transaction.objectStore("pets");
        store.add(pet);
        transaction.oncomplete = () => loadPets();
    }

    function loadPets() {
        const transaction = db.transaction(["pets"], "readonly");
        const store = transaction.objectStore("pets");
        const request = store.getAll();
        request.onsuccess = (event) => {
            const pets = event.target.result;
            displayPets(pets);
        };
    }

    function displayPets(pets) {
        const list = document.getElementById("pet-list");
        list.innerHTML = "";
        pets.forEach(pet => {
            const li = document.createElement("li");
            li.textContent = `${pet.name} - ${pet.breed} - Age: ${pet.age} - Weight: ${pet.weight}kg`;
            list.appendChild(li);
        });
    }

    // Add Health Record
    document.getElementById("record-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const petId = parseInt(document.getElementById("record-pet-id").value);
        const type = document.getElementById("record-type").value;
        const date = document.getElementById("record-date").value;
        const notes = document.getElementById("record-notes").value;
        const record = { petId, type, date, notes };
        saveRecord(record);
    });

    function saveRecord(record) {
        const transaction = db.transaction(["records"], "readwrite");
        const store = transaction.objectStore("records");
        store.add(record);
        transaction.oncomplete = () => loadRecords();
    }

    function loadRecords() {
        const transaction = db.transaction(["records"], "readonly");
        const store = transaction.objectStore("records");
        const request = store.getAll();
        request.onsuccess = (event) => {
            const records = event.target.result;
            displayRecords(records);
        };
    }

    function displayRecords(records) {
        const list = document.getElementById("record-list");
        list.innerHTML = "";
        records.forEach(record => {
            const li = document.createElement("li");
            li.textContent = `Pet ID: ${record.petId} - ${record.type} - Date: ${record.date} - Notes: ${record.notes}`;
            list.appendChild(li);
        });
    }
});
