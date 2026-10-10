const form = document.getElementById("apartment-form");
const list = document.getElementById("apartment-list");

async function loadApartments() {
  const apartments = await getApartments();

  list.innerHTML = "";
  if (apartments.length === 0) {
    list.innerHTML = "<p class='muted'>No apartments yet. Add one above.</p>";
    return;
  }

  apartments.forEach((apt) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = cardHTML(apt);
    list.appendChild(div);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const apartment = {
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
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

list.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("heart")) return;
  await toggleFavorite(e.target.dataset.id);
  loadApartments();
});

loadApartments();