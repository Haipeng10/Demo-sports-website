/** Routes that are used */

const router = require("express").Router();
const userRoutes = require("./userRoutes");
const homeRoutes = require("./homeRoutes");
const errorRoutes = require("./errorRoutes");
const contactRoutes = require("./contactRoutes");
const membershipRoutes = require("./membershipRoutes");
const facilityRoutes = require("./facilityRoutes");
const programRoutes = require("./programRoutes");
const eventRoutes = require("./eventRoutes");

router.use("/", homeRoutes);
router.use("/users", userRoutes);
router.use("/contacts", contactRoutes);
router.use("/memberships", membershipRoutes);
router.use("/facilities", facilityRoutes);
router.use("/programs", programRoutes);
router.use("/events", eventRoutes);
router.use("/", errorRoutes);

module.exports = router;