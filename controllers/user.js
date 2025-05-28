// Importar dependencias y modulos
const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoosePagination = require("mongoose-pagination");
const fileSystem = require("fs");

// Importar servicios
const jwt = require("../services/jwt");

//Acciones de prueba
const pruebaUser = (req, res) => {
  return res.status(200).json({
    message: "Acciones de prueba: controlador de usuarios",
    user: req.user,
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
        message: "Error al guardar el usuario",
      });
    }

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      message: "Usuario registrado correctamente",
      user: userStored,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al registrar el usuario",
    });
  }
};

// Login
const login = async (req, res) => {
  // Recoger los paramtros del body
  let params = req.body;
  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }

  try {
    // Buscar si existe en la bbdd
    const user = await User.findOne({ email: params.email });

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "No existe el usuario",
      });
    }

    // Comprobar la contraseña
    let pwd = bcrypt.compareSync(params.password, user.password);

    if (!pwd) {
      return res.status(400).send({
        status: "error",
        message: "No te has logueado correctamente",
      });
    }
    // Devolver Token
    const token = jwt.createToken(user);

    // Devolver datos user

    return res.status(200).send({
      status: "success",
      message: "Te has logueado correctamente",
      user: {
        name: user.name,
        surname: user.surname,
      },
      token,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "No se ha podido loguear el usuario",
    });
  }
};

// Autenticación
const auth = async (req, res) => {
  try {
    // Obtener el token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        status: "error",
        message: "No hay token de autenticación",
      });
    }

    // Verificar token
    const decoded = jwt.decodeToken(token);

    if (!decoded) {
      return res.status(401).send({
        status: "error",
        message: "Token inválido",
      });
    }

    // Buscar usuario
    const user = await User.findById(decoded.id).select({ password: 0 });

    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Autenticación exitosa",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error en la autenticación",
    });
  }
};

const profile = async (req, res) => {
  try {
    // Recibir el parámetro del id de user por la url
    const id = req.params.id;

    // Consulta para obtener los datos del user
    const userProfile = await User.findById(id).select({ password: 0 , role: 0});

    if (!userProfile) {
      return res.status(404).send({
        status: "error",
        message: "El usuario no existe",
      });
    }

    // Devolver el resultado
    return res.status(200).send({
      status: "success",
      user: userProfile
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener el perfil del usuario"
    });
  }
};

const list = async (req, res) => {
    try {
        // Controlar en que pag estamos
        let page = 1;
        if(req.params.page){
            page = parseInt(req.params.page);
        }

        // Consulta con mongoose paginate
        let itemsPerPage = 5;

        const options = {
            page: page,
            limit: itemsPerPage,
            sort: { id: 1 },
            select: { password: 0, role: 0 } // Para excluir campos
        };

        const result = await User.paginate({}, options);

        if(!result.docs || result.docs.length === 0) {
            return res.status(404).send({
                status: "error",
                message: "No hay usuarios disponibles"
            });
        }

        // Devolver el resultado
        return res.status(200).send({
            status: "success",
            users: result.docs,
            page: result.page,
            itemsPerPage: result.limit,
            total: result.totalDocs,
            pages: result.totalPages
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener la lista de usuarios",
            error: error.message
        });
    }
};

const update = async (req, res)=> {
  try {
    // Recoger info del user a actualizar
    const userIdentity = req.user;
    const userToUpdate = req.body;

    // Validar que exista el usuario a actualizar
    if (!userIdentity || !userIdentity.id) {
      return res.status(400).send({
        status: "error",
        message: "No se ha proporcionado un usuario válido para actualizar"
      });
    }

    // Eliminar los campos que no quiero actualizar
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;

    // Validar que haya datos para actualizar
    if (Object.keys(userToUpdate).length === 0) {
      return res.status(400).send({
        status: "error",
        message: "No hay datos para actualizar"
      });
    }

    // Comprobar si el usuario ya existe
    const users = await User.find({
      $or: [
        { email: userToUpdate.email?.toLowerCase() },
        { nick: userToUpdate.nick?.toLowerCase() },
      ],
    });

    let userIsset = false;
    users.forEach(user=>{
      if(user && user.id != userIdentity.id) userIsset = true;
    });

    if(userIsset){
      return res.status(409).send({
        status: "error",
        message: "El email o nick ya está en uso por otro usuario"
      });
    }

    // Cifrar contraseña si se proporciona
    if(userToUpdate.password){
      try {
        const hash = await bcrypt.hash(userToUpdate.password, 10);
        userToUpdate.password = hash;
      } catch (error) {
        return res.status(500).send({
          status: "error",
          message: "Error al cifrar la contraseña"
        });
      }
    }

    // Buscar y actualizar
    const userUpdated = await User.findByIdAndUpdate(
      userIdentity.id, 
      userToUpdate, 
      { 
        new: true,
        runValidators: true // Activar validadores de mongoose
      }
    );

    if (!userUpdated) {
      return res.status(404).send({
        status: "error",
        message: "No se encontró el usuario para actualizar"
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Usuario actualizado correctamente",
      user: userUpdated
    });
  } catch (error) {
    // Manejar errores específicos de Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        status: "error",
        message: "Error de validación en los datos",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).send({
        status: "error",
        message: "ID de usuario inválido"
      });
    }

    return res.status(500).send({
      status: "error",
      message: "Error al actualizar el usuario",
      error: error.message
    });
  }
};

// Metodo de carga de imagenes
const upload = async (req, res) => {
  try {
    // Recoger el archivo de imagen, comprobar que existe
    if(!req.file){
      return res.status(404).send({
        status: "error",
        message: "La petición no incluye la imagen"
      });
    }

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacar la extensión del archivo
    const imageSplit = image.split(".");
    const extension = imageSplit[imageSplit.length - 1].toLowerCase();

    // Comprobar extensión
    const allowedExtensions = ["png", "jpg", "jpeg", "gif"];
    
    if(!allowedExtensions.includes(extension)){
      // Eliminar fichero subido
      try {
        await fileSystem.promises.unlink(req.file.path);
      } catch (error) {
        console.error("Error al eliminar archivo inválido:", error);
      }

      return res.status(400).send({
        status: "error",
        message: "Extensión del archivo inválida. Extensiones permitidas: " + allowedExtensions.join(", ")
      });
    }

    // Si es correcta, guardar img en bbdd
    const userUpdated = await User.findByIdAndUpdate(
      req.user.id,
      { image: req.file.filename },
      { new: true }
    );

    if (!userUpdated) {
      // Si falla la actualización, eliminar la imagen
      try {
        await fileSystem.promises.unlink(req.file.path);
      } catch (error) {
        console.error("Error al eliminar archivo después de fallo en actualización:", error);
      }

      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el usuario con la imagen"
      });
    }

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      message: "Imagen subida correctamente",
      user: userUpdated,
      file: req.file
    });

  } catch (error) {
    // Si ocurre cualquier error, intentar eliminar la imagen
    if (req.file?.path) {
      try {
        await fileSystem.promises.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error al eliminar archivo después de error:", unlinkError);
      }
    }

    return res.status(500).send({
      status: "error",
      message: "Error al procesar la imagen",
      error: error.message
    });
  }
};

module.exports = {
  pruebaUser,
  register,
  login,
  auth,
  profile, 
  list,
  update,
  upload
};
