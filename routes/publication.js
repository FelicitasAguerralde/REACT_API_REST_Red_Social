const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publication");
const check = require("../middlewares/auth");
const multer = require("multer");

// Configuración de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/publications")
    },
    filename: (req, file, cb) => {
        cb(null, "publication-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

//Definir rutas
router.get("/prueba-publication", publicationController.pruebaPublication);
router.post("/publication/save", check, publicationController.savePublication);
router.post("/publication/upload/:id", check, uploads.single("file0"), publicationController.upload);
router.delete("/publication/delete/:id", check, publicationController.deletePublication);
router.get("/publication/:id", check, publicationController.getPublication);
router.get("/publications", check, publicationController.getPublications);
router.get("/publications/:page", check, publicationController.getPublications);
router.get("/publications-user/:id", check, publicationController.getPublicationsUser);
router.get("/publications-user/:id/:page", check, publicationController.getPublicationsUser);
router.get("/media/:file", check, publicationController.media);

//Exportar router
module.exports = router;