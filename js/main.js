// Datos de ejemplo: un array de emprendimientos veganos
const businesses = [
  {
    name: "La Huerta Verde",
    description: "Café y comida vegana saludable.",
    location: { lat: 6.2442, lng: -75.5812 },
  },
  {
    name: "Veggie Delights",
    description: "Repostería vegana artesanal.",
    location: { lat: 6.2518, lng: -75.5636 },
  },
  {
    name: "Verde Urbano",
    description: "Comidas rápidas veg-friendly.",
    location: { lat: 6.2272, lng: -75.5736 },
  },
];

console.log("Leaflet:", L);
console.log("Map div:", document.getElementById("map"));

// ---------------- MAPA ----------------
function initializeMap(businesses) {
  const map = L.map("map").setView([6.2442, -75.5812], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  businesses.forEach((business) => {
    const marker = L.marker([business.location.lat, business.location.lng]).addTo(map);

    marker.bindPopup(`
      <strong>${business.name}</strong><br>
      ${business.description}
    `);
  });
  setTimeout(() => {
    map.invalidateSize();
  }, 0);
}

// ---------------- LISTA ----------------
function renderBusinessList() {
  const listEl = document.getElementById("business-list");

  businesses.forEach((business) => {
    const item = document.createElement("li");
    item.className = "business";

    item.innerHTML = `
      <h3>${business.name}</h3>
      <p>${business.description}</p>
    `;

    listEl.appendChild(item);
  });
}

// ---------------- INIT ----------------
function initPage() {
  renderBusinessList();
  initializeMap(businesses);
}

initPage();
