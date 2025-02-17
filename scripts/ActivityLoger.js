document.addEventListener("DOMContentLoaded", () => {
    const dbName = "PetActivityDB";
    const dbVersion = 1;
    let db;

    // Open IndexedDB
    const request = indexedDB.open(dbName, dbVersion);
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("activities")) {
            db.createObjectStore("activities", { keyPath: "id", autoIncrement: true });
        }
    };
    request.onsuccess = (event) => {
        db = event.target.result;
        loadActivities();
    };
    request.onerror = (event) => console.error("Database error: ", event.target.errorCode);

    // Store user preferences in localStorage
    const goalInput = document.getElementById("goal");
    goalInput.value = localStorage.getItem("dailyGoal") || 30;
    goalInput.addEventListener("input", () => {
        localStorage.setItem("dailyGoal", goalInput.value);
    });

    // Add Activity
    document.getElementById("activity-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const type = document.getElementById("activity-type").value;
        const duration = parseInt(document.getElementById("duration").value);
        const calories = calculateCalories(type, duration);
        const activity = { type, duration, calories, date: new Date().toISOString() };
        saveActivity(activity);
    });

    function saveActivity(activity) {
        const transaction = db.transaction(["activities"], "readwrite");
        const store = transaction.objectStore("activities");
        store.add(activity);
        transaction.oncomplete = () => loadActivities();
    }

    function loadActivities() {
        const transaction = db.transaction(["activities"], "readonly");
        const store = transaction.objectStore("activities");
        const request = store.getAll();
        request.onsuccess = (event) => {
            const activities = event.target.result;
            displayActivities(activities);
            updateChart(activities);
        };
    }

    function displayActivities(activities) {
        const list = document.getElementById("activity-list");
        list.innerHTML = "";
        activities.forEach(activity => {
            const li = document.createElement("li");
            li.textContent = `${activity.type} - ${activity.duration} min - ${activity.calories} kcal`;
            list.appendChild(li);
        });
    }

    function updateChart(activities) {
        const ctx = document.getElementById("activityChart").getContext("2d");
        const labels = activities.map(a => new Date(a.date).toLocaleDateString());
        const data = activities.map(a => a.duration);
        new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [{ label: "Activity Duration (min)", data, backgroundColor: "#4CAF50" }]
            }
        });
    }

    function calculateCalories(type, duration) {
        const rates = { walk: 5, play: 7, exercise: 10 };
        return (rates[type] || 5) * duration;
    }
});
