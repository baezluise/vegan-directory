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

// --------------------------------------------------
// CONFIGURAR FORMULARIO PARA AGREGAR NUEVOS LUGARES
// --------------------------------------------------
function setupForm() {
  // 1. Obtenemos el botón "Agregar" desde el DOM
  const btn = document.getElementById("addBtn");

  // 2. Escuchamos el evento click del botón
  btn.addEventListener("click", async () => {
    // 3. Construimos el objeto que se va a guardar
    //    Debe coincidir con la estructura usada en el mapa
    const newItem = {
      // Nombre del lugar (quitamos espacios extra)
      name: document.getElementById("name").value.trim(),

      // Descripción del lugar
      description: document.getElementById("description").value.trim(),

      // Categoría seleccionada (emprendimientos / eventos / servicios)
      category: document.getElementById("category").value,

      // Latitud convertida a número
      lat: parseFloat(document.getElementById("lat").value),

      // Longitud convertida a número
      lng: parseFloat(document.getElementById("lng").value),
    };

    // 4. Validación mínima para evitar datos rotos
    if (
      !newItem.name || // nombre vacío
      isNaN(newItem.lat) || // latitud inválida
      isNaN(newItem.lng) // longitud inválida
    ) {
      alert("Por favor completa los datos correctamente");
      return; // detenemos la ejecución
    }

    // 5. Guardamos el nuevo lugar en Firestore
    //    Esto hace que TODOS los usuarios puedan verlo
    await saveBusiness(newItem);

    // 6. Recargamos la página
    //    Forma simple y estable de refrescar mapa y lista
    location.reload();
  });
}

// ---------- INIT ----------
// --------------------------------------------------
// FUNCIÓN PRINCIPAL DE ARRANQUE DE LA APP
// --------------------------------------------------
async function initPage() {
  // 1. Cargamos todos los negocios desde Firestore
  //    Incluye lo que otros usuarios agregaron
  const businesses = await loadBusinesses();

  // 2. Renderizamos la lista en el HTML
  renderBusinessList(businesses);

  // 3. Inicializamos el mapa con los datos cargados
  initializeMap(businesses);

  // 4. Activamos el formulario
  setupForm();
}

// 5. Nos aseguramos de que el DOM esté listo
document.addEventListener("DOMContentLoaded", initPage);
