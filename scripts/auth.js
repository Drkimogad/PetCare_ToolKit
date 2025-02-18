document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.getElementById("signUpForm");
    const loginForm = document.getElementById("loginForm");

    function saveUser(email, password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({ email, password });
        localStorage.setItem("users", JSON.stringify(users));
    }

    function getUser(email, password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        return users.find(user => user.email === email && user.password === password);
    }

    if (signUpForm) {
        signUpForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.getElementById("signUpEmail").value;
            const password = document.getElementById("signUpPassword").value;

            if (getUser(email, password)) {
                alert("User already exists! Please log in.");
                window.location.href = "login.html";
                return;
            }

            saveUser(email, password);
            alert("Sign-up successful! Please log in.");
            window.location.href = "login.html";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            if (getUser(email, password)) {
                localStorage.setItem("loggedInUser", email);
                alert("Login successful! Redirecting...");
                window.location.href = "navigation.html";
            } else {
                alert("Invalid credentials! Please try again.");
            }
        });
    }
});
