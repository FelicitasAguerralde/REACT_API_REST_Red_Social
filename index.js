//Importar modulos
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Mensaje de bienvenida
console.log("API REST iniciada con Node.js y MongoDB");

// Conexion a la base de datos
connection();

//Crear servidor node
const app = express();
const port = 3900;

//Configurar cors
app.use(cors());

//Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cargar conf rutas
const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");
const followRoutes = require("./routes/follow");

//Usar rutas
app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
app.use("/api/follow", followRoutes);

//Poner servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor corriendo en el puerto", port);
});

  