// Scripts do slide principal
var slide_hero = new Swiper(".slide-hero", {
  effect: "fade",
  pagination: {
    el: ".slide-hero .main-area .area-explore .swiper-pagination",
    dynamicBullets: true,
  },
});

const cardPokemon = document.querySelectorAll(".js-open-details-pokemon");
const btnClose = document.querySelector(".js-close-modal");

function openDatailsPokemon() {
  document.documentElement.classList.add("open-modal");
}

function closeDatailsPokemon() {
  document.documentElement.classList.remove("open-modal");
}

btnClose.addEventListener("click", closeDatailsPokemon);

cardPokemon.forEach((card) => {
  card.addEventListener("click", openDatailsPokemon);
});
