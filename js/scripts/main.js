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

if (btnClose) {
  btnClose.addEventListener("click", closeDatailsPokemon);
}

cardPokemon.forEach((card) => {
  card.addEventListener("click", openDatailsPokemon);
});

const btnDropdownSelect = document.querySelector(".js-open-select-custom");

btnDropdownSelect.addEventListener("click", () => {
  btnDropdownSelect.parentElement.classList.toggle("active");
});

const areaPokemons = document.getElementById("js-list-pokemons");

function convertLetraMinuscula(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function createCardPokemon(code, type, nome, imagePok) {
  let card = document.createElement("button");
  card.classList = `card-pokemon js-open-details-pokemon ${type}`;
  card.setAttribute("code-pokemon", code);
  areaPokemons.appendChild(card);

  let image = document.createElement("div");
  image.classList = "image";
  card.appendChild(image);

  let imageSrc = document.createElement("img");
  imageSrc.className = "thumb-img";
  imageSrc.setAttribute("src", imagePok);
  image.appendChild(imageSrc);

  let infoCardPokemon = document.createElement("div");
  infoCardPokemon.classList = "info";
  card.appendChild(infoCardPokemon);

  let infoRight = document.createElement("div");
  infoRight.classList = "right";
  infoCardPokemon.appendChild(infoRight);

  let infoLeft = document.createElement("div");
  infoLeft.classList = "left";
  infoCardPokemon.appendChild(infoLeft);

  let codePokemon = document.createElement("span");
  codePokemon.textContent = code < 10 ? `#00${code}` : code < 100 ? `#0${code}` : `#${code}`;
  infoRight.appendChild(codePokemon);

  let nomePokemon = document.createElement("h3");
  nomePokemon.textContent = convertLetraMinuscula(nome);
  infoRight.appendChild(nomePokemon);

  let imgType = document.createElement("img");
  imgType.setAttribute("src", `img/icon-types/${type}.svg`);
  infoLeft.appendChild(imgType);
}

function listingPokemons(urlApi) {
  axios({
    method: "GET",
    url: urlApi,
  }).then((response) => {
    const countPokemons = document.getElementById("js-count-pokemons");
    const { results, next, count } = response.data;

    countPokemons.innerText = count;

    results.forEach((pokemon) => {
      let urlApiDetails = pokemon.url;

      axios({
        method: "GET",
        url: `${urlApiDetails}`,
      }).then((response) => {
        const { name, id, sprites, types } = response.data;

        const infoCard = {
          nome: name,
          code: id,
          image: sprites.other.dream_world.front_default,
          type: types[0].type.name,
        };

        createCardPokemon(infoCard.code, infoCard.type, infoCard.nome, infoCard.image);

        const cardPokemon = document.querySelectorAll(".js-open-details-pokemon");

        cardPokemon.forEach((card) => {
          card.addEventListener("click", openDatailsPokemon);
        });
      });
    });
  });
}

listingPokemons("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0");

function openDatailsPokemon() {
  document.documentElement.classList.add("open-modal");

  let codePokemon = this.getAttribute("code-pokemon");
  let imagePokemon = this.querySelector(".thumb-img");
  let iconPokemon = this.querySelector(".info .left img");
  let namePokemon = this.querySelector(".info h3");
  let codeStringPokemon = this.querySelector(".info .right span");

  const modalDetails = document.getElementById("js-modal-details");
  const imgPokemonModal = document.getElementById("js-image-pokemon-modal");
  const iconTypePokemonModal = document.getElementById("js-image-type-modal");
  const namePokemonModal = document.getElementById("js-name-pokemon-modal");
  const codePokemonModal = document.getElementById("js-code-pokemon-modal");

  const heightPokemonModal = document.getElementById("js-height-pokemon");
  const weightPokemonModal = document.getElementById("js-weight-pokemon");
  const abilitiesPokemonModal = document.getElementById("js-main-abilities");

  imgPokemonModal.setAttribute("src", imagePokemon.getAttribute("src"));
  modalDetails.setAttribute("type-pokemon-modal", this.classList[2]);
  iconTypePokemonModal.setAttribute("src", iconPokemon.getAttribute("src"));

  namePokemonModal.textContent = namePokemon.textContent;
  codePokemonModal.textContent = codeStringPokemon.textContent;

  axios({
    method: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`,
  }).then((response) => {
    let data = response.data;

    let infoPokemon = {
      mainAbilities: convertLetraMinuscula(data.abilities[0].ability.name),
      types: data.types,
      weight: data.weight,
      height: data.height,
      abilities: data.abilities,
      stats: data.stats,
      urlType: data.types[0].type.url,
    };

    function listingTypesPokemon() {
      const areaTypesModal = document.getElementById("js-types-pokemon");

      areaTypesModal.innerHTML = "";
      let arrayTypes = infoPokemon.types;

      console.log(arrayTypes);

      arrayTypes.forEach((itemType) => {
        let itemList = document.createElement("li");
        areaTypesModal.appendChild(itemList);

        let spanList = document.createElement("span");
        spanList.classList = `tag-type ${itemType.type.name}`;
        spanList.textContent = convertLetraMinuscula(itemType.type.name);
        itemList.appendChild(spanList);
      });
    }

    function listingWeaknesses() {
      const areaWeak = document.getElementById("js-area-weak");

      areaWeak.innerHTML = "";

      axios({
        method: "GET",
        url: `${infoPokemon.urlType}`,
      }).then((response) => {
        let weaknesses = response.data.damage_relations.double_damage_from;

        weaknesses.forEach((itemType) => {
          let itemListWeak = document.createElement("li");
          areaWeak.appendChild(itemListWeak);

          let spanList = document.createElement("span");
          spanList.classList = `tag-type ${itemType.name}`;
          spanList.textContent = convertLetraMinuscula(itemType.name);
          itemListWeak.appendChild(spanList);
        });
      });
    }

    heightPokemonModal.textContent = `${infoPokemon.height / 10}m`;
    weightPokemonModal.textContent = `${infoPokemon.weight / 10}kg`;
    abilitiesPokemonModal.textContent = infoPokemon.mainAbilities;

    const statsHp = document.getElementById("js-stats-hp");
    const statsAttack = document.getElementById("js-stats-attack");
    const statsDefense = document.getElementById("js-stats-defense");
    const statsSpAttack = document.getElementById("js-stats-sp-attack");
    const statsSpDefense = document.getElementById("js-stats-sp-defense");
    const statsSpeed = document.getElementById("js-stats-speed");

    statsHp.style.width = `${infoPokemon.stats[0].base_stat}%`;
    statsAttack.style.width = `${infoPokemon.stats[1].base_stat}%`;
    statsDefense.style.width = `${infoPokemon.stats[2].base_stat}%`;
    statsSpAttack.style.width = `${infoPokemon.stats[3].base_stat}%`;
    statsSpDefense.style.width = `${infoPokemon.stats[4].base_stat}%`;
    statsSpeed.style.width = `${infoPokemon.stats[5].base_stat}%`;

    //const statsHp = infoPokemon.stats[0].base_stat;

    listingTypesPokemon();
    listingWeaknesses();
  });
}

function closeDatailsPokemon() {
  document.documentElement.classList.remove("open-modal");
}

// Aqui é script para listar todos os tipos de pokemon

const areaTypes = document.getElementById("js-type-area");
const areaTypesMobile = document.querySelector(".dropdown-selected");

// Aqui é onde puxa os tipos na api e cria estrutura no html
axios({
  method: "GET",
  url: "https://pokeapi.co/api/v2/type",
}).then((response) => {
  const { results } = response.data;

  results.forEach((type, index) => {
    if (index < 18) {
      let itemType = document.createElement("li");
      areaTypes.appendChild(itemType);

      let btnType = document.createElement("button");
      btnType.classList = `type-filter ${type}`;
      btnType.setAttribute("code-type", index + 1);
      itemType.appendChild(btnType);

      let iconType = document.createElement("div");
      iconType.classList = "icon";
      btnType.appendChild(iconType);

      let imgIcon = document.createElement("img");
      imgIcon.setAttribute("src", `img/icon-types/${type.name}.svg`);
      iconType.appendChild(imgIcon);

      let name = document.createElement("span");
      name.textContent = convertLetraMinuscula(type.name);
      btnType.appendChild(name);

      // Aqui é o preenchimento do select mobile dos tipos

      let itemTypeMobile = document.createElement("li");
      areaTypesMobile.appendChild(itemTypeMobile);

      let btnTypeMobile = document.createElement("button");
      btnTypeMobile.classList = `type-filter ${type}`;
      btnTypeMobile.setAttribute("code-type", index + 1);
      itemTypeMobile.appendChild(btnTypeMobile);

      let iconTypeMobile = document.createElement("div");
      iconTypeMobile.classList = "icon";
      btnTypeMobile.appendChild(iconTypeMobile);

      let imgIconMobile = document.createElement("img");
      imgIconMobile.setAttribute("src", `img/icon-types/${type.name}.svg`);
      iconTypeMobile.appendChild(imgIconMobile);

      let nameMobile = document.createElement("span");
      nameMobile.textContent = convertLetraMinuscula(type.name);
      btnTypeMobile.appendChild(nameMobile);

      const allTypes = document.querySelectorAll(".type-filter");

      allTypes.forEach((btn) => {
        btn.addEventListener("click", filterByTypes);
      });
    }
  });
});

// Aqui é o script do botão Load More

const btnLoadMore = document.getElementById("js-btn-loadmore");

var countPokemons = 10;
function showMorePokemons() {
  listingPokemons(`https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPokemons}`);
  countPokemons += 9;
}

btnLoadMore.addEventListener("click", showMorePokemons);

// função para filtrar os pokemon por tipo

function filterByTypes() {
  let idPokemon = this.getAttribute("code-type");

  const areaPokemons = document.getElementById("js-list-pokemons");
  const btnLoadMore = document.getElementById("js-btn-loadmore");
  const countPokemonsType = document.getElementById("js-count-pokemons");
  const allTypes = document.querySelectorAll(".type-filter");

  btnLoadMore.style.display = "none";
  areaPokemons.innerHTML = "";

  const sectionPokemons = document.querySelector(".s-all-info-pokemons");
  const topSection = sectionPokemons.offsetTop;

  window.scrollTo({
    top: topSection + 288,
    behavior: "smooth",
  });
  allTypes.forEach((types) => {
    types.classList.remove("active");
  });

  this.classList.add("active");

  if (idPokemon) {
    axios({
      method: "GET",
      url: `https://pokeapi.co/api/v2/type/${idPokemon}`,
    }).then((response) => {
      const { pokemon } = response.data;
      countPokemonsType.textContent = pokemon.length;

      pokemon.forEach((pok) => {
        const { url } = pok.pokemon;

        axios({
          method: "GET",
          url: `${url}`,
        }).then((response) => {
          const { name, id, sprites, types } = response.data;

          const infoCard = {
            nome: name,
            code: id,
            image: sprites.other.dream_world.front_default,
            type: types[0].type.name,
          };

          if (infoCard.image) {
            createCardPokemon(infoCard.code, infoCard.type, infoCard.nome, infoCard.image);
          }

          const cardPokemon = document.querySelectorAll(".js-open-details-pokemon");

          cardPokemon.forEach((card) => {
            card.addEventListener("click", openDatailsPokemon);
          });
        });
      });
    });
  } else {
    areaPokemons.innerHTML = "";
    listingPokemons(`https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPokemons}`);
    btnLoadMore.style.display = "block";
  }
}

// função para buscar porkemons

const btnSearch = document.getElementById("js-btn-search");
const inputSearch = document.getElementById("js-input-search");

btnSearch.addEventListener("click", searchPokemon);

inputSearch.addEventListener("keyup", (event) => {
  if (event.code == "Enter") {
    searchPokemon();
  }
});

function searchPokemon() {
  let valueInput = inputSearch.value.toLowerCase();
  const countPokemons = document.getElementById("js-count-pokemons");
  const allTypes = document.querySelectorAll(".type-filter");

  axios({
    method: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`,
  })
    .then((response) => {
      areaPokemons.innerHTML = "";
      btnLoadMore.style.display = "none";
      countPokemons.innerText = 1;

      allTypes.forEach((type) => {
        type.classList.remove("active");
      });

      const { name, id, sprites, types } = response.data;

      const infoCard = {
        nome: name,
        code: id,
        image: sprites.other.dream_world.front_default,
        type: types[0].type.name,
      };

      if (infoCard.image) {
        createCardPokemon(infoCard.code, infoCard.type, infoCard.nome, infoCard.image);
      }

      const cardPokemon = document.querySelectorAll(".js-open-details-pokemon");

      cardPokemon.forEach((card) => {
        card.addEventListener("click", openDatailsPokemon);
      });
    })
    .catch((error) => {
      areaPokemons.innerHTML = "";
      btnLoadMore.style.display = "none";
      countPokemons.innerText = 0;

      allTypes.forEach((type) => {
        type.classList.remove("active");
      });
    });
}
