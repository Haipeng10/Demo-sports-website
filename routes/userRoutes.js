const router = require("express").Router();
const usersController = require("../controllers/userController");

// Users routes
// Show all users
router.get("/", usersController.isLoggedInAdmin, usersController.index, usersController.indexView);
// Create a new user
router.get("/new", usersController.new);
router.post(
    "/new",
    usersController.userValidationRules(),
    usersController.validate,
    usersController.create,
    usersController.redirectView
);
// Login a user
router.get("/login", usersController.login);
router.post("/login", usersController.authenticate);
// Logout a user
router.get("/logout", usersController.logout, usersController.redirectView);
// Show a user
router.get("/:id", usersController.allowAdminOrUser, usersController.show, usersController.showView);
// Edit a user
router.get("/:id/edit", usersController.allowAdminOrUser, usersController.edit);
router.put(
    "/:id/update", 
    usersController.allowAdminOrUser,
    usersController.userValidationRules(),
    usersController.validateUpdate,
    usersController.update,
    usersController.redirectView
);
// Delete a user
router.delete(
    "/:id/delete",
    usersController.allowAdminOrUser,
    usersController.delete,
    usersController.redirectView
);

module.exports = router;