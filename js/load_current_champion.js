const championBaseUrl =
  "https://ddragon.leagueoflegends.com/cdn/11.14.1/data/en_US/champion";

const championImageBaseUrl =
  "https://ddragon.leagueoflegends.com/cdn/11.14.1/img/champion";

const championSkinBaseUrl =
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash";

const usersBaseUrl = "https://jedi-server.herokuapp.com/users";

const getChampion = async (id) => {
  const champion = (await get(`${championBaseUrl}/${id}.json`)).data[id];
  return {
    id: champion.id,
    name: champion.name,
    title: champion.title,
    image: `${championImageBaseUrl}/${champion.id}.png`,
    lore: champion.lore,
    skins: champion.skins.map((skin) => {
      return {
        name: skin.name.capitalize(),
        image: `${championSkinBaseUrl}/${id}_${skin.num}.jpg`,
      };
    }),
  };
};

const load = async (champion) => {
  loadBasicInfo(champion);
  loadLore(champion);
  loadSkins(champion);
};

const loadBasicInfo = async (champion) => {
  $("#basicInfo").append(
    `<div class="col">
        <img
            src="${champion.image}"
            alt="${champion.name}"
            />
    </div>
    <div class="col-10">
        <div class="row champion-name"><h3>${champion.name}</h3></div>
        <div class="row"><h5 class="text-muted">${champion.title}</h5></div>
    </div>`
  );
};

const loadLore = async (champion) => {
  $("#lore").append(`<p>${champion.lore}</p>`);
};

const loadSkins = async (champion) => {
  champion.skins.forEach((skin, index) => {
    var imageClasses = "carousel-item";

    if (index === 0) {
      imageClasses = "carousel-item active";
    }

    $("#skins").append(
      `<div class="${imageClasses}">
        <img
          class="d-block w-100"
          src="${skin.image}"
          alt="${skin.name}"
        />
        <div class="carousel-caption d-none d-block bg-dark">
            <h5>${skin.name}</h5>
          </div>
      </div>`
    );
  });
};

const updateCurrentUser = (user, championId) => {
  if (user !== undefined) {
    $("#btnAccess").hide();
    $("#account").show();
    $("#email").text(user.email);
    updateFavourite(user, championId);
  } else {
    $("#btnAccess").show();
    $("#account").hide();
    $("#btnAddFavourite").hide();
    $("#btnRemoveFavourite").hide();
  }
};

const updateFavourite = (user, championId) => {
  const championFound = user.favourites.find((id) => id === championId);

  if (championFound !== undefined) {
    $("#btnAddFavourite").hide();
    $("#btnRemoveFavourite").show();
  } else {
    $("#btnAddFavourite").show();
    $("#btnRemoveFavourite").hide();
  }
};

const updateRemoteUser = async (user) => {
  const url = `${usersBaseUrl}/${user.id}`;
  await put(url, user);
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

$(window).on("load", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const championId = urlParams.get("id");

  if (championId == null) {
    window.location.replace(`index.html`);
  }

  const champion = await getChampion(championId);
  load(champion);

  const user = getUserFromSessionStorage();
  updateCurrentUser(user, championId);

  $("#btnAccess").on("click", (event) => {
    event.preventDefault();
    window.location.replace(`access.html?redirect=${window.location.href}`);
  });

  $("#btnLogOut").on("click", (event) => {
    event.preventDefault();
    deleteUserInSessionStorage();
    updateCurrentUser();
  });

  $("#btnAddFavourite").on("click", async (event) => {
    event.preventDefault();
    user.favourites.push(champion.id);

    await updateRemoteUser(user);
    storeUserInSessionStorage(user);
    updateCurrentUser(user, championId);
  });

  $("#btnRemoveFavourite").on("click", async (event) => {
    event.preventDefault();

    const index = user.favourites.indexOf(champion.id);
    if (index >= 0) {
      user.favourites.splice(index);
    }

    await updateRemoteUser(user);
    storeUserInSessionStorage(user);
    updateCurrentUser(user, championId);
  });
});
