const informacion = document.getElementById("contenedor-dbz");
const butBuscador = document.getElementById("butBuscador");
const url = "https://dragonball-api.com/api/characters";

const info = async (link) => {
  try {
    const res = await fetch(link);
    if (!res.ok) {
      throw new Error("Algo anduvo mal");
    }

    const data = res.json();
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
  const personajes = await info(url);
  const dataPersonaje = personajes.items;

  console.log(dataPersonaje);

  dataPersonaje.forEach((personaje) => {
    informacion.innerHTML += `
    <div class="col-3" data-id=${personaje.id}>
                <img
                class="card-img-top"
                src=${personaje.image}
                />
                <h2>${personaje.name}</h2>
                <p>${personaje.race} / ${personaje.gander}</p>
                <button class="btn-ver-mas">Ver Mas</button>   
                </div>
        `;
  });
});

informacion.addEventListener("click", (e)=>{
  if (e.target.classList.contains("btn-ver-mas")){
  const cardPadre = e.target.closest(".col-3");
  const id = cardPadre.dataset.id;

  verMas(id)
}


})