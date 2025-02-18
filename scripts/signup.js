document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.getElementById("signUp");

    function saveUser(email, password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({ email, password });
        localStorage.setItem("users", JSON.stringify(users));
    }

    function userExists(email) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        return users.some(user => user.email === email);
    }

    signUpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("signUpEmail").value;
        const password = document.getElementById("signUpPassword").value;

        if (userExists(email)) {
            alert("User already exists! Please log in.");
            window.location.href = "login.html"; // Redirect to login page
            return;
        }

        saveUser(email, password);
        alert("Sign-up successful! Redirecting to login.");
        window.location.href = "login.html"; // Redirect to login page
    });
});
