let signup = document.getElementById("signup");
let login = document.getElementById("login");
let forgot = document.getElementById("forgot");
let goBack = document.getElementById("goBack");

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