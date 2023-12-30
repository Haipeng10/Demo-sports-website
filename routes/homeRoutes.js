const router = require("express").Router();
const homeController = require("../controllers/homeController");

//routers
router.get("/", homeController.respondForHomePage);
router.get("/about", homeController.respondForAbout);


module.exports = router;