const informacion = document.getElementById("contenedor-dbz");
const inputBuscador = document.getElementById("inputBuscador");
const butBuscador = document.getElementById("butBuscador");

const urlBase = "https://dragonball-api.com/api/characters";
const modal = new bootstrap.Modal(document.getElementById("modalDetalle"));
const modalContenido = document.getElementById("modalContenido");

let currentPage = 1;
let isLoading = false;
let hasMore = true;
let isSearching = false;

// Función para traer datos desde la API
const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al conectar con la API");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Mostrar cards
const mostrarPersonajes = (lista) => {
  lista.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3";
    col.dataset.id = p.id;

    col.innerHTML = `
      <div class="card h-100">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">${p.race} / ${p.gender}</p>
          <button class="btn btn-primary btn-ver-mas mt-auto">Ver Más</button>
        </div>
      </div>
    `;
    informacion.appendChild(col);
  });
};

// Cargar personajes paginados
const cargarPersonajes = async () => {
  if (isLoading || !hasMore || isSearching) return;
  isLoading = true;

  const url = `${urlBase}?page=${currentPage}`;
  const data = await fetchData(url);

  if (data && data.items && data.items.length > 0) {
    mostrarPersonajes(data.items);
    currentPage++;
  } else {
    hasMore = false;
  }

  isLoading = false;
};

// Buscar por nombre
const buscarPersonajes = async () => {
  const nombre = inputBuscador.value.trim();
  informacion.innerHTML = "";
  currentPage = 1;
  hasMore = false;
  isSearching = true;

  if (!nombre) {
    isSearching = false;
    hasMore = true;
    cargarPersonajes();
    return;
  }

  const url = `${urlBase}/character/search?name=${encodeURIComponent(nombre)}`;
  const data = await fetchData(url);

  if (data && data.length > 0) {
    mostrarPersonajes(data);
  } else {
    informacion.innerHTML = "<p>No se encontraron personajes.</p>";
  }

  isLoading = false;
};

// Mostrar detalles en modal
const verMas = async (id) => {
  const data = await fetchData(`${urlBase}/${id}`);
  if (!data) return;

  modalContenido.innerHTML = `
    <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4 text-center p-3">
          <img src="${data.image}" class="img-fluid rounded" alt="${data.name}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${data.name}</h5>
            <p><strong>Raza:</strong> ${data.race}</p>
            <p><strong>Género:</strong> ${data.gender}</p>
            <p><strong>Descripción:</strong> ${data.description || "Sin descripción disponible"}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.show();
};

// Scroll infinito
window.addEventListener("scroll", () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
  if (nearBottom) {
    cargarPersonajes();
  }
});

// Eventos
document.addEventListener("DOMContentLoaded", cargarPersonajes);
butBuscador.addEventListener("click", buscarPersonajes);

informacion.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-ver-mas")) {
    const id = e.target.closest("[data-id]").dataset.id;
    if (id) verMas(id);
  }
});