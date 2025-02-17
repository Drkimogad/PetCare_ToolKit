document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.getElementById("signUp");
    const loginForm = document.getElementById("login");
    const authSection = document.getElementById("authSection");
    const navTabs = document.querySelector(".tab-nav");

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

    // Check if user is already logged in
    if (localStorage.getItem("loggedInUser")) {
        loginSuccess();
    }
});
