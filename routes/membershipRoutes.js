// Import necessary modules and controllers
const router = require("express").Router();
const contactsController = require("../controllers/contactsController");
const membershipController = require("../controllers/membershipController");
const userController = require("../controllers/userController");

// Route for displaying all memberships
router.get("/", membershipController.index, membershipController.indexView);
// Route for displaying the form to create a new membership
router.get("/new", userController.isLoggedInAdmin, membershipController.new);
// Route for submitting the new membership form
router.post("/new", 
    userController.isLoggedInAdmin, 
    membershipController.validationRules(), 
    membershipController.validate, 
    membershipController.create, 
    membershipController.redirectView
);
// Route for displaying a specific membership
router.get("/:id", membershipController.show, membershipController.showView);
// Route for displaying the form to edit a membership
router.get("/:id/edit", userController.isLoggedInAdmin, membershipController.edit);
// Route for submitting the edited membership form
router.put("/:id/update", 
    userController.isLoggedInAdmin,
    membershipController.validationRules(),
    membershipController.validateUpdate,
    membershipController.update, 
    membershipController.redirectView
);
// Route for deleting a membership
router.post("/:id/delete", userController.isLoggedInAdmin, membershipController.delete, membershipController.redirectView);
// Route for buying a membership
router.post("/:id/buy", userController.isLoggedIn, membershipController.buy, membershipController.redirectView);

// Export the router
module.exports = router;