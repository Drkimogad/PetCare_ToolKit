function getUser(email, password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(user => user.email.trim().toLowerCase() === email.trim().toLowerCase() &&
                              user.password === password);
}
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login");

    if (!loginForm) {
        alert("Login form not found! Check your HTML.");
        return;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        if (getUser(email, password)) {
            localStorage.setItem("loggedInUser", email);
            alert("Login successful! Redirecting to dashboard.");
            window.location.href = "navigation.html"; 
        } else {
            alert("Invalid credentials! Please try again.");
        }
    });
});
