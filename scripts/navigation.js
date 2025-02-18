document.addEventListener("DOMContentLoaded", function () {
    const navTabs = document.querySelectorAll(".tab-btn");
    const logoutBtn = document.getElementById("logout");

    // Check if user is logged in
    if (!localStorage.getItem("loggedInUser")) {
        alert("You must log in first!");
        window.location.href = "login.html"; // Redirect to login if not logged in
    }

    // Open apps in a new window
    navTabs.forEach(button => {
        button.addEventListener("click", function () {
            const app = this.getAttribute("data-app");
            window.open(`${app}.html`, "_blank");
        });
    });

    // Handle Logout
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        alert("Logged out successfully!");
        window.location.href = "login.html"; // Redirect to login page
    });
});
