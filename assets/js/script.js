const informacion = document.getElementById("contenedor-dbz");
const butBuscador = document.getElementById("buscador-datos");
const link = "https://dragonball-api.com/api/characters";

const info = async (link) => {
  try {
    const res = await fetch(link);
    if (!res.ok) {
      return new Error("Algo anduvo mal");
    }

    const data = res.json();
    return data;
  } catch (error) {
    console.log("Eror", error);
  }
};

butBuscador.addEventListener("click", async () => {
  const personajes = await informacion(link);
  const dataPersonaje = personajes.items;

  console.log(personaje);

  dataPersonaje.forEach((personajes) => {
    informacion.innerHTML += `
      <div class="col-3 pb-2 d-flex justify-content-center" data-id=${personaje.id}>
            <div class="card">
              <img
                class="card-img-top"
                src=${personaje.image}
              />
              <div class="card-body">
                <h5 class="card-title">${personaje.name}</h5>
                <p class="card-text">${personaje.race} - ${personaje.gender}</p>
                <button class="btn btn-success btn-ver-detalles">Ver más</button>
              </div>
            </div>
          </div>
        `;
  });
});
