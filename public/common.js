// Makes user-typed text safe to put into HTML
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// The HTML inside one apartment card
function cardHTML(apt) {
  return `
    <button class="heart" data-id="${apt._id}" title="Favorite">${apt.favorite ? "♥" : "♡"}</button>
    <h3>${escapeHTML(apt.name)}</h3>
    <p class="muted">${escapeHTML(apt.address || "Columbia, SC")}</p>
    <p>${apt.bedrooms} Beds · ${apt.distance} mi to campus</p>
    <p class="price">$${apt.rent.toLocaleString()}</p>
    <p class="muted">estimated monthly cost</p>
  `;
}

async function getApartments() {
  const res = await fetch("/api/apartments");
  return res.json();
}

async function toggleFavorite(id) {
  await fetch(`/api/apartments/${id}/favorite`, { method: "PATCH" });
}

// Build the navbar on every page
(function buildNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  const links = [
    ["index.html", "Home"],
    ["favorites.html", "Favorites"],
    ["compare.html", "Compare"],
    ["map.html", "Map"],
    ["reviews.html", "Reviews"],
  ];
  document.getElementById("nav").innerHTML = `
    <header class="navbar">
      <a href="index.html" class="logo">Carolina Cribs</a>
      <nav>
        ${links.map(([href, label]) =>
          `<a href="${href}" class="${href === page ? "active" : ""}">${label}</a>`
        ).join("")}
      </nav>
      <a href="index.html#add" class="gold-btn">Get Started</a>
    </header>
  `;
})();