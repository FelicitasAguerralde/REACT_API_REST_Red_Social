const mongoose = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/redSocial");
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.log(error);
        throw new Error("Error al conectar a la base de datos");
    }
}

module.exports = connection;