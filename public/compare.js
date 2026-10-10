const picker = document.getElementById("picker");
const table = document.getElementById("compare-table");
const MAX = 6;
let favorites = [];

async function init() {
  const apartments = await getApartments();
  favorites = apartments.filter((apt) => apt.favorite);

  if (favorites.length === 0) {
    picker.innerHTML = "<p class='muted'>No favorites yet. Tap the ♡ on the Home page first.</p>";
    return;
  }

  picker.innerHTML = favorites.map((apt) => `
    <label class="pick">
      <input type="checkbox" value="${apt._id}"> ${escapeHTML(apt.name)}
    </label>
  `).join("");
}

picker.addEventListener("change", (e) => {
  const checked = picker.querySelectorAll("input:checked");
  if (checked.length > MAX) {
    e.target.checked = false;
    alert(`You can compare up to ${MAX} apartments.`);
    return;
  }
  const selected = [...checked].map((box) => favorites.find((a) => a._id === box.value));
  renderTable(selected);
});

function renderTable(selected) {
  if (selected.length === 0) {
    table.innerHTML = "";
    return;
  }

  const cheapest = Math.min(...selected.map((a) => a.rent));
  const closest = Math.min(...selected.map((a) => a.distance));

  // [row label, how to show the value, which one is "best" (highlighted)]
  const rows = [
    ["Monthly rent", (a) => `$${a.rent.toLocaleString()}`, (a) => a.rent === cheapest],
    ["Bedrooms", (a) => a.bedrooms],
    ["Rent per bedroom", (a) => a.bedrooms ? `$${Math.round(a.rent / a.bedrooms).toLocaleString()}` : "—"],
    ["Distance to campus", (a) => `${a.distance} mi`, (a) => a.distance === closest],
    ["Est. walk time", (a) => `${Math.round(a.distance * 20)} min`],
  ];

  table.innerHTML = `
    <tr>
      <th></th>
      ${selected.map((a) => `<th>${escapeHTML(a.name)}</th>`).join("")}
    </tr>
    ${rows.map(([label, value, isBest]) => `
      <tr>
        <td class="row-label">${label}</td>
        ${selected.map((a) => `<td class="${isBest && isBest(a) ? "best" : ""}">${value(a)}</td>`).join("")}
      </tr>
    `).join("")}
  `;
}

init();