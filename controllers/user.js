// Impprtar dependencias y modulos
const User = require("../models/user");
const bcrypt = require("bcrypt");

//Acciones de prueba

const pruebaUser = (req, res) => {
  return res.status(200).json({
    message: "Acciones de prueba: controlador de usuarios",
  });
};

// Registrar usuario
const register = async (req, res) => {
  // Recoger datos de la peticion
  let params = req.body;
  // Controlar que llegue ok y validar
  if (
    !params.name ||
    !params.surname ||
    !params.nick ||
    !params.email ||
    !params.password
  ) {
    return res.status(400).json({
      status: "error",
      message: "Error en la validación, faltan datos requeridos",
    });
  }

  // Control de usuarios duplicados
  const users = await User.find({
    $or: [
      { email: params.email.toLowerCase() },
      { nick: params.nick.toLowerCase() },
    ],
  });

  if (users && users.length >= 1) {
    return res.status(200).send({
      status: "success",
      message: "El usuario ya existe",
    });
  }

  // Cifrar contraseña
  const hash = await bcrypt.hash(params.password, 10);
  params.password = hash;

  // Crear objeto de usuario
  let userToSave = new User(params);

  // Guardar user en bbdd
  try {
    const userStored = await userToSave.save();
    
    if (!userStored) {
      return res.status(500).send({
        status: "error",
        message: "Error al guardar el usuario"
      });
    }

    //Devolver resultado
    return res.status(200).json({
      status: "success",
      message: "Usuario registrado correctamente",
      user: userStored
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al registrar el usuario"
    });
  }
};

module.exports = {
  pruebaUser,
  register,
};
