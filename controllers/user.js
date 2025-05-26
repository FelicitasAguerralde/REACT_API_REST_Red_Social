// Impprtar dependencias y modulos
const user = require("../models/user");
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

    // Devolver resultado
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


// Login
const login = async (req, res) => {
    // Recoger los paramtros del body
    let params = req.body;
    if(!params.email || !params.password){
        return res.status(400).send({
            status:"error",
            message:"Faltan datos por enviar"
        });
    }

    try {
        // Buscar si existe en la bbdd
        const user = await User.findOne({email: params.email});
        
        if(!user) {
            return res.status(404).send({
                status: "error", 
                message: "No existe el usuario"
            });
        };

        // Comprobar la contraseña
        let pwd = bcrypt.compareSync(params.password, user.password);

        if(!pwd){
            return res.status(400).send({
                status: "error",
                message: "No te has logueado correctamente"
            })
        }
        // Devolver Token
        const token = false;

        // Devolver datos user

        return res.status(200).send({
            status: "success",
            message: "Te has logueado correctamente",
            user:{
                name: user.name,
                surname: user.surname
            },
            token
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "No se ha podido loguear el usuario"
        });
    }
}


module.exports = {
  pruebaUser,
  register,
  login
};
