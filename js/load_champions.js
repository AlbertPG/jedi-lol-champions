const championsUrl =
  "https://ddragon.leagueoflegends.com/cdn/11.14.1/data/en_US/champion.json";

const championImageBaseUrl =
  "https://ddragon.leagueoflegends.com/cdn/11.14.1/img/champion";

const getAllChampions = async () => {
  const champions = (await get(championsUrl)).data;
  return Object.keys(champions).map((name) => {
    const champion = champions[name];
    return {
      id: champion.id,
      name: champion.name,
      title: champion.title,
      image: `${championImageBaseUrl}/${champion.id}.png`,
    };
  });
};

const load = async (champion) => {
  $("#championList").append(
    `<div class="col-md-3 text-center my-auto">
      <a class="card card-block d-flex align-items-center" href="champion.html?id=${champion.id}">
        <img src="${champion.image}" class="card-img-top champion-image" alt="${champion.name}">
        <div class="card-body">
          <h5 class="card-title">${champion.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${champion.title}</h6>
        </div>
      </a>
    </div>`
  );
};

const loadChampions = async (champions) => {
  $("#championList").empty();
  champions.forEach((champion) => {
    load(champion);
  });
};

const updateCurrentUser = (user) => {
  if (user !== undefined) {
    $("#btnAccess").hide();
    $("#account").show();
    $("#email").text(user.email);

    if (user.favourites.length == 0) {
      $("#favourites").hide();
    } else {
      $("#favourites").show();
    }
  } else {
    $("#btnAccess").show();
    $("#account").hide();
    $("#favourites").hide();
  }
};

$(window).on("load", async () => {
  const champions = await getAllChampions();
  loadChampions(champions);

  const user = getUserFromSessionStorage();
  updateCurrentUser(user);

  $("#btnAccess").on("click", (event) => {
    event.preventDefault();
    window.location.replace(`access.html?redirect=${window.location.href}`);
  });

  $("#btnLogOut").on("click", (event) => {
    event.preventDefault();
    deleteUserInSessionStorage();
    updateCurrentUser();
  });

  var isShowingFavourites = false;
  $("#isShowingFavourites").change(() => {
    isShowingFavourites = !isShowingFavourites;

    if (isShowingFavourites && user !== undefined) {
      const favouriteChampions = champions.filter((champion) => {
        return user.favourites.includes(champion.id);
      });

      loadChampions(favouriteChampions);
    } else {
      loadChampions(champions);
    }
  });
});
