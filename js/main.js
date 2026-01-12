// ---------- FIREBASE ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------- MAPA ----------
function initializeMap(businesses) {
  const map = L.map("map").setView([4.711, -74.0721], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

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

  L.control
    .layers(null, {
      Emprendimientos: layers.emprendimientos,
      "Eventos culturales": layers.eventos,
      Servicios: layers.servicios,
    })
    .addTo(map);
}

// ---------- LISTA ----------
function renderBusinessList(businesses) {
  const listEl = document.getElementById("business-list");
  listEl.innerHTML = "";

  businesses.forEach((b) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${b.name}</strong><br>${b.description}`;
    listEl.appendChild(li);
  });
}

// ---------- FIRESTORE ----------
async function loadBusinesses() {
  const snapshot = await getDocs(collection(db, "businesses"));
  return snapshot.docs.map((doc) => doc.data());
}

async function saveBusiness(item) {
  await addDoc(collection(db, "businesses"), item);
}

// ---------- INIT ----------
async function initPage() {
  const businesses = await loadBusinesses();
  renderBusinessList(businesses);
  initializeMap(businesses);
}

document.addEventListener("DOMContentLoaded", initPage);
