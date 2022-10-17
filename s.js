const express = require("express");
const app = express();
const port = 8080;
const hbs = require("express-handlebars");
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const ContenedorDB = require("./modules/contenedor-db");
const { optionsMariaDB, optionsSqlite } = require("./db-options");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render("index");
});

//* CONTENEDORES PARA ACCESO A DB's
const contenedorProductos = new ContenedorDB("productos", optionsMariaDB);
const contenedorMensajes = new ContenedorDB("mensajes", optionsSqlite);

//* WEBSOCKET
io.on("connection", (socket) => {
  contenedorProductos.getAll().then((response) => {
    socket.emit("products", response);
  });
  contenedorMensajes.getAll().then((response) => {
    socket.emit("messages", response);
  });
  console.log("se conecto alguien");
  socket.on("newProduct", (data) => {
    contenedorProductos.save(data).then(() => {
      contenedorProductos.getAll().then((response) => {
        io.sockets.emit("products", response);
      });
    });
  });
  socket.on("newMessage", (data) => {
    contenedorMensajes.save(data).then(() => {
      contenedorMensajes.getAll().then((response) => {
        io.sockets.emit("messages", response);
      });
    });
  });
});

//* SETUP MOTOR PLANTILLAS (HANDLEBARS)
app.engine(
  "hbs",
  hbs.engine({
    extname: ".hbs",
    partialDir: __dirname + "/views/partials",
    layoutDir: __dirname + "/views/layouts",
    defaultLayout: "layout.hbs",
  })
);
app.set("views", "./views");
app.set("view engine", "hbs");

//* SETUP DEL SERVER
const server = httpServer.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor: ${error}`));