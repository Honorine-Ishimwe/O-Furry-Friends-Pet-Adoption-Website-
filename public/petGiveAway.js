document.addEventListener("DOMContentLoaded", function () {
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    let giveAwayForm = document.getElementById("giveAwayForm");

    if (giveAwayForm) {  // Ensure form exists before running script
        giveAwayForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let petName = document.getElementById("petName").value.trim();
            let ownerEmail = document.getElementById("ownerEmail").value.trim();
            let giveAwayError = document.getElementById("giveAwayError");

            if (!petName || !ownerEmail) {
                giveAwayError.textContent = "All fields are required!";
                return;
            }

            if (!isValidEmail(ownerEmail)) {
                giveAwayError.textContent = "Invalid email format!";
                return;
            }

            giveAwayError.textContent = "Pet submission successful!";
        });
    }
});
