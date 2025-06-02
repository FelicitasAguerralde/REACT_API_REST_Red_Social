const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");
const { registerValidators, loginValidators, updateUserValidators, idParamValidator } = require("../middlewares/validators");
const multer = require("multer");

// Configuración de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

// Rutas de prueba
router.get("/user/prueba", auth, userController.pruebaUser);

// Rutas de usuario
router.post("/user/register", registerValidators, userController.register);
router.post("/user/login", loginValidators, userController.login);
router.get("/user/auth", auth, userController.auth);
router.get("/user/profile/:id", auth, idParamValidator, userController.profile);

// Rutas con parámetros opcionales
router.get("/users", auth, userController.list);
router.get("/users/:page", auth, userController.list);

router.put("/user/update", auth, updateUserValidators, userController.update);
router.post("/user/upload", auth, uploads.single("file0"), userController.upload);
router.get("/user/avatar/:file", userController.avatar);
router.delete("/user/delete/:id", auth, idParamValidator, userController.deleteUser);

// Definir rutas
router.get("/prueba-user", auth, userController.pruebaUser);
router.get("/users", auth, userController.list);
router.get("/users/:page", auth, userController.list);
router.put("/user/update", auth, userController.update);
router.post("/user/upload", auth, uploads.single("file0"), userController.upload);
router.get("/user/avatar/:file", userController.avatar);
router.delete("/user/delete/:id", auth, userController.deleteUser);
router.get("/user/count-follows/:id", auth, userController.countFollows);

//Exportar router
module.exports = router;