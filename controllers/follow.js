// Importar modelo
const Follow = require("../models/follow");
const User = require("../models/user");

// Importar servicio
const followService = require("../services/followService");

// Importar dependencias
const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");

// Acciones de prueba
const pruebaFollow = (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Acciones de prueba: controlador de seguidos",
  });
};

// Seguir follow (guardar)
const saveFollow = async (req, res) => {
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
      followed: params.followed,
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
      followed: params.followed,
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
      follow: followStored
    });
  } catch (error) {
    console.error("Error en saveFollow:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al seguir al usuario",
      error: error.message
    });
  }
};

// Dejar de seguir (delete)
const unfollow = async (req, res) => {
  try {
    // Obtener el id del usuario identificado
    const userId = req.user.id;

    // Obtener el id del user seguido
    const followedId = req.params.id;

    // Buscar y eliminar el follow
    const followDeleted = await Follow.findOneAndDelete({
      user: userId,
      followed: followedId,
    });

    if (!followDeleted) {
      return res.status(404).json({
        status: "error",
        message: "No se ha encontrado el follow a eliminar",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Has dejado de seguir a este usuario",
      followDeleted,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al dejar de seguir al usuario",
    });
  }
};

// Listado de follows (usuarios que sigo)
const following = async (req, res) => {
  try {
    // Obtener el id del usuario identificado
    const userId = req.user.id;

    // Obtener el id del usuario del que queremos ver sus seguidos
    const userIdToCheck = req.params.id || userId;

    // Configurar paginación
    let page = 1;
    if (req.params.page) page = parseInt(req.params.page);
    const itemsPerPage = 5;

    // Contar total de follows
    const total = await Follow.countDocuments({ user: userIdToCheck });

    // Calcular total de páginas
    const totalPages = Math.ceil(total / itemsPerPage);

    // Verificar si la página solicitada existe
    if (page > totalPages && total > 0) {
      return res.status(404).json({
        status: "error",
        message: `La página ${page} no existe. El total de páginas es ${totalPages}`,
      });
    }

    // Buscar los follows con paginación
    const follows = await Follow.find({ user: userIdToCheck })
      .populate("followed", "-password -role -__v")
      .populate("user", "-password -role -__v")
      .paginate(page, itemsPerPage);

    if (!follows || follows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No hay usuarios que sigas",
      });
    }

    // Guardar un array de ids de los usuarios que me siguen y los que sigo
    let followUserIds = followService.followUserIds(req.user.id);

    return res.status(200).json({
      status: "success",
      message: "Listado de usuarios que sigues",
      follows,
      page,
      itemsPerPage,
      total,
      pages: totalPages,
      user_following: (await followUserIds).following,
      user_follow_me: (await followUserIds).followers
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener los usuarios que sigues",
    });
  }
};

// Listado de followers (usuarios que me siguen)
const followers = async (req, res) => {
  try {
    // Obtener el id del usuario identificado
    const userId = req.user.id;

    // Obtener el id del usuario del que queremos ver sus seguidores
    const userIdToCheck = req.params.id || userId;

    // Configurar paginación
    let page = 1;
    if (req.params.page) page = parseInt(req.params.page);
    const itemsPerPage = 5;

    // Contar total de followers
    const total = await Follow.countDocuments({ followed: userIdToCheck });

    // Calcular total de páginas
    const totalPages = Math.ceil(total / itemsPerPage);

    // Verificar si la página solicitada existe
    if (page > totalPages && total > 0) {
      return res.status(404).json({
        status: "error",
        message: `La página ${page} no existe. El total de páginas es ${totalPages}`,
      });
    }

    // Buscar los followers con paginación
    const followers = await Follow.find({ followed: userIdToCheck })
      .populate("user", "-password -role -__v")
      .populate("followed", "-password -role -__v")
      .paginate(page, itemsPerPage);

    if (!followers || followers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No tienes seguidores",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Listado de seguidores",
      followers,
      page,
      itemsPerPage,
      total,
      pages: totalPages
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener los seguidores",
    });
  }
};

// Comprobar si un usuario me sigue o si lo sigo
const followThisUser = async (identityUserId, profileUserId) => {
  try {
    // Validar que los IDs sean válidos
    if (!mongoose.Types.ObjectId.isValid(identityUserId) || !mongoose.Types.ObjectId.isValid(profileUserId)) {
      throw new Error('ID de usuario inválido');
    }

    let following = await Follow.findOne({ "user": identityUserId, "followed": profileUserId })
      .select({ "followed": 1, "id": 0 })
      .exec();

    let follower = await Follow.findOne({ "user": profileUserId, "followed": identityUserId })
      .select({ "followed": 1, "id": 0 })
      .exec();

    return {
      following: following || null,
      follower: follower || null
    };
  } catch (error) {
    console.error("Error en followThisUser:", error);
    return {
      following: null,
      follower: null
    };
  }
}

module.exports = {
  pruebaFollow,
  saveFollow,
  unfollow,
  following,
  followers,
  followThisUser
};
