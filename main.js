const getJokesBtn = document.querySelector(".get-jokes-btn");
const joke = document.querySelector(".joke");
const update = document.querySelector(".update");
const jokeId = document.querySelector(".jokeId");
const jokeCategory = document.querySelector(".joke-category");
const jokeContainer = document.querySelector(".joke-container");
const categories = document.querySelector(".categories");
const like = document.querySelector(".liked");
const randomRadio = document.querySelector('[value="random"]');
const categoriesRadio = document.querySelector('[value="categories"]');
const searchRadio = document.querySelector('[value="search"]');
const searchField = document.querySelector(".searchField");
const favContainer = document.querySelector(".favourites");
//const [randomRadio, categoriesRadio, searchRadio] = document.querySelectorAll('[name="mode"]');
const burgerBtn = document.querySelector(".fav-nav");
const glass = document.querySelector(".glass");
const likeSvg =
  '<svg id="Layer_1" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path class="fill" d="m446.51 84.39a134.8 134.8 0 0 1 0 190.65l-190.37 192.06-190.66-190.65a134.8 134.8 0 0 1 189.79-191.47l.59-.59a134.8 134.8 0 0 1 190.65 0z" fill="transparent"/><path d="m351.185 38.9a139.778 139.778 0 0 0 -95.969 37.773 140.782 140.782 0 0 0 -193.982 4.891c-54.89 54.891-54.89 144.221 0 199.133l190.666 190.647a6 6 0 0 0 4.242 1.757h.014a6 6 0 0 0 4.247-1.777l190.346-192.042a140.816 140.816 0 0 0 -99.564-240.382zm91.061 231.915-186.121 187.785-186.404-186.388c-50.213-50.232-50.214-131.95 0-182.162a128.771 128.771 0 0 1 181.346-.8 6 6 0 0 0 8.451-.034l.587-.588a128.808 128.808 0 1 1 182.141 182.186z" fill="#FF6767"/></svg>';

const defaultData = {
  categories: [],
  icon_url: "https://assets.chucknorris.host/img/avatar/chuck-norris.png",
  id: "WELL, THIS IS A MISTAKE ON YOUR PART",
  updated_at: "2020",
  categories: ["SUFFERING"],
  url: "WELL, THIS IS A MISTAKE ON YOUR PART",
  value:
    "There is no jokes about this. And now Almighty Chuck Norris is looking for you. You should be scared for your life! Good luck!",
};

//Event listeners
burgerBtn.addEventListener("click", toggleMenu);

glass.addEventListener("click", (e) => {
  if (e.target === glass) {
    toggleMenu();
  }
});

randomRadio.addEventListener("change", () => {
  if (randomRadio.checked) {
    categories.classList.add("zero-height");
    categories.ontransitionend = () => {
      categories.classList.add("hidden");
      categories.ontransitionend = null;
    };

    searchField.classList.add("hidden");
  }
});

categoriesRadio.addEventListener("change", () => {
  if (categoriesRadio.checked) {
    categories.classList.remove("hidden");
    searchField.classList.add("hidden");
    showCategories();
    setTimeout(() => categories.classList.remove("zero-height"), 5);
  }
});

searchRadio.addEventListener("change", () => {
  if (searchRadio.checked) {
    categories.classList.add("zero-height");
    categories.ontransitionend = () => {
      categories.classList.add("hidden");
      categories.ontransitionend = null;
    };

    searchField.classList.remove("hidden");
  }
});

getJokesBtn.addEventListener("click", () => {
  getJokes();
});

searchField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getJokes();
  }
});

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getJokes();
  }
});

//favourites array for local storage
const favourites = JSON.parse(localStorage.favourites || "[]");

favContainer.append(...favourites.map(buildJoke));

//Functions
function handleLike(event, data) {
  if (event.target.checked) {
    favourites.push(data);
    favContainer.append(buildJoke(data));
  } else {
    favourites.splice(
      favourites.findIndex((joke) => joke.id === data.id),
      1
    );
    const joke = [...favContainer.querySelectorAll("a")]
      .find((a) => a.innerText === data.id)
      .closest(".wrapper");
    joke.classList.add("transparent");
    joke.addEventListener("transitionend", () => joke.remove());
    if (event.path.includes(favContainer)) {
      const joke = [...jokeContainer.querySelectorAll("a")].find(
        (a) => a.innerText === data.id
      );
      if (joke) {
        joke.closest(".wrapper").querySelector("input").checked = false;
      }
    }
  }
  localStorage.favourites = JSON.stringify(favourites);
}

function getJokes(e) {
  let url = "https://api.chucknorris.io/jokes/";
  const mode = document.querySelector('[name="mode"]:checked').value;
  if (mode === "random") {
    url += "random";
  } else if (mode === "categories") {
    const category = document.querySelector('[name="cat"]:checked').value;
    url += `random?category=${category}`;
  } else {
    url += `search?query=${searchField.value}`;
  }
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      jokeContainer.innerHTML = "";
      if (mode === "search") {
        if (!data.result.length) {
          data.result.push(defaultData);
        }
        jokeContainer.append(...data.result.map(buildJoke));
      } else {
        jokeContainer.append(buildJoke(data));
      }
      jokeContainer.classList.remove("hidden");
    })
    .catch(function (err) {
      console.log(err);
    });
}

function showCategories(e) {
  fetch("https://api.chucknorris.io/jokes/categories")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      let categories = "";
      data.forEach((category) => {
        categories += `<li><label class="cat"><input hidden type="radio" name="cat" value="${category}"><span>${category}</span></label></li>`;
      });
      document.querySelector(".categories").innerHTML = categories;
    })
    .catch(function (err) {
      console.log(err);
    });
}

function highlightQuery(string, query) {
  return string.replace(new RegExp(`(${query})`), "<b>$1</b>");
}

function buildJoke(data) {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper transparent";
  const jokeId = document.createElement("div");
  jokeId.className = "joke-id";
  jokeId.innerHTML = `ID: <a href="${data.url}">${data.id}</a>`;
  const joke = document.createElement("div");
  joke.className = "joke";
  const mode = document.querySelector('[name="mode"]:checked').value;
  if (mode === "search") {
    joke.innerHTML = highlightQuery(data.value, searchField.value);
  } else {
    joke.innerText = data.value;
  }
  const like = document.createElement("label");
  like.className = "like";
  like.innerHTML = likeSvg;
  const likeBtn = document.createElement("input");
  likeBtn.type = "checkbox";
  likeBtn.hidden = true;
  if (favourites.some((joke) => joke.id === data.id)) {
    likeBtn.checked = true;
  }
  like.prepend(likeBtn);
  likeBtn.addEventListener("change", (e) => {
    handleLike(e, data);
  });
  const jokeInfo = document.createElement("div");
  jokeInfo.className = "joke-info";
  const jokeUpdate = document.createElement("div");
  jokeUpdate.className = "update";
  //getting the update time
  const today = Date();
  jokeUpdate.innerText = `Last update: ${calcHoursPassed(
    data.updated_at
  )} hours ago`;
  jokeInfo.append(jokeUpdate);
  if (data.categories[0]) {
    const jokeCategory = document.createElement("div");
    jokeCategory.className = "joke-category";
    jokeCategory.innerText = data.categories[0];
    jokeInfo.append(jokeCategory);
  }
  wrapper.append(jokeId, joke, like, jokeInfo);

  setTimeout(() => wrapper.classList.remove("transparent"), 5);

  return wrapper;
}

function toggleMenu() {
  glass.classList.toggle("clean");
  glass.classList.toggle("nav-active");
  burgerBtn.classList.toggle("cross");
}

function calcHoursPassed(dateTime) {
  return Math.trunc((new Date() - new Date(dateTime)) / 36e5);
}
