const router = require("express").Router();
const { Controller } = require("../controllers/controller");

router.get("/testing", Controller.getGame);
router.post("/creategame", Controller.createGame)
router.post("/joingame", Controller.joinGame);

module.exports = router;
