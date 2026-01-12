// Datos de ejemplo: un array de emprendimientos veganos
const businesses = [
  {
    name: "La Huerta Verde",
    description: "Café y comida vegana saludable",
    lat: 4.7105,
    lng: -74.0703,
    category: "emprendimientos",
  },
  {
    name: "Feria Vegana Bogotá",
    description: "Evento cultural mensual",
    lat: 4.72,
    lng: -74.065,
    category: "eventos",
  },
  {
    name: "Nutricionista Vegana",
    description: "Asesorías personalizadas",
    lat: 4.705,
    lng: -74.075,
    category: "servicios",
  },
];

console.log("Leaflet:", L);
console.log("Map div:", document.getElementById("map"));

// ---------------- MAPA ----------------
function initializeMap(businesses) {
  const map = L.map("map").setView([4.711, -74.0721], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // Capas por categoría
  const layers = {
    emprendimientos: L.layerGroup().addTo(map),
    eventos: L.layerGroup().addTo(map),
    servicios: L.layerGroup().addTo(map),
  };

  businesses.forEach((item) => {
    if (!layers[item.category]) return;

    L.marker([item.lat, item.lng])
      .bindPopup(`<strong>${item.name}</strong><br>${item.description}`)
      .addTo(layers[item.category]);
  });

  // Control para activar/desactivar categorías
  L.control
    .layers(null, {
      Emprendimientos: layers.emprendimientos,
      "Eventos culturales": layers.eventos,
      Servicios: layers.servicios,
    })
    .addTo(map);
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
