const informacion = document.getElementById("contenedor-dbz");
const butBuscador = document.getElementById("butBuscador");
const url = "https://dragonball-api.com/api/characters";

const info = async (link) => {
  try {
    const res = await fetch(link);
    if (!res.ok) {
      throw new Error("Algo anduvo mal");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Eror", error);
  }
};

const verMas = async (id) => {
  try {
    const res = await fetch(`${url}/${id}`);

    if (!res.ok) {
      throw new Error("Algo no anduvo");
    }

    const data = await res.json();

    alert(data.description);
  } catch (error) {
    console.log("Error ", error);
  }
}

butBuscador.addEventListener("click", async () => {
  informacion.innerHTML = ""; // Limpia contenido anterior

  const personajes = await info(url);
  const dataPersonaje = personajes.items;

  dataPersonaje.forEach((personaje) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <div class="card">
        <img src="${personaje.image}" class="card-img-top" alt="${personaje.name}">
        <div class="card-body">
          <h5 class="card-title">${personaje.name}</h5>
          <p class="card-text">${personaje.race} / ${personaje.gender}</p>
          <button class="btn btn-primary btn-ver-mas">Ver Más</button>
        </div>
      </div>
    `;

    informacion.appendChild(col);
  });
});

informacion.addEventListener("click", (e)=>{
  if (e.target.classList.contains("btn-ver-mas")){
  const cardPadre = e.target.closest(".col-3");
  const id = cardPadre.dataset.id;

  verMas(id)
}


})