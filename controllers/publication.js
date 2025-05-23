// Acciones de prueba

const pruebaPublication = (req, res) => {
    return res.status(200).json({
        message: "Acciones de prueba: controlador de publicaciones"
    });
}

module.exports = {
    pruebaPublication
};