const router = require("express").Router();
const facilityController = require("../controllers/facilityController");
const userController = require("../controllers/userController");

//routers for facility
router.get("/", facilityController.index, facilityController.indexView);
router.get("/new", userController.isLoggedInAdmin, facilityController.new);
router.post("/create", userController.isLoggedInAdmin, facilityController.validationRules(), facilityController.validate, facilityController.create, facilityController.redirectView);
// router.post("/create", facilityController.create, facilityController.redirectView);

router.get("/:id", facilityController.show, facilityController.showView);
router.get("/:id/edit", userController.isLoggedInAdmin, facilityController.edit);
router.put("/:id/update", userController.isLoggedInAdmin, facilityController.validationRules(), facilityController.validateUpdate, facilityController.update, facilityController.redirectView);
router.delete("/:id/delete", userController.isLoggedInAdmin, facilityController.delete, facilityController.redirectView);

module.exports = router;