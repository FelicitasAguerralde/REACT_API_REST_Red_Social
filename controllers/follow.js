// Acciones de prueba

const pruebaFollow = (req, res) => {
    return res.status(200).json({
        message: "Acciones de prueba: controlador de seguidos"
    });
}

module.exports = {
    pruebaFollow
};