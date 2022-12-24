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
