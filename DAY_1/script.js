const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

const modal = document.getElementById("signupModal");
const closeBtn = document.getElementById("closeModal");
const signupForm = document.getElementById("signupForm");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {
        menuBtn.innerHTML = "✕";
    } else {
        menuBtn.innerHTML = "☰";
    }
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuBtn.innerHTML = "☰";
    });
});

window.addEventListener("resize", () => {

    if (window.innerWidth > 768) {
        navLinks.classList.remove("active");
        menuBtn.innerHTML = "☰";
    }

});


function toggleBlur(show) {

    document.querySelector("header").classList.toggle("blur", show);
    document.querySelector("main").classList.toggle("blur", show);
    document.querySelector("footer").classList.toggle("blur", show);

}


document.querySelectorAll(".openModalBtn").forEach(button => {

    button.addEventListener("click", (e) => {

        e.preventDefault();

        modal.style.display = "flex";

        toggleBlur(true);

    });

});


function closeModal() {

    modal.style.display = "none";

    toggleBlur(false);

}

closeBtn.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {

    if (e.target === modal) {
        closeModal();
    }

});


signupForm.addEventListener("submit", (e) => {

    e.preventDefault();

    if (password.value !== confirmPassword.value) {

        alert("Passwords do not match!");

        return;

    }

    const user = {

        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value

    };

    localStorage.setItem("user", JSON.stringify(user));

    console.log("User Details");

    console.log(user);

    alert("Signup Successful!");

    signupForm.reset();

    closeModal();

});