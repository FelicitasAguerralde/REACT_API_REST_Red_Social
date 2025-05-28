// Importar modelo
const Follow = require("../models/follow");
const User = require("../models/user");

// Acciones de prueba

const pruebaFollow = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Acciones de prueba: controlador de seguidos"
    });
}

// Seguir follow (guardar)
const save = async (req, res) => {
    try {
        // Conseguir datos por body
        const params = req.body;

        // Validar que se proporcionó el ID del usuario a seguir
        if (!params.followed) {
            return res.status(400).json({
                status: "error",
                message: "Falta el ID del usuario a seguir"
            });
        }

        // Obtener id user a seguir
        const identity = req.user;

        // Validar que no se siga a sí mismo
        if (identity.id === params.followed) {
            return res.status(400).json({
                status: "error",
                message: "No puedes seguirte a ti mismo"
            });
        }

        // Verificar si el usuario a seguir existe
        const userToFollow = await User.findById(params.followed);
        
        if (!userToFollow) {
            return res.status(404).json({
                status: "error",
                message: "El usuario que intentas seguir no existe"
            });
        }

        // Verificar si ya lo estás siguiendo
        const existingFollow = await Follow.findOne({
            user: identity.id,
            followed: params.followed
        });

        if (existingFollow) {
            return res.status(400).json({
                status: "error",
                message: "Ya estás siguiendo a este usuario"
            });
        }

        // Crear objeto con modelo follow
        let newFollow = new Follow({
            user: identity.id,
            followed: params.followed
        });

        // Guardar objeto en bbdd
        const followStored = await newFollow.save();

        if (!followStored) {
            return res.status(500).json({
                status: "error",
                message: "No se ha podido seguir al usuario"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Usuario seguido correctamente",
            identity: req.user,
            follow: followStored
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "No se ha podido seguir al usuario"
        });
    }
}

// Dejar de seguir (delete)

// Listado de follows

// Litado de followers

module.exports = {
    pruebaFollow,
    save
};