const Facility = require('../models/facility');
const { body, validationResult } = require('express-validator');
//helper function to extract facility parameters from the request body
const getFacilityParams = (body) => {
    return {
        name: body.name,
        type: body.type,
        description: body.description,
    };
  };

module.exports = {
    // Fetch all facilities and store them in res.locals.facilities
    index: (req, res, next) => {
        Facility.find({})
            .then((facilities) => {
                res.locals.facilities = facilities;
                next();
            })
            .catch((error) => {
                console.log(`Error fetching Facility: ${error.message}`);
                next(error);
            });
    },
    // Render the index view for facilities
    indexView: (req, res) => {
        res.render("facilities/index", {facilities: res.locals.facilities});
    },
    //find single facility by ID
    show: (req, res, next) => {
        let facilityId = req.params.id;
        Facility.findById(facilityId)
        .then((facility) => {
            res.locals.facility = facility;
            next();
        })
        .catch((error) => {
            console.log(`Error fetching facility by ID: ${error.message}`);
            next(error);
        });
    },
    // Render the single facility view
    showView: (req, res) => {
        res.render("facilities/show");
    },
    // Render the edit facility form
    edit: (req, res, next) => {
        let facilityId = req.params.id;
        Facility.findById(facilityId)
            .then((facility) => {
                res.render("facilities/edit", {
                    facility: facility,
                });
            })
            .catch((error) => {
                console.log(`Error fetching facility by ID: ${error.message}`);
                next(error);
            });
    },
    // Update the facility
    update: (req, res, next) => {
        let facilityId = req.params.id,
            facilityParams = getFacilityParams(req.body);
            Facility.findByIdAndUpdate(facilityId, {
                $set: facilityParams,
            })
            .then((facility) => {
                res.locals.redirect = `/facilities`;
                res.locals.facility = facility;
                req.flash(
                    "success",
                    `The facility details is update successfully!`
                );
                next();
            })
            .catch((error) => {
                console.log(`Error updating facility by ID: ${error.message}`);
                next(error);
            });
    },
    // Delete the facility
    delete: (req, res, next) => {
        let facilityId = req.params.id;
        Facility.findByIdAndRemove(facilityId)
            .then(() => {
                res.locals.redirect = "/facilities";
                req.flash(
                    "success",
                    `The facility is deleted successfully!`
                );
                next();
            })
            .catch((error) => {
                console.log(`Error deleting facility by ID: ${error.message}`);
                next();
            });
    },
    // Render the new facility form
    new: (req, res) => {
        res.render("facilities/new");
    },
    // Create a new facility
    create: (req, res, next) => {
        let newfacility = new Facility(getFacilityParams(req.body));
        newfacility.save()
            .then((facility) => {
                res.locals.redirect = "/facilities";
                res.locals.facility = facility;
                req.flash(
                    "success",
                    `The facility is created successfully!`
                );
                next();
            })
            .catch((error) => {
                console.log(`Error saving facility: ${error.message}`);
                next(error);
            });
    },
    // Redirect to the appropriate view
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    // Validate the facility
    validate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let messages = errors.array().map((e) => e.msg);
            req.skip = true;
            console.log(`Error validating user: ${messages.join(" and ")}`);
            req.flash('error', messages.join(' and '));
            res.locals.redirect = '/facilities/new';
            next();
        } else {
            next();
        }
    },
    // Validate the facility
    validateUpdate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let messages = errors.array().map((e) => e.msg);
            let facilityId = req.params.id;
            req.skip = true;
            console.log(`Error validating user: ${messages.join(" and ")}`);
            req.flash('error', messages.join(' and '));
            res.locals.redirect = `/facilities/${facilityId}`;
            next();
        } else {
            next();
        }
    },
    // Validate the facility
    validationRules: () => {
        return [
            body('name', 'Name is required').notEmpty(),
            body('type', 'Type is required').notEmpty(),
            body('description', 'Description is required').notEmpty(),
        ];
    },
};
        