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
router.get("/prueba", auth, userController.pruebaUser);

// Rutas de usuario
router.post("/register", registerValidators, userController.register);
router.post("/login", loginValidators, userController.login);
router.get("/auth", auth, userController.auth);
router.get("/profile/:id", auth, idParamValidator, userController.profile);

// Rutas con parámetros opcionales
router.get("/list", auth, userController.list);
router.get("/list/:page", auth, userController.list);

router.put("/update", auth, updateUserValidators, userController.update);
router.post("/upload", auth, uploads.single("file0"), userController.upload);
router.get("/avatar/:file", userController.avatar);
router.delete("/delete/:id", auth, idParamValidator, userController.deleteUser);

//Exportar router
module.exports = router;