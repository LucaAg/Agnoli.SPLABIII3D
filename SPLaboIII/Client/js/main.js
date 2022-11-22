import { crearTabla, activarSpinner, desactivarSpinner } from "./tablaDinamica.js";
import  {Anuncio_Mascota}  from "./anuncio_Mascota.js";
import { obtenerDatosMascotas, borrarMascota, crearMascota, modificarMascota, obtenerMascota } from "./controller.js";
import { validarCampoVacio, validarPrecio, validarIngresoVacio,validarCantidadCaracteres } from "./validaciones.js";

//localStorage.clear();
const $divTabla = document.querySelector("#divTabla");
let $animales = [];
const $formAnimales = document.forms[0];
const $controlesValidar = $formAnimales.elements;
const $filtroCheckTabla = document.getElementById("filtroTabla");
const $promedio = document.getElementById("promedio");
const $checkboxTabla = document.getElementsByClassName("cbox");
const $filtroTabla = document.getElementById("filtro");
const URL = "http://localhost:3000/mascotas";
mostrarBotones();
limpiarFiltros();


async function getMascotaTabla (url)
{
    const datosMascota = await obtenerDatosMascotas(url);
    $animales = datosMascota;
    actualizarTabla($animales);  
}

export function mostrarBotones(){
    const {txtId} = $formAnimales;
    const $btnModificarAgregar = document.getElementById("btnAgregarModificar");
    const $btnEliminar = document.getElementById("btnEliminar");
    const $btnLimpiar = document.getElementById("btnLimpiar");
    if(txtId.value != "")
    {  
        $btnModificarAgregar.setAttribute("value","Modificar");   
        $btnLimpiar.classList.remove("hidden");
        $btnEliminar.classList.remove("hidden");   
    }
    else{
        $btnModificarAgregar.setAttribute("value","Agregar");        
        $btnEliminar.classList.add("hidden");
        $btnLimpiar.classList.add("hidden");
    }
}

document.addEventListener("click", (e)=>{
    if(e.target.matches("td"))
    {
        const emisor = e.target;
        let id = parseInt(emisor.parentElement.dataset.id); 
  
        obtenerMascota(URL,id);

    }
    else if(e.target.matches("#btnEliminar"))
    {
        borrarMascota(URL,parseInt($formAnimales.txtId.value));
        $formAnimales.reset();
        mostrarBotones();
    }
    else if(e.target.matches("#btnLimpiar")){
        Limpiar();
        mostrarBotones();
    }
});

export function cargarFormulario(animal){
    const {txtId,txtTitulo,txtDescripcion,txtTipoAnimal,txtPrecio,txtRaza,txtFecha,txtVacuna} = $formAnimales;
    
    txtId.value = animal.id;
    txtTitulo.value = animal.titulo;
    txtDescripcion.value = animal.descripcion;
    txtTipoAnimal.value = animal.tipo;
    txtPrecio.value = animal.precio;
    txtRaza.value = animal.raza;
    txtFecha.value = animal.fechaDeNacimiento;
    txtVacuna.value = animal.vacuna;
}


$formAnimales.addEventListener("submit", (e)=>{
    e.preventDefault();
    console.log("Submit");
    const {txtId,txtTitulo,txtDescripcion,txtTipoAnimal,txtPrecio,txtRaza,txtFecha,txtVacuna} = $formAnimales;
    if(validarIngresoVacio($controlesValidar))
    {
        const animalForm = new Anuncio_Mascota(parseInt(txtId.value),
        txtTitulo.value,
        txtDescripcion.value,
        txtTipoAnimal.value,
        parseFloat(txtPrecio.value),
        txtRaza.value,
        txtFecha.value,
        txtVacuna.value);
        if(animalForm !== null)
        {
            if(txtId.value === '')
            {
                animalForm.id = Date.now();
                crearMascota(URL,animalForm);
            }
            else
            {
                modificarMascota(URL,animalForm);
            }
        }   
        $formAnimales.reset();
        mostrarBotones();
    } 
});

function limpiarFiltros()
{
    $promedio.value = "N/A";
}


export async function actualizarTabla (datos)
{
    limpiarTabla($divTabla);
    activarSpinner();
    if(datos){
            datos.sort(function (a, b) {
            let tituloA = a.titulo;
            let tituloB = b.titulo;
            if(tituloA > tituloB)
            {
                return 1;
            }
            else if(tituloA < tituloB)
            {
                return -1;
            }
            return 0;
        });       
        $divTabla.appendChild(crearTabla(datos));
        desactivarSpinner();
    }   
}


function limpiarTabla(tabla)
{
    while(tabla.hasChildNodes())
    {
        tabla.removeChild(tabla.firstChild);
    }
}


function Limpiar(){
    $formAnimales.reset();
}

window.addEventListener("load",async (e)=>{
    e.preventDefault();
    await getMascotaTabla(URL);    
    let listaFiltrada = filtrarListaMascotas($animales);
    let promedio = calcularPromedio(listaFiltrada).toFixed(2);
    $promedio.value = promedio;   
})

$filtroTabla.addEventListener('change', async (e) => {
    e.preventDefault();
    let listaFiltrada = $animales; 
    let promedio = 0;
    if($animales.length > 0)
    {         
        listaFiltrada = filtrarListaMascotas($animales);
        promedio = calcularPromedio(listaFiltrada).toFixed(2);
        activarCheckBoxs();
        await actualizarTabla(listaFiltrada);
        $promedio.value = promedio.toString();  
    }  
});

function calcularPromedio(lista)
{
    let suma =  lista.reduce((previo,actual)=>{
        return previo + parseInt(actual.precio);
    },0);
    return suma / lista.length;
}

function filtrarListaMascotas(lista)
{
    let listaFiltrada = lista.filter((mascota)=>{       
        return mascota.tipo == $filtroTabla.value || $filtroTabla.value == "Todos";
    })
    return listaFiltrada;
}

function activarCheckBoxs()
{
    for(let item of $checkboxTabla)
    {
        item.checked = true;
    }
}



$filtroCheckTabla.addEventListener("change", (e)=>{
    e.preventDefault;
    const checkBoxsActivos = filtrarChecks($checkboxTabla);
    const listaActualizada = $animales.map((datosMascotas) =>
    {
        const listaRetorno = {};
        for (const key in datosMascotas) {      
            if(checkBoxsActivos[key] || key === "id")
            {
                console.log(checkBoxsActivos);
                listaRetorno[key] = datosMascotas[key];
            }
        }   
        console.log(listaRetorno);
        return listaRetorno;
    });   
    actualizarTabla(listaActualizada);
});

function filtrarChecks(checks)
{
    let lista={};
    for(let item of checks)
    {
        if(item.checked && item.value != 'id')
        {
            lista[item.name] = item.checked;
        }
    }
    return lista;
}

for(let i = 0; i < $controlesValidar.length; i++)
{
    const control = $controlesValidar[i];
    if(control.matches("input"))
    {
        control.addEventListener("blur", validarCampoVacio);
        if(control.matches("[type=text]"))
        {
            control.addEventListener("blur", validarCantidadCaracteres);
            if(control.classList.contains("precioVenta"))
            {            
                control.addEventListener("blur", validarPrecio);
            }
        }
    } 
}
