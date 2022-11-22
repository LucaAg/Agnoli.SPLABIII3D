import { activarSpinner, desactivarSpinner } from "./tablaDinamica.js";
import { cargarFormulario, mostrarBotones } from "./main.js";

export function obtenerDatosMascotas (url){ 
    return new Promise((res,rej)=>{
      const xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", () => {
          if (xhr.readyState == 4) {
              if (xhr.status >= 200 && xhr.status < 300) {
                  const data = JSON.parse(xhr.responseText);
                  res(data);
              } else {
                  rej.error(`Error: ${xhr.status} - ${xhr.statusText}`)
              }
          }
      });               
      xhr.open("GET", url);    
      xhr.send();
    });     
} 


export const obtenerMascota = (url,id) => {
    activarSpinner();
  
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          cargarFormulario(data);
          mostrarBotones();
        } else {
          console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
        }
        desactivarSpinner();
      }
    });
    xhr.open("GET", url + "/" + id);
    xhr.send();
  };

  //ASYNC1
  export  const borrarMascota = async (url,id) => {
    activarSpinner();
  
    const respo = await fetch(url + `/${id}`, {
      method: "DELETE",
    })
      .then((res) =>
         res.ok ? res.json() : Promise.reject(`Error: ${res.status} - ${res.statusText}`)
      )
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        desactivarSpinner();
      });
  };

export const crearMascota = (url,nuevaMascota) => {
    const xhr = new XMLHttpRequest();
    activarSpinner();
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          console.log(data);
        } else {
          console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
        }       
      }
    });
    desactivarSpinner();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(nuevaMascota));
  };

  //ASYNC 2
  export const modificarMascota = async (url,mascota) => {
    activarSpinner();
    const resp = await axios(url + "/" + mascota.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(mascota),
    })
      .then(({ data }) => {
        console.log(`Mascota modificada: ${data}`);
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        desactivarSpinner();
        console.log("finally");
      });
  };  
