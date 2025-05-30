const informacion = document.getElementById("contenedor-dbz");
const butBuscador = document.getElementById("butBuscador");
const inputBuscador = document.getElementById("inputBuscador");
const urlBase = "https://dragonball-api.com/api/characters";

const modal = new bootstrap.Modal(document.getElementById("modalDetalle"));
const modalContenido = document.getElementById("modalContenido");

// Función para traer datos desde la API
const info = async (link) => {
  try {
    const res = await fetch(link);
    if (!res.ok) throw new Error("Algo anduvo mal");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error", error);
    informacion.innerHTML = `<p class="text-danger">Error al conectar con la API.</p>`;
  }
};

// Mostrar personajes en cards
const mostrarPersonajes = (personajes) => {
  informacion.innerHTML = "";
  if (!personajes || personajes.length === 0) {
    informacion.innerHTML = "<p>No se encontraron personajes.</p>";
    return;
  }

  personajes.forEach((p) => {
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

// Cargar todos los personajes al inicio
const cargarTodos = async () => {
  const data = await info(urlBase);
  if (data && data.items) mostrarPersonajes(data.items);
  else informacion.innerHTML = "<p>Error al cargar personajes.</p>";
};

// Buscar personajes por nombre
const buscarPersonajes = async () => {
  const query = inputBuscador.value.trim();
  if (!query) {
    cargarTodos();
    return;
  }
  const urlBusqueda = `${urlBase}/character/search?name=${encodeURIComponent(query)}`;
  const resultado = await info(urlBusqueda);
  if (resultado && resultado.length > 0) mostrarPersonajes(resultado);
  else informacion.innerHTML = "<p>No se encontraron personajes con ese nombre.</p>";
};

// Mostrar detalle en modal con estilo card
const verMas = async (id) => {
  try {
    const res = await fetch(`${urlBase}/${id}`);
    if (!res.ok) throw new Error("Error al obtener detalles");
    const data = await res.json();

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
  } catch (error) {
    console.log(error);
    modalContenido.innerHTML = `<p class="text-danger">Error al cargar detalles.</p>`;
    modal.show();
  }
};

// Event listeners
document.addEventListener("DOMContentLoaded", cargarTodos);
butBuscador.addEventListener("click", buscarPersonajes);

informacion.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-ver-mas")) {
    const cardPadre = e.target.closest("[data-id]");
    const id = cardPadre?.dataset.id;
    if (id) verMas(id);
  }
});