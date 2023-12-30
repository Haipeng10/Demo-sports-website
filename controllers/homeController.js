const Membership = require("../models/membership");
const Facility = require("../models/facility");
const Event = require("../models/event");
const Program = require("../models/program");

// Respond to the home page
module.exports = {
  respondForHomePage: (req, res, next) => {
  Promise.all([
    Program.find(),
    Facility.find(),
    Event.find(),
    Membership.find()
  ])
  .then(([programs, facilities, events, memberships]) => {
    // Render the 'index' template with the memberships, facilities, and events data
    res.render("index", { programs, facilities, events, memberships });
  })
    .catch(error => {
      // Log the error and pass it to the error handling middleware
      console.log(`Error fetching data: ${error.message}`);
      next(error);
    });
},

  // Respond to the 'about' page
respondForAbout: (req, res) => {
  // Render the 'about' template
  res.render("about");
},

};
