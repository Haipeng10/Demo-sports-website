const router = require("express").Router();
const eventController = require("../controllers/eventController");

// Shows all events
router.get("/", eventController.index, eventController.indexView);
// Create a new event
router.get("/new", eventController.new);
router.post("/create", eventController.validate, eventController.create, eventController.redirectView);
// // Show a event
router.get("/:id", eventController.show, eventController.showView);
// Edit a event (assuming you want to restrict editing to logged-in users)
router.get("/:id/edit", eventController.edit);
// Update a event (assuming you want to restrict updating to logged-in users)
router.put("/:id/update", eventController.update, eventController.redirectView);
// Delete a event (assuming you want to restrict deletion to logged-in users)
router.delete("/:id/delete", eventController.delete, eventController.redirectView);

module.exports = router;
