const router = require("express").Router();
const errorController = require("../controllers/errorController");

//error handling
router.use(errorController.respondInternalError);
router.use(errorController.respondSourceNotFound);

module.exports = router;