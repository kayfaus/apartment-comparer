const aptList = document.getElementById("review-apartments");
const nameEl = document.getElementById("selected-name");
const avgEl = document.getElementById("avg-rating");
const reviewForm = document.getElementById("review-form");
const reviewList = document.getElementById("review-list");
let selectedId = null;

function stars(n) {
  const r = Math.round(n);
  return "★".repeat(r) + "☆".repeat(5 - r);
}

async function loadApartmentList() {
  const apartments = await getApartments();
  if (apartments.length === 0) {
    aptList.innerHTML = "<p class='muted'>No apartments yet.</p>";
    return;
  }
  aptList.innerHTML = apartments.map((apt) => `
    <button class="side-item" data-id="${apt._id}" data-name="${escapeHTML(apt.name)}">
      <strong>${escapeHTML(apt.name)}</strong>
      <span>${apt.distance} mi from campus</span>
    </button>
  `).join("");
}

aptList.addEventListener("click", (e) => {
  const item = e.target.closest(".side-item");
  if (!item) return;
  aptList.querySelectorAll(".side-item").forEach((b) => b.classList.remove("active"));
  item.classList.add("active");

  selectedId = item.dataset.id;
  nameEl.textContent = item.dataset.name;
  reviewForm.hidden = false;
  loadReviews();
});

async function loadReviews() {
  const res = await fetch(`/api/reviews?apartment=${selectedId}`);
  const reviews = await res.json();

  if (reviews.length === 0) {
    avgEl.textContent = "No reviews yet. Be the first!";
    reviewList.innerHTML = "";
    return;
  }

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  avgEl.textContent = `${stars(avg)} ${avg.toFixed(1)} (${reviews.length} review${reviews.length === 1 ? "" : "s"})`;

  reviewList.innerHTML = reviews.map((r) => `
    <div class="card">
      <strong>${escapeHTML(r.author)}</strong>
      <span class="stars">${stars(r.rating)}</span>
      <p>${escapeHTML(r.comment)}</p>
      <p class="muted">${new Date(r.createdAt).toLocaleDateString()}</p>
    </div>
  `).join("");
}

reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apartment: selectedId,
      author: document.getElementById("author").value,
      rating: Number(document.getElementById("rating").value),
      comment: document.getElementById("comment").value,
    }),
  });

  reviewForm.reset();
  loadReviews();
});

loadApartmentList();