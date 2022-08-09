//Simulador Precios Productos Tienda de Ropa JS

const productos = [];
const carrito = [];

//localStorage.clear(carrito);
//localStorage.clear(productos);
//localStorage.clear();
class Producto{
  constructor(codigo, tipo, precio, talla, stock, img) {
      this.codigo = codigo;
      this.tipo = tipo;
      this.precio = parseFloat(precio);
    //  this.talla  = talla.toUpperCase();
    this.talla  = talla;
      this.stock  = stock;
      this.img = img;
  }
  
  calcularPrecioConIva(){
    let vprecio = this.precio * 1.21;
    return vprecio;
  }
}


class Carrito{
  constructor(codigo, precio, talla, cantidad, img) {
      this.codigo = codigo;
      this.precio = parseFloat(precio);
      this.talla  = talla.toUpperCase();
      this.cantidad  = cantidad;
      this.img = img;
  }
}


  //Calcula el precio del producto, dada el tipo y la cantidad comprada
  calculoPrecio = (codigo, talla, cantidad) => {
    return productos.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).calcularPrecioConIva() * cantidad;
  }
  
  //chqquea si hay stock
  hayStock = (codigo, talla) => {
    return productos.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla)).stock;
  }
  
  //resta el stock en una unidad
  //Uso de operador --
  restarStock = (codigo, talla) => {
  return productos.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).stock--; 
  }

    ///realliza la busqueda
    const botonbusqueda = document.getElementById("buscar");
    botonbusqueda.onclick = () => mostrarproductos();

 function mostrarproductos(){
  
  //console.log("Dentro de mostrar productos");

    const contenedor = document.getElementById("productos");
  
    let cantcomprada = 0;
    contenedor.innerHTML = "";

    busqueda = document.getElementById("busqueda");

   let productonuevo; 
console.log(busqueda.value);
   if (busqueda.value) 
     productonuevo = productos.filter((el) => el.tipo.toUpperCase().includes(busqueda.value.toUpperCase()));
    else 
     productonuevo = productos;
    
    combo = document.getElementById('codigo');
    combo.innerHTML = '';
    productocombo = productonuevo.filter((el) => el.talla == 'L');

    console.log(productocombo.length);
   if(productocombo.length > 1) {
    opcion = document.createElement("option");
    opcion.value = 'S';
    opcion.text = 'Seleccione';
    combo.appendChild(opcion);
  }

    productocombo.forEach(producto =>  {
       opcion = document.createElement("option");
       opcion.value = producto.codigo;
       opcion.text = producto.tipo;
       combo.appendChild(opcion);
     }
    )

    
    productonuevo.forEach(producto => {
  
       const stock = hayStock(producto.codigo, producto.talla);
       const divProducto = document.createElement('div');
       divProducto.className = 'card';

     let cant;

   //  localStorage.clear();
   /*  if(localStorage.getItem('carrito') !== null)
        cant = carrito.find ((carr) => carr.codigo.includes(producto.codigo) && carr.talla.includes(producto.talla.toUpperCase())).cantidad;
     else 
        cant = 0;*/

//Código optimizado
      localStorage.getItem('carrito') ? cant = carrito.find ((carr) => carr.codigo.includes(producto.codigo) && carr.talla.includes(producto.talla.toUpperCase())).cantidad : cant = 0;

     divProducto.innerHTML = `<img src="${producto.img}" width="125px" height="125px">  <h5>Talle: ${producto.talla}</h5>
     <h5>Precio: ${producto.calcularPrecioConIva()} </h5> <h5 id="${producto.codigo}${producto.talla}">Compró: ${cant}</h5> <h5 id="${producto.codigo}${producto.talla}2">Stock: ${stock}</h5>`;
      contenedor.appendChild(divProducto);
  })
  
  }
  

 //Saco los valores del Local Storage de Productos
 //localStorage.clear();

 let itemsFromStoragep = localStorage.getItem('productos');

 //Compruebo tenga valores
 if (itemsFromStoragep) {
 
  //let itemsBackp = JSON.parse( itemsFromStoragep );
  let itemsBackp = JSON.parse( itemsFromStoragep );
  
  //productos.splice(1,8);
  itemsBackp.forEach( c => {
    let productosnew = new Producto( c.codigo,  c.tipo, c.precio, c.talla.toUpperCase(), c.stock, c.img);
    productos.push(productosnew);
  })

 } //sino tiene valores le asigno los valores inciales
  else {
//Utilizo fetch para traer los productos del archivo de json (en caso que el localstorage esté vacio)
  fetch('./json/productos.json')
    .then( (resp) => resp.json())
    .then( (data) => {

    data.forEach((prod) => {
       productos.push(new Producto(prod.codigo, prod.tipo, prod.precio, prod.talla.toUpperCase(), prod.stock, prod.img));
    })
     console.log("Dentro de Fetch");
     let productosJSON = JSON.stringify(productos);
     localStorage.setItem('productos', productosJSON);

  //En base a los productos que tengo creo el carrito vacio (en caso de que el localstorage esté vacio)
  productos.forEach((prod) => {
  carrito.push(new Carrito(prod.codigo, 0, prod.talla.toUpperCase(), 0, prod.img));
  })

  let productosJSONc = JSON.stringify(carrito);
  localStorage.setItem('carrito', productosJSONc);

     mostrarproductos();
  })

 }
 let productosJSON = JSON.stringify(productos);
 localStorage.setItem('productos', productosJSON);
 //Busco los valores de LocalStorage del Carrito
  //localStorage.clear('carrito');
  let itemsFromStoragecarrito = localStorage.getItem('carrito');

//Compruebo tenga valor
 if (itemsFromStoragecarrito) {
 
  //let itemsBackp = JSON.parse( itemsFromStoragep );
  let itemsBackpc = JSON.parse( itemsFromStoragecarrito );
  
  //productos.splice(1,8);
  itemsBackpc.forEach( c => {
    let carritonew = new Carrito( c.codigo, c.precio, c.talla.toUpperCase(), c.cantidad, c.img);
    carrito.push(c);
  })

 }

let productosJSONc = JSON.stringify(carrito);
localStorage.setItem('carrito', productosJSONc);

mostrarproductos();



//Evento para comprar los productos seleccionados e ir agregando al carrito
 function evento() {

  let codigo = document.getElementById("codigo").value;
  let talla = document.getElementById("talla").value;
  let cantidad = document.getElementById("cantidad").value;


   document.getElementById("boton").className = "botonapretado";

   if(codigo == "S" ||  codigo  == ""  || talla == "S" ||  talla  == "" || cantidad == 0 ||  cantidad  == "") {
    Swal.fire(
      'Datos',
      'Debe ingresar los datos necesarios',
      'error'
    );
    }
  else{
     const nombre = productos.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla)).tipo;
 
     if ((hayStock(codigo, talla) - cantidad) >= 0) {
 
     for(let i = 1; i<=cantidad; i++ ){
     /*  if(hayStock(codigo, talla)>0)
             restarStock(codigo, talla);*/
          
          //Código optimizado
             (hayStock(codigo, talla)>0) ? restarStock(codigo, talla) : "";
      }
      
    
      //veo si el producto ya existe en el carrito, si ya existe le sumo la nueva cantidad comprada y actualizo el precio
    if(carrito.some ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase()))) {
        carrito.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).cantidad =  Number(carrito.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).cantidad) + Number(cantidad);
        carrito.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).precio = productos.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).calcularPrecioConIva() * Number(carrito.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).cantidad);
    }    
    else{
      //voy agregando productos al carrito
     carrito.push(new Carrito(codigo, calculoPrecio(codigo, talla, cantidad), talla, cantidad));
    }
    
    }
    else{
      let li3 = document.createElement("div");
      lista.append(li3);
      Swal.fire(
        'Stock',
        'No hay más en Stock!!',
        'warning'
      );
      Toastify({
        text: "No hay Stock!!",
        duration: 3000,
        gravity: 'top',
        position: 'left'
    }).showToast();

     }
 
    let id = codigo + talla  ;
    let id2 = codigo + talla + 2 ;

     document.getElementById(id.toString()).innerText = "Compró: " +  carrito.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).cantidad;
     document.getElementById(id2.toString()).innerText = "Stock: " +  productos.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).stock;
   
    // localStorage.clear();
     let productosJSON = JSON.stringify(productos);
     localStorage.setItem('productos', productosJSON);

     let productosJSONc = JSON.stringify(carrito);
     localStorage.setItem('carrito', productosJSONc);
    }
    }

//función para resetear los valores
  function resetear(){
    document.getElementById("codigo").value = null;
    document.getElementById("talla").value = null;
    document.getElementById("cantidad").value = null;
    document.getElementById("resetear").className = "botonapretado";
  }

//evento para eliminar la selección del carrito
  function eliminar(codigoProductoEliminar, tallaProductoEliminar){
    codigoProductoEliminar = document.getElementById("codigo").value;
    tallaProductoEliminar = document.getElementById("talla").value;
    eliminarProductoSeleccionado(codigoProductoEliminar, tallaProductoEliminar);
    //resetear();
  }


 
  //evento para poder ver los productos del carrito
  function vercarrito(){
    let listacarrito = document.getElementById("lista2");

  listacarrito.innerHTML = "";


   listacarrito = document.getElementById("lista2");

    let titulo = document.createElement("h1");
    titulo.innerHTML = "Resumen del carrito";
 
    listacarrito.append(titulo);

    document.getElementById("botoncarrito").className = "botonapretado";

//Recorro el array del carrito para poder mostrarlo
    for (const carr of carrito) {

      if (carr.cantidad > 0){
        let contenedor = document.createElement("p");
        contenedor.innerHTML = `<img src="${carr.img}" width="125px" height="125px"> <h5> Compró: ${carr.cantidad} unidades de: ` + productos.find ((prod) => prod.codigo.includes(carr.codigo)).tipo + " talla " + carr.talla +  ". Costo Total: " +  carr.precio ; 
        document.body.appendChild(contenedor);
        listacarrito.append(contenedor);
      }
    }

  let contenedor2 = document.createElement("div");
  contenedor2.innerHTML = "<h3>El costo total de todos los productos es : "  + carrito.reduce((acumulador, carrito) => acumulador + carrito.precio, 0);

  listacarrito.append("--");
  //listacarrito.append("El costo total de todos los productos es : "  + carrito.reduce((acumulador, carrito) => acumulador + carrito.precio, 0));
  listacarrito.append(contenedor2);
  listacarrito.append("--");
  }

  function blurboton() {
    document.getElementById("boton").className = "boton";
  }

  function blurbotoncarrito() {
    document.getElementById("botoncarrito").className = "boton";
  }

  function blurresetear() {
    document.getElementById("resetear").className = "boton";
  }

  function blureliminar() {
    document.getElementById("eliminar").className = "boton";
  }

 const botonmio = document.getElementById("boton");
 botonmio.onclick = () => evento();
 botonmio.onblur = () => blurboton();

 const botoncarritomio = document.getElementById("botoncarrito");
 botoncarritomio.onclick = () => vercarrito();
 botoncarritomio.onblur = () => blurbotoncarrito();

 const botonresetear = document.getElementById("resetear");
 botonresetear.onclick = () => resetear();
 botonresetear.onblur = () => blurresetear();

 const botoneliminar = document.getElementById("eliminar");
 botoneliminar.onclick = () => eliminar();

 let codigo = document.getElementById("codigo").value;
 let talla = document.getElementById("talla").value;
 let cantidad = document.getElementById("cantidad").value;

    //función que permite eliminar el producto del carrito
function eliminarProductoSeleccionado(codigoProductoEliminar, tallaProductoEliminar){

 codigo = document.getElementById("codigo").value;
 talla = document.getElementById("talla").value;
 
  let id = codigo + talla  ;
  let id2 = codigo + talla + 2 ;

  const cantidad = document.getElementById("cantidad").value;

  //Verifico si el producto ya existe en el carrito
  if(carrito.some ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase()))){
     
         let cantidadcomprada = Number(carrito.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).cantidad);

      //Verifico que la cantidad a eliminar existe, si existe le resto la cantidad a sacar, si al eliminar la cantidad queda en stock 0, directamente lo saco del carrito
      //Actualizò la cantidad y el precio
      if( cantidadcomprada >= Number(cantidad)) {
         carrito.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).cantidad = Number(carrito.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).cantidad) - Number(cantidad);
         carrito.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).precio = productos.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).calcularPrecioConIva() * Number(carrito.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).cantidad);

         document.getElementById(id.toString()).innerText = "Compró: " +  carrito.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).cantidad;
         productos.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).stock =  Number(productos.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).stock) + Number(document.getElementById("cantidad").value);
         document.getElementById(id2.toString()).innerText = "Stock: " +  productos.find ((prod) => prod.codigo.includes(codigo) && prod.talla.includes(talla.toUpperCase())).stock;                
      }
      
      if (cantidadcomprada <= Number(cantidad)){ 
      for (let i=0;i<carrito.length;i++){    
          if( carrito[i].codigo == codigoProductoEliminar) {
            if(carrito[i].talla == tallaProductoEliminar) {
             //carrito.splice(i,1);
             carrito.cantidad = 0;
          }
        }
      }    
      document.getElementById(id.toString()).innerText = "Compró: 0";
    } 
  } 

  let productosJSON = JSON.stringify(productos);
  localStorage.setItem('productos', productosJSON);

  let productosJSONc = JSON.stringify(carrito);
  localStorage.setItem('carrito', productosJSONc);
} 




 

