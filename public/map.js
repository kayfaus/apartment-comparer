const mapList = document.getElementById("map-list");
const frame = document.getElementById("map-frame");

function showOnMap(query) {
  frame.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`; //added google api to show map of apartment location
}

async function loadMap() {
  showOnMap("University of South Carolina, Columbia, SC");

  const apartments = await getApartments();
  if (apartments.length === 0) {
    mapList.innerHTML = "<p class='muted'>No apartments yet.</p>";
    return;
  }

  mapList.innerHTML = apartments.map((apt) => `
    <button class="side-item" data-query="${escapeHTML(apt.address || apt.name + ", Columbia, SC")}">
      <strong>${escapeHTML(apt.name)}</strong>
      <span>${apt.distance} mi · $${apt.rent.toLocaleString()}</span>
    </button>
  `).join("");
}

mapList.addEventListener("click", (e) => {
  const item = e.target.closest(".side-item");
  if (!item) return;
  mapList.querySelectorAll(".side-item").forEach((b) => b.classList.remove("active"));
  item.classList.add("active");
  showOnMap(item.dataset.query);
});

loadMap();