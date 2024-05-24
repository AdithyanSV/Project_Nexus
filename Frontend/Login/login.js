const signup = document.getElementById("signup");
const login = document.getElementById("login");
const forgot = document.getElementById("forgot");
const goBack = document.getElementById("goBack");
const goBackBtn = document.getElementById("goBackBtn");


signup.addEventListener("click", () => {
    document.querySelector(".form.register").style.display = "flex";
    document.querySelector(".form.signin").style.display = "none";
    document.querySelector(".form.forgot").style.display = "none";
    document.querySelector(".form.goBack").style.display = "none";
});
forgot.addEventListener("click", () => {
    document.querySelector(".form.forgot").style.display = "flex";
    document.querySelector(".form.signin").style.display = "none";
    document.querySelector(".form.register").style.display = "none";
    document.querySelector(".form.goBack").style.display = "none";
});

login.addEventListener("click", () => {
    document.querySelector(".form.signin").style.display = "flex";
    document.querySelector(".form.register").style.display = "none";
    document.querySelector(".form.forgot").style.display = "none";
    document.querySelector(".form.goBack").style.display = "none";
});


goBack.addEventListener("click", () => {
    document.querySelector(".form.forgot").style.display = "none";
    document.querySelector(".form.signin").style.display = "flex";
    document.querySelector(".form.register").style.display = "none";
    document.querySelector(".form.goBack").style.display = "none";
});

goBackBtn.addEventListener("click", () => {
    document.querySelector(".form.forgot").style.display = "none";
    document.querySelector(".form.signin").style.display = "flex";
    document.querySelector(".form.register").style.display = "none";
    document.querySelector(".form.goBack").style.display = "none";
});


function isEmailValid(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

    function validateEmail() {
        const email = document.getElementById("verifyMail").value;
        if (isEmailValid(email)) {
            document.querySelector(".form.forgot").style.display = "none";
            document.querySelector(".form.signin").style.display = "none";
            document.querySelector(".form.register").style.display = "none";
            document.querySelector(".form.goBack").style.display = "flex";
            console.log("Email is valid");
        }}