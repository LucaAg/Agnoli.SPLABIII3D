import  {crearAnuncio }  from "./anuncio_Mascota.js";
import {obtenerAnunciosMascota} from "./controllerFetch.js";
const URL = "http://localhost:3000/mascotas";
const $divAnuncio = document.getElementById("divAnuncio");
let $animales = [];

async function cargarAnuncios()
{
    const dataMascota = await obtenerAnunciosMascota(URL);
        $animales = dataMascota;
        $animales.forEach(mascota => {
            const articuloAnuncio = crearAnuncio(mascota);
            $divAnuncio.appendChild(articuloAnuncio);});
}
cargarAnuncios();
