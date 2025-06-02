// Importar módulos
const fileSystem = require("fs");
const path = require("path");
const fs = require("fs");

// importar modelos
const Publication = require("../models/publication");

// Acciones de prueba

const pruebaPublication = (req, res) => {
    return res.status(200).json({
        message: "Acciones de prueba: controlador de publicaciones"
    });
}

// Guardar una publicación
const savePublication = async (req, res) => {
    try {
        const params = req.body;
        const user = req.user;

        if (!params.text) {
            return res.status(400).json({
                status: "error",
                message: "El texto de la publicación es requerido"
            });
        }

        const publication = new Publication({
            user: user.id,
            text: params.text,
            file: params.file || null
        });

        const publicationStored = await publication.save();

        if (!publicationStored) {
            return res.status(500).json({
                status: "error",
                message: "Error al guardar la publicación"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Publicación guardada correctamente",
            publication: publicationStored
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al guardar la publicación",
            error: error.message
        });
    }
}

// Eliminar una publicación
const deletePublication = async (req, res) => {
    try {
        const userId = req.user.id;
        const publicationId = req.params.id;

        const publication = await Publication.findById(publicationId);

        if (!publication) {
            return res.status(404).json({
                status: "error",
                message: "La publicación no existe"
            });
        }

        // Verificar que el usuario es el propietario de la publicación
        if (publication.user.toString() !== userId && req.user.role !== "role_admin") {
            return res.status(403).json({
                status: "error",
                message: "No tienes permisos para eliminar esta publicación"
            });
        }

        const publicationDeleted = await Publication.findByIdAndDelete(publicationId);

        if (!publicationDeleted) {
            return res.status(500).json({
                status: "error",
                message: "Error al eliminar la publicación"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Publicación eliminada correctamente",
            publication: publicationDeleted
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al eliminar la publicación",
            error: error.message
        });
    }
}

// Obtener una publicación
const getPublication = async (req, res) => {
    try {
        const publicationId = req.params.id;

        const publication = await Publication.findById(publicationId)
            .populate("user", "-password -role");

        if (!publication) {
            return res.status(404).json({
                status: "error",
                message: "La publicación no existe"
            });
        }

        return res.status(200).json({
            status: "success",
            publication
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener la publicación",
            error: error.message
        });
    }
}

// Obtener todas las publicaciones
const getPublications = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const itemsPerPage = 5;

        const options = {
            page,
            limit: itemsPerPage,
            sort: { createdAt: -1 },
            populate: {
                path: "user",
                select: "-password -role"
            }
        };

        const publications = await Publication.paginate({}, options);

        if (!publications.docs || publications.docs.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No hay publicaciones disponibles"
            });
        }

        return res.status(200).json({
            status: "success",
            publications: publications.docs,
            page: publications.page,
            itemsPerPage: publications.limit,
            total: publications.totalDocs,
            pages: publications.totalPages
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener las publicaciones",
            error: error.message
        });
    }
}

// Obtener publicaciones de un usuario
const getPublicationsUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const page = parseInt(req.params.page) || 1;
        const itemsPerPage = 5;

        const options = {
            page,
            limit: itemsPerPage,
            sort: { createdAt: -1 },
            populate: {
                path: "user",
                select: "-password -role"
            }
        };

        const publications = await Publication.paginate({ user: userId }, options);

        if (!publications.docs || publications.docs.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No hay publicaciones disponibles para este usuario"
            });
        }

        return res.status(200).json({
            status: "success",
            publications: publications.docs,
            page: publications.page,
            itemsPerPage: publications.limit,
            total: publications.totalDocs,
            pages: publications.totalPages
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener las publicaciones del usuario",
            error: error.message
        });
    }
}

// Metodo de carga de imagenes
const upload = async (req, res) => {
    try {
        // Recoger id de la publicación
        const publicationId = req.params.id;

        // Buscar la publicación
        const publication = await Publication.findById(publicationId);

        if (!publication) {
            return res.status(404).json({
                status: "error",
                message: "La publicación no existe"
            });
        }

        // Verificar que el usuario es el propietario de la publicación
        if (publication.user.toString() !== req.user.id && req.user.role !== "role_admin") {
            return res.status(403).json({
                status: "error",
                message: "No tienes permisos para modificar esta publicación"
            });
        }

        // Recoger fichero de imagen y comprobar que existe
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "Petición no incluye la imagen"
            });
        }

        // Conseguir el nombre del archivo
        let image = req.file.originalname;

        // Sacar la extensión del archivo
        const imageSplit = image.split("\.");
        const extension = imageSplit[1];

        // Comprobar extensión
        if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
            // Borrar archivo subido
            const filePath = req.file.path;
            const fileDeleted = fs.unlinkSync(filePath);

            return res.status(400).json({
                status: "error",
                message: "Extensión del fichero invalida"
            });
        }

        // Si hay una imagen anterior, eliminarla
        if (publication.file) {
            const oldFilePath = "./uploads/publications/" + publication.file;
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        // Actualizar la publicación con la nueva imagen
        const publicationUpdated = await Publication.findByIdAndUpdate(
            publicationId,
            { file: req.file.filename },
            { new: true }
        );

        if (!publicationUpdated) {
            return res.status(400).json({
                status: "error",
                message: "Error al actualizar la publicación"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Imagen actualizada correctamente",
            publication: publicationUpdated,
            file: req.file
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al subir la imagen",
            error: error.message
        });
    }
};

const media = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // montar el path real de la imagen
    const filePath = "./uploads/publications/" + file;

    // Comprobar que existe
    fileSystem.stat(filePath, (error, exists) => {
        if (!exists){
            return res
                .status(404)
                .send({ status: "error", message: "No existe la imagen" });
        }
        // Devolver un file
        return res.sendFile(path.resolve(filePath)); // ruta absoluta
    });
};

module.exports = {
    pruebaPublication,
    savePublication,
    deletePublication,
    getPublication,
    getPublications,
    getPublicationsUser, 
    upload,
    media
};