
const bookmarksContainer = document.getElementById("bookmarks-container");


const currentUserJSON = localStorage.getItem("currentUser");
const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;

if (!currentUser) {
    bookmarksContainer.innerHTML = "<p>Please log in to see your bookmarks.</p>";
} else {
    const bookmarksKey = `bookmarks_${currentUser.username}`;
    let bookmarks = JSON.parse(localStorage.getItem(bookmarksKey)) || [];

    function renderBookmarks() {
        bookmarksContainer.innerHTML = "";

        if (bookmarks.length === 0) {
            bookmarksContainer.innerHTML = "<p>No bookmarks yet!</p>";
            return;
        }

        bookmarks.forEach(meal => {
            const card = document.createElement("div");
            card.classList.add("recipe-card");

            card.innerHTML = `
                <img src="${meal.image}" alt="${meal.name}">
                <h3>${meal.name}</h3>
                <h4>Ingredients:</h4>
                <ul>${meal.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
                <h4>Instructions:</h4>
                <p>${meal.instructions}</p>
                <button class="remove-btn"><i class="fa-solid fa-x"></i>Remove</button>
            `;

            const removeBtn = card.querySelector(".remove-btn");
            removeBtn.addEventListener("click", () => {
                bookmarks = bookmarks.filter(b => b.id !== meal.id);
                localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
                renderBookmarks();
            });

            bookmarksContainer.appendChild(card);
        });
    }

    renderBookmarks();
}
