const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

//Servidor
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const {optionsMariaDB, optionsSqlite} = require('./options_db')
const {Contenedor} = require('./modules/classContenedor')

// Instancias de contenedores de bases de datos
const contenedorProductos = new Contenedor("products", optionsMariaDB);
const contenedorMensajes = new Contenedor("messages", optionsSqlite);


//Sockets de productos
io.on("connection", async (client) => {
   let a = await contenedorProductos.getAllData();
   console.log("New user connected!");
   client.emit("productos", a);
   client.on("newProduct", (product) => {
      contenedorProductos.postData(product);
      io.sockets.emit("viewProducts", contenedorProductos.getAllData());  
   });
   
   //Sockets de mensajes
   contenedorMensajes.getAllData().then((response) => {
      client.emit("mensajes", response);
   });
   client.on("newMessage", async (newMessage) => {
      newMessage.timestamp = new Date().toLocaleString();
      await contenedorMensajes.postData(newMessage);
      io.sockets.emit("mensajes", contenedorMensajes.getAllData());
   });
});

//Iniciando server
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
   console.log("Running Server, listening on port " + PORT);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
