const router = require("express").Router();
const contactsController = require("../controllers/contactsController");
const userController = require("../controllers/userController");

// Show all contacts (assuming you want to restrict to logged-in admins)
router.get("/", userController.isLoggedInAdmin, contactsController.index, contactsController.indexView);
// Create a new contact
router.get("/new", contactsController.new);
router.post(
    "/new",
    contactsController.contactValidationRules(),
    contactsController.validate,
    contactsController.create,
    contactsController.redirectView
);
// // Show a contact (assuming you want to restrict to logged-in admins)
router.get("/:id", userController.isLoggedInAdmin, contactsController.show, contactsController.showView);
// Edit a contact (assuming you want to restrict editing to logged-in admins)
router.get("/:id/edit", userController.isLoggedInAdmin, contactsController.edit);
// Update a contact (assuming you want to restrict updating to logged-in admins)
router.put(
    "/:id/update",
    userController.isLoggedInAdmin,
    contactsController.contactValidationRules(),
    contactsController.validateUpdate,
    contactsController.update,
    contactsController.redirectView
);
// Delete a contact (assuming you want to restrict deletion to logged-in admins)
router.delete(
    "/:id/delete",
    userController.isLoggedInAdmin,
    contactsController.delete,
    contactsController.redirectView
);

module.exports = router;
