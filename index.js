// Importar dependencias
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Importar middlewares
const errorHandler = require("./middlewares/errorHandler");

// Importar rutas
const userRoutes = require("./routes/user");
const followRoutes = require("./routes/follow");
const publicationRoutes = require("./routes/publication");

// Crear servidor
const app = express();

// Configurar cors
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear URL-encoded
app.use(express.urlencoded({ extended: true }));

// Configurar rutas
app.use("/api", userRoutes);
app.use("/api", followRoutes);
app.use("/api", publicationRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Conectar a la base de datos
mongoose.connect("mongodb://localhost:27017/redSocial")
    .then(() => {
        console.log("Conexión a la base de datos establecida");
        
        // Crear servidor y escuchar peticiones
        const port = process.env.PORT || 3900;
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    })
    .catch(error => {
        console.error("Error al conectar a la base de datos:", error);
    });

  