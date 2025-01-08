const router = require("express").Router();
const { Controller } = require("../controllers/controller");

router.get("/testing", Controller.getGame);
router.post("/creategame", Controller.createGame);
router.post("/joingame", Controller.joinGame);

router.get("/waitplayer", Controller.waitPlayer);

router.get("/startgame", Controller.startGame);
router.post("/action", Controller.action);
// router.get("/endgame", Controller.endGame);

module.exports = router;
