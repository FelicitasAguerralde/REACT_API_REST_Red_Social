const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow");
const auth = require("../middlewares/auth");
const { followValidators, idParamValidator } = require("../middlewares/validators");

// Rutas de prueba
router.get("/follow/prueba", auth, followController.pruebaFollow);

// Rutas de follow
router.post("/follow/save", auth, followValidators, followController.saveFollow);
router.delete("/follow/delete/:id", auth, idParamValidator, followController.unfollow);

// Rutas de following
router.get("/follow/following", auth, followController.following);
router.get("/follow/following/:id", auth, idParamValidator, followController.following);
router.get("/follow/following/:id/:page", auth, idParamValidator, followController.following);

// Rutas de followers
router.get("/follow/followers", auth, followController.followers);
router.get("/follow/followers/:id", auth, idParamValidator, followController.followers);
router.get("/follow/followers/:id/:page", auth, idParamValidator, followController.followers);

//Exportar router
module.exports = router;