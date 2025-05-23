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

//Cargar conf rutas (ruta de prueba)
app.get("/ruta-prueba", (req, res) => {
    res.status(200).send("API REST con Node.js y MongoDB");
});

//Poner servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor corriendo en el puerto", port);
});