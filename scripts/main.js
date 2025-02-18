document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.getElementById("signUp");
    const loginForm = document.getElementById("login");
    const authSection = document.getElementById("authSection");
    const navTabs = document.querySelector(".tab-nav");
    const mainContent = document.getElementById("mainContent");
    const appContainer = document.getElementById("app-container");
    const logoutButton = document.getElementById("logoutButton");

    function saveUser(email, password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({ email, password });
        localStorage.setItem("users", JSON.stringify(users));
    }

    function getUser(email, password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        return users.find(user => user.email === email && user.password === password);
    }

    function showLogin() {
        document.getElementById("signUpForm").style.display = "none";
        document.getElementById("loginForm").style.display = "block";
    }

    function loginSuccess() {
        authSection.style.display = "none";
        navTabs.style.display = "flex";
        logoutButton.style.display = "block";
        mainContent.style.display = "block";
        alert("Login successful! Welcome to the PetCare Toolkit.");
    }

    // Handle Sign-Up
    signUpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("signUpEmail").value;
        const password = document.getElementById("signUpPassword").value;

        if (getUser(email, password)) {
            alert("User already exists! Please log in.");
            showLogin();
            return;
        }

        saveUser(email, password);
        alert("Sign-up successful! You can now log in.");
        showLogin();
    });

    // Handle Login
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        if (getUser(email, password)) {
            localStorage.setItem("loggedInUser", email);
            loginSuccess();
        } else {
            alert("Invalid credentials! Please try again.");
        }
    });

    // Handle Logout
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        location.reload();
    });

    // Check if user is already logged in
    if (localStorage.getItem("loggedInUser")) {
        loginSuccess();
    }

    // Handle App Navigation
    document.querySelectorAll(".tab-btn").forEach(button => {
        button.addEventListener("click", function () {
            const appName = this.getAttribute("data-app");
            loadApp(appName);
        });
    });

    // Function to Load Apps Dynamically
    function loadApp(appName) {
        appContainer.innerHTML = `
            <h2>${appName.replace(/([A-Z])/g, ' $1').trim()}</h2>
            <p>Welcome to the ${appName} app.</p>
            <button id="saveButton">Save</button>
            <button id="backButton">Back to Navigation</button>
        `;

        // Handle "Back to Navigation"
        document.getElementById("backButton").addEventListener("click", function () {
            appContainer.innerHTML = ""; // Clear app content
        });

        // Handle Save Button (Customize per app if needed)
        document.getElementById("saveButton").addEventListener("click", function () {
            alert(`${appName} data saved!`);
        });
    }
});
