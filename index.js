
const menuIcon = document.querySelector(".menu-icon");
const dropdown = document.querySelector(".dropdown");

menuIcon.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
  if (!menuIcon.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

function updateNavUser() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navUsername = document.getElementById("nav-username");
  const navProfileImg = document.getElementById("nav-profile-img");

  if (currentUser) {
    if (navUsername) navUsername.textContent = currentUser.username;
    if (navProfileImg) navProfileImg.src = currentUser.profilePic || "./default-avatar.png";
    document.querySelector(".login-btns").style.display = "none";
    document.querySelector(".user-info").style.display = "flex";
  } else {

    if (navUsername) navUsername.textContent = "";
    if (navProfileImg) navProfileImg.src = "./default-avatar.png";
    document.querySelector(".login-btns").style.display = "flex";
    document.querySelector(".user-info").style.display = "none";
  }
}
updateNavUser();
window.addEventListener("storage", (e) => {
  if (e.key === "currentUser") {
    updateNavUser();
  }
});




const searchInput = document.querySelector(".search-box input");
const searchBtn = document.querySelector(".my-icon");
const recipesContainer = document.getElementById("recipes-container");
const recentList = document.getElementById("recent-list");
const heroRecent = document.getElementById("hero-recent");

const currentUserJSON = localStorage.getItem("currentUser");
const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
if (!currentUser) {
  recipesContainer.innerHTML = "<p>Please log in to search recipes.</p>";
}


const recentKey = currentUser ? `recentSearches_${currentUser.username}` : null;
const bookmarksKey = currentUser ? `bookmarks_${currentUser.username}` : null;


let recentSearches = recentKey ? JSON.parse(localStorage.getItem(recentKey)) || [] : [];

function renderRecentSearches() {
  if (!recentList || !heroRecent) return;

  if (!recipesContainer || recipesContainer.children.length > 0) {
    heroRecent.style.display = "none";
    return;
  }

  recentList.innerHTML = "";

  if (!recentSearches || recentSearches.length === 0) {
    heroRecent.style.display = "none";
    return;
  }

  heroRecent.style.display = "flex";

  recentSearches.forEach(search => {
    const li = document.createElement("li");
    li.textContent = search;
    li.addEventListener("click", () => {
      searchInput.value = search;
      performSearch(search);
    });
    recentList.appendChild(li);
  });
}

function addRecentSearch(term) {
  if (!term || !recentKey) return;

  if (!recentSearches.includes(term)) {
    recentSearches.unshift(term);
    if (recentSearches.length > 5) recentSearches.pop();
    localStorage.setItem(recentKey, JSON.stringify(recentSearches));
  }
}


async function performSearch(query) {
  if (!query || !currentUser) return;

  addRecentSearch(query);
  recipesContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();
    recipesContainer.innerHTML = "";

    if (!data.meals) {
      recipesContainer.innerHTML = "<p>No recipes found!</p>";
      renderRecentSearches();
      return;
    }

    data.meals.forEach(meal => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");

      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) ingredients.push(`${ingredient} - ${measure}`);
      }

      card.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <h4>Ingredients:</h4>
                <ul>${ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
                <h4>Instructions:</h4>
                <p>${meal.strInstructions}</p>
                <button class="bookmark-btn"><i class="fa-regular fa-bookmark"></i>Bookmark</button>
                  <button class="remove-card-btn"><i class="fa-solid fa-x"></i>Remove</button>
            `;


      const bookmarkBtn = card.querySelector(".bookmark-btn");
      bookmarkBtn.addEventListener("click", () => {
        let bookmarks = JSON.parse(localStorage.getItem(bookmarksKey)) || [];
        const alreadyBookmarked = bookmarks.some(b => b.id === meal.idMeal);

        if (!alreadyBookmarked) {
          bookmarks.push({
            id: meal.idMeal,
            name: meal.strMeal,
            image: meal.strMealThumb,
            instructions: meal.strInstructions,
            ingredients
          });
          localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
          alert("Recipe bookmarked!");
        } else {
          alert("Recipe already bookmarked!");
        }
      });


      const removeBtn = card.querySelector(".remove-card-btn");
      removeBtn.addEventListener("click", () => {
        card.remove();
      });

      recipesContainer.appendChild(card);
    });

    heroRecent.style.display = "none";
  } catch (err) {
    console.error(err);
    recipesContainer.innerHTML = "<p>Error fetching recipes.</p>";
    renderRecentSearches();
  }
}


searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) performSearch(query);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) performSearch(query);
  }
});

renderRecentSearches();
