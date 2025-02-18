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
    document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.getElementById("signUp");

    function saveUser(email, password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({ email, password });
        localStorage.setItem("users", JSON.stringify(users));
    }

    signUpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("signUpEmail").value;
        const password = document.getElementById("signUpPassword").value;

        if (!email || !password) {
            alert("Please fill all fields!");
            return;
        }

        saveUser(email, password);
        alert("Sign-up successful! Redirecting to login...");
        window.location.href = "login.html";
    });
});


    // Handle Login
    document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login");

    function getUser(email, password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        return users.find(user => user.email === email && user.password === password);
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        if (getUser(email, password)) {
            localStorage.setItem("loggedInUser", email);
            alert("Login successful! Redirecting to navigation...");
            window.location.href = "navigation.html";
        } else {
            alert("Invalid credentials! Please try again.");
        }
    });
});


    // Handle Logout
    document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutButton");

    // Logout Functionality
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        alert("Logged out successfully!");
        window.location.href = "login.html";
    });

    // Open Apps in New Window
    document.querySelectorAll(".tab-btn").forEach(button => {
        button.addEventListener("click", function () {
            const appName = this.getAttribute("data-app");
            window.open(`apps/${appName}.html`, "_blank");
        });
    });

    // Ensure User is Logged In
    if (!localStorage.getItem("loggedInUser")) {
        alert("You must be logged in to access this page.");
        window.location.href = "login.html";
    }
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

    document.addEventListener("DOMContentLoaded", function () {
    const appContainer = document.getElementById("app-container");
    const tabButtons = document.querySelectorAll(".tab-btn");

    tabButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const appName = this.getAttribute("data-app");
            loadApp(appName);
        });
    });
// function to load the apps
    async function loadApp(appName) {
        try {
            appContainer.innerHTML = "<p>Loading...</p>";
            const module = await import(`./${appName}.js`);
            
            if (module.default) {
                appContainer.innerHTML = "";
                module.default(appContainer);
            } else {
                appContainer.innerHTML = `<p>Error: Module '${appName}.js' is missing a default export.</p>`;
            }
        } catch (error) {
            appContainer.innerHTML = `<p>Error loading '${appName}.js'. Check console for details.</p>`;
            console.error(`Failed to load '${appName}.js':`, error);
        }
    }
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
