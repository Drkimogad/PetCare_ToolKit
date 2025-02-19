document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser || loggedInUser.trim() === "") {
        alert("You must log in first!");
        window.location.href = "login.html"; // Redirect to login if not logged in
    } else {
        console.log("User logged in:", loggedInUser);
    }

    // Open apps in a new window
    document.querySelectorAll(".app-btn").forEach(button => {
        button.addEventListener("click", function () {
            const app = this.getAttribute("data-app");
            window.open(app, "_blank");
        });
    });

    // Handle Logout
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            alert("Logged out successfully!");
            window.location.href = "login.html"; // Redirect to login page
        });
    }
});
