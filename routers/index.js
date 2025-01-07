const router = require("express").Router();
const { Controller } = require("../controllers/controller");

router.get("/testing", Controller.getGame);
router.post("/createuser", Controller.createUser)
router.post("/creategame", Controller.createGame)

module.exports = router;
