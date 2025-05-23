//Acciones de prueba

const pruebaUser = (req, res) => {
    return res.status(200).json({
        message: "Acciones de prueba: controlador de usuarios"
    });
}

module.exports = {
    pruebaUser
};