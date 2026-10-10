const favList = document.getElementById("favorites-list");

async function loadFavorites() {
  const apartments = await getApartments();
  const favorites = apartments.filter((apt) => apt.favorite);

  if (favorites.length === 0) {
    favList.innerHTML = "<p class='muted'>No favorites yet. Tap the ♡ on the Home page to save one.</p>";
    return;
  }

  favList.innerHTML = "";
  favorites.forEach((apt) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = cardHTML(apt);
    favList.appendChild(div);
  });
}

favList.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("heart")) return;
  await toggleFavorite(e.target.dataset.id);
  loadFavorites();
});

loadFavorites();