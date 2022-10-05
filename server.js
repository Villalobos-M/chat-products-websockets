const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const {Products} = require("./modules/classProducts");
const {Messages} = require("./modules/classMessage");

//=================================== Codificando el servidor
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productosApi = new Products();
const mensajesApi = new Messages();

console.clear();

//=================================== Configuración Socket

io.on("connection", async (client) => {
   console.log("New user connected!");
   client.emit("productos", productosApi.getAllProducts());
   client.on("newProduct", (product) => {
      productosApi.postProduct(product);
      io.sockets.emit("productos", productosApi.getAllProducts());
   });

   client.emit("mensajes", mensajesApi.getAllMessage());
   client.on("newMessage", async (newMessage) => {
      newMessage.time = new Date().toLocaleString();
      await mensajesApi.postMessage(newMessage);
      io.sockets.emit("mensajes", mensajesApi.getAllMessage());
   });
});

//=================================== Instanciando server
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
   console.log("All OK, Listening on port" + PORT);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
