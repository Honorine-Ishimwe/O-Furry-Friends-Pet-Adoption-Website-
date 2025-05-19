document.addEventListener("DOMContentLoaded", function () {
    const findPetForm = document.getElementById("findPetForm");

    if (findPetForm) {
        findPetForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form from submitting

            const name = document.getElementById("name").value.trim();
            const breed = document.getElementById("breed").value.trim();
            const email = document.getElementById("email").value.trim();
            const petType = document.getElementById("pet-type").value;
            const errorMessage = document.getElementById("errorMessage");

            if (!name || !breed || !email || !petType) {
                errorMessage.textContent = "All fields are required!";
                errorMessage.style.color = "red";
            } else {
                errorMessage.textContent = "Form submitted successfully!";
                errorMessage.style.color = "green";
            }
        });
    }
});