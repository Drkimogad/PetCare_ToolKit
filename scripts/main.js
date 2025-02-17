const users = [];

// Handle Sign-Up
document.getElementById('signUp').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert('User already exists! Please log in.');
        return;
    }

    // Add new user
    users.push({ email, password });
    alert('Sign-up successful! You can now log in.');

    // Switch to login form
    document.getElementById('signUpForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

// Handle Login
document.getElementById('login').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
        alert('Login successful!');
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'block';

        loadSavedPetProfile();
    } else {
        alert('Invalid credentials! Please try again.');
    }
});

// Handle Logout
document.getElementById('logoutButton').addEventListener('click', function () {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'none';

    alert('Logged out successfully!');
});

// Dynamically load app scripts based on the selected tab
const appContainer = document.getElementById('app-container');
const tabs = document.querySelectorAll('.tab-btn');

// Load initial app (e.g., Diet Planner)
loadApp('dietPlanner');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    loadApp(tab.dataset.app);
  });
});

async function loadApp(appName) {
  try {
    const appModule = await import(`./${appName}.js`);
    appContainer.innerHTML = appModule.render(); // Each app exposes a render() function
    appModule.init(); // Initialize event listeners and logic
  } catch (err) {
    appContainer.innerHTML = `<p>Error loading ${appName}. Please refresh.</p>`;
  }
}
