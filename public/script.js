const form = document.getElementById("apartment-form");
const list = document.getElementById("apartment-list");

// Makes user-typed text safe to put into HTML
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// The HTML for one apartment card
function cardHTML(apt) {
  const photo = apt.image
    ? `<img src="${escapeHTML(apt.image)}" alt="${escapeHTML(apt.name)}">`
    : `<div class="card-img-placeholder">${escapeHTML(apt.name.charAt(0))}</div>`;

  return `
    <div class="card-img">${photo}</div>
    <div class="card-body">
      <h3>${escapeHTML(apt.name)}</h3>
      <p class="card-location">${escapeHTML(apt.address || "Columbia, SC")}</p>
      <div class="card-tags">
        <span>🛏 ${apt.bedrooms} Beds</span>
        <span>📍 ${apt.distance} mi</span>
      </div>
      <p class="price">$${apt.rent.toLocaleString()}</p>
      <p class="card-note">estimated monthly cost</p>
    </div>
  `;
}

// Load apartments from the server, filter them, and show them
async function loadApartments() {
  const res = await fetch("/api/apartments");
  const apartments = await res.json();

  // Read the filter values ("" means "Any")
  const maxRent = document.getElementById("price-filter").value;
  const minBeds = document.getElementById("bed-filter").value;
  const maxDistance = document.getElementById("distance-filter").value;

  // Keep only apartments that match every filter
  const filtered = apartments.filter((apt) => {
    if (maxRent && apt.rent > Number(maxRent)) return false;
    // TODO: bedrooms check (hide if apt.bedrooms is LESS than minBeds)
    // TODO: distance check (hide if apt.distance is MORE than maxDistance)
    return true;
  });

  list.innerHTML = "";
  if (filtered.length === 0) {
    list.innerHTML = "<p class='muted'>No apartments match your filters.</p>";
    return;
  }

  filtered.forEach((apt) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = cardHTML(apt);
    list.appendChild(div);
  });
}

// Add a new apartment when the form is submitted
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const apartment = {
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    image: document.getElementById("image").value,
    rent: Number(document.getElementById("rent").value),
    bedrooms: Number(document.getElementById("bedrooms").value),
    distance: Number(document.getElementById("distance").value),
  };

  await fetch("/api/apartments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apartment),
  });

  form.reset();
  loadApartments();
});

// Re-filter whenever a dropdown changes
document.getElementById("price-filter").addEventListener("change", loadApartments);
// TODO: add the same line for "bed-filter"
// TODO: add the same line for "distance-filter"

loadApartments();