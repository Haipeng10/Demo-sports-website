const router = require("express").Router();
const programController = require("../controllers/programController");
const userController = require("../controllers/userController");

//routers for program
router.get("/", programController.index, programController.indexView);
router.get("/new", userController.isLoggedInAdmin, programController.new);
router.post("/create", userController.isLoggedInAdmin, 
    programController.validationRules(), 
    programController.validate, 
    programController.create, 
    programController.redirectView
);

router.get("/:id", programController.show, programController.showView);
router.get("/:id/edit", userController.isLoggedInAdmin, programController.edit);
router.put("/:id/update", 
    userController.isLoggedInAdmin,
    programController.validationRules(), 
    programController.validateUpdate, 
    programController.update, 
    programController.redirectView
);
router.delete("/:id/delete", userController.isLoggedInAdmin, programController.delete, programController.redirectView);

module.exports = router;