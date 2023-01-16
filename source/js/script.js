// -------- Кнопка меню-бургер
let navigationMain = document.querySelector(".main-navigation");
let navigationSwitch = document.querySelector(".main-navigation__toogle");

navigationMain.classList.remove("main-navigation--nojs");

navigationSwitch.addEventListener("click", function () {
  if (navigationMain.classList.contains("main-navigation--closed")) {
    navigationMain.classList.remove("main-navigation--closed");
    navigationMain.classList.add("main-navigation--opened");
  } else {
    navigationMain.classList.add("main-navigation--closed");
    navigationMain.classList.remove("main-navigation--opened");
  }
});

// -------- Кнопка в корзину. Модалка (catalog.html)
let catalogBuyButton = document.querySelectorAll(".product__button-buy");
let catalogModal = document.querySelector(".modal--close");


for (let catalogBuyButtons of catalogBuyButton) {
  catalogBuyButtons.onclick = function () {
    catalogModal.classList.toggle("modal--close");
  };
}
let modalCloseButton = document.querySelector(".modal__button");

modalCloseButton.onclick = function () {
  catalogModal.classList.add("modal--close");
};

// -------- Кнопка в корзину. Модалка (index.html)
let featuredBuyButton = document.querySelector(".featured__button");
let indexModal = document.querySelector(".modal--close");

featuredBuyButton.onclick = function () {
  indexModal.classList.toggle("modal--close");
}

modalCloseButton.onclick = function () {
  indexModal.classList.add("modal--close");
};
