const router = require("express").Router();
const { Controller } = require("../controllers/controller");

router.get("/testing", Controller.getGame);
router.post("/joingame", Controller.joinGameGame);

module.exports = router;
