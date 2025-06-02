const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow");
const auth = require("../middlewares/auth");
const { followValidators, idParamValidator } = require("../middlewares/validators");

// Rutas de prueba
router.get("/prueba", auth, followController.pruebaFollow);

// Rutas de follow
router.post("/saveFollow", auth, followValidators, followController.saveFollow);
router.delete("/unfollow/:id", auth, idParamValidator, followController.unfollow);

// Rutas con parámetros opcionales
router.get("/following", auth, followController.following);
router.get("/following/:id", auth, idParamValidator, followController.following);
router.get("/following/:id/:page", auth, idParamValidator, followController.following);

router.get("/followers", auth, followController.followers);
router.get("/followers/:id", auth, idParamValidator, followController.followers);
router.get("/followers/:id/:page", auth, idParamValidator, followController.followers);

//Exportar router
module.exports = router;