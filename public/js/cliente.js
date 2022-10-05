const socket = io();

const layout = document.getElementById("layoutProductos");
const producto = document.getElementById("producto");
const precio = document.getElementById("precio");
const url = document.getElementById("url");

//PRODUCTS
socket.on("productos", (products) => {
   hbsTamplateFn(products).then((html) => {
      layout.innerHTML = html;
   });
});

const sendProduct = (e) => {
  const newProduct = {
    producto: producto.value,
    precio: precio.value,
    url: url.value,
  };

  socket.emit("newProduct", newProduct);
  return false;
};

//  renderizar los productos del html traido de plantilla
const hbsTamplateFn = (productos) => {
  return fetch("plantillas/tablaProductos.hbs")
    .then((resp) => resp.text()) 
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);  
      const html = template({ productos }); 
      return html;
    });
};


// MESSAGES

const mensaje = document.getElementById("mensaje");
const email = document.getElementById("email");
const layoutMsj = document.getElementById("layoutMensajes");

// D) volvemos a escuchar el mensaje del servidor y volvemos a pintar el html
socket.on("mensajes", (message) => {
  render(message);
});

const sendMessage = (e) => {
  const newMessage = {
    email: email.value,
    mensaje: mensaje.value,
  };

  
  socket.emit("newMessage", newMessage);
    console.log(newMessage);
  return false;
};

const render = (mensajes) => {
  const html = mensajes.map((msj) => {
    return `<div class='card'>
      
      <p class='mensajeEntero'> 
      <strong class='mail'>${msj.email}</strong> 
      <span class='date'>(${msj.time}):</span> 
      <span class='msj'>${msj.mensaje}</span> </p>
      </div>`;
  });
  layoutMsj.innerHTML = html.join(" ");
};
