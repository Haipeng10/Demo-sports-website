const Membership = require("../models/membership");
const User = require("../models/user");
const { body, validationResult } = require('express-validator');

// Helper function to extract membership parameters from the request body
const getMembershipParams = (body) => {
  return {
    type: body.type,
    duration: body.duration,
    price: body.price,
  };
};

// Validator function to check if duration is negative
const validateDuration = (duration) => {
  if (duration < 0) {
    return "Duration must be a non-negative number.";
  }
  return null;
};

module.exports = {
  // Fetch all memberships and store them in res.locals.memberships
  index: (req, res, next) => {
    Membership.find({})
      .then((memberships) => {
        res.locals.memberships = memberships;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching memberships: ${error.message}`);
        req.flash("error", "Failed to fetch memberships.");
        next(error);
      });
  },

  // Render the index view for memberships
  indexView: (req, res) => {
    res.render("memberships/index");
  },

  // Render the new membership form
  new: (req, res) => {
    res.render("memberships/new");
  },

  // Create a new membership using parameters from the request body
  create: (req, res, next) => {
    if (req.skip) return next();
    let membershipParams = getMembershipParams(req.body);
    Membership.create(membershipParams)
      .then((membership) => {
        req.flash("success", "Membership created successfully.");
        res.locals.redirect = "/memberships";
        next();
      })
      .catch((error) => {
        console.log(`Error creating membership: ${error.message}`);
        req.flash("error", "Failed to create membership.");
        next(error);
      });
  },

  // Buy a membership for the logged-in user
  buy: (req, res, next) => {
      if (!req.user) {
        req.flash("error", "You must be logged in to buy a membership.");
        res.locals.redirect = "/users/login";
        return next();
      }
    
      let membershipId = req.params.id;
      let userId = req.user._id;
    
      // Find the membership by ID and process the purchase
      Membership.findById(membershipId)
        .then((membership) => {
          User.findById(userId)
            .then((user) => {
              // Check if the user already has the membership
              const hasMembership = user.memberships.some((userMembership) =>
                userMembership.equals(membership._id)
              );
    
              if (hasMembership) {
                // If the user already has the membership, display an error message
                req.flash("error", "You already have this membership.");
                res.locals.redirect = "/memberships";
                return next();
              } else {
                // If the user does not have the membership, add the entire membership object to their account
                User.findByIdAndUpdate(
                  userId,
                  { $push: { memberships: membership.toObject() } },
                  { new: true }
                )
                  .then((user) => {
                    req.flash("success", "Membership purchased successfully.");
                    res.locals.redirect = "/memberships";
                    next();
                  })
                  .catch((error) => {
                    console.log(`Error updating user memberships: ${error.message}`);
                    req.flash("error", "Failed to purchase membership.");
                    next(error);
                  });
              }
            })
            .catch((error) => {
              console.log(`Error fetching user by ID: ${error.message}`);
              req.flash("error", "Failed to fetch user.");
              next(error);
            });
        })
        .catch((error) => {
          console.log(`Error fetching membership by ID: ${error.message}`);
          // If there was an error fetching the membership, display an error message
          req.flash("error", "Failed to fetch membership.");
          next(error);
      });
    },
  

    // Redirect to the specified path, or call next() if no path is specified
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  // Render the edit form for a specific membership
  edit: (req, res, next) => {
    let membershipId = req.params.id;
    Membership.findById(membershipId)
      .then((membership) => {
        res.locals.membership = membership;
        res.render("memberships/edit");
      })
      .catch((error) => {
        console.log(`Error fetching membership by ID: ${error.message}`);
        req.flash("error", "Failed to fetch membership.");
        next(error);
      });
  },

  // Update the membership with the new data from the request body
  // Update the membership with the new data from the request body
  update: (req, res, next) => {
    if (req.validationError) {
      res.locals.redirect = `/memberships/${req.params.id}/edit`;
      return next();
    }
    
    let membershipId = req.params.id;
    let membershipParams = getMembershipParams(req.body);

    Membership.findByIdAndUpdate(membershipId, {
      $set: membershipParams,
    })
      .then((membership) => {
        req.flash("success", "Membership updated successfully.");
        res.locals.redirect = "/memberships";
        next();
      })
      .catch((error) => {
        console.log(`Error updating membership: ${error.message}`);
        req.flash("error", "Failed to update membership.");
        next(error);
      });
  },


  // Delete the specified membership
  delete: (req, res, next) => {
    let membershipId = req.params.id;
    Membership.findByIdAndRemove(membershipId)
      .then(() => {
        req.flash("success", "Membership deleted successfully.");
        res.locals.redirect = "/memberships";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting membership: ${error.message}`);
        req.flash("error", "Failed to delete membership.");
        next(error);
      });
  },

  // Fetch and display a specific membership
  show: (req, res, next) => {
    let membershipId = req.params.id;
    Membership.findById(membershipId)
      .then((membership) => {
        res.locals.membership = membership;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching membership by ID: ${error.message}`);
        req.flash("error", "Failed to fetch membership.");
        next(error);
      });
  },

  // Render the show view for a specific membership
  showView: (req, res) => {
    res.render("memberships/show");
  },

  // Validate the membership
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let messages = errors.array().map((e) => e.msg);
        req.skip = true;
        console.log(`Error validating user: ${messages.join(" and ")}`);
        req.flash('error', messages.join(' and '));
        res.locals.redirect = '/memberships/new';
        next();
    } else {
        next();
    }
  },
  validateUpdate: (req, res, next) => {
    let duration = req.body.duration;

    // Validate duration
    const durationError = validateDuration(duration);
    if (durationError) {
      req.flash("error", durationError);
      req.validationError = durationError;
    }
    next();
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     let messages = errors.array().map((e) => e.msg);
    //     let membershipId = req.params.id;
    //     req.skip = true;
    //     console.log(`Error validating user: ${messages.join(" and ")}`);
    //     req.flash('error', messages.join(' and '));
    //     res.locals.redirect = `/memberships/${membershipId}/edit`;
    //     next();
    // } else {
    //     next();
    // }
  },
  // Validate the membership
  validationRules: () => {
      return [
          body('type', 'Type is required').notEmpty(),
          body('duration', 'Type is required')
            .notEmpty()
            .isNumeric()
            .custom(value => value > 0)
            .withMessage('Duration must be greater than 0'),
          body('price', 'Price is required')
            .notEmpty()
            .isNumeric()
            .custom(value => value > 0)
            .withMessage('Price must be greater than 0'),
      ];
  },
};