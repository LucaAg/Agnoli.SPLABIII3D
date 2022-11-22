export const obtenerAnunciosMascota = async (url) => {
    let datosRetorno = [];
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`${res.status}-${res.statusText}`);
      }
      const data = await res.json();
      datosRetorno = data;
    } catch (err) {
      console.error(err);
    } finally {
      console.log("todoOk");
      return datosRetorno;
    }
  };
 