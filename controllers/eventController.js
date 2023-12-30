const Event = require('../models/event');
const { body, validationResult } = require('express-validator');

const getEventParams = (body) => {
    return {
        name: body.name,
        description: body.description,
        date: body.date,
        location: body.location,
    };
  };

module.exports = {
    index: (req, res, next) => {
        Event.find({})
          .then((events) => {
            res.locals.events = events;
            next();
          })
          .catch((error) => {
            console.log(`Error fetching programs: ${error.message}`);
            req.flash("error", "Failed to fetch programs.");
            next(error);
          });
    },

    // Render the index view for event
    indexView: (req, res) => {
        res.render("events/index");
    },

    show: (req, res, next) => {
        let eventId = req.params.id;
        Event.findById(eventId)
        .then((events) => {
            res.locals.events = events;
            next();
        })
        .catch((error) => {
            console.log(`Error fetching program by ID: ${error.message}`);
            next(error);
        });
    },
    showView: (req, res) => {
        res.render("events/show");
    },

    edit: (req, res, next) => {
        let eventId = req.params.id;
        Event.findById(eventId)
            .then((event) => {
                res.render("events/edit", {
                    event: event,
                });
            })
            .catch((error) => {
                console.log(`Error fetching event by ID: ${error.message}`);
                next(error);
            });
    },
    update: (req, res, next) => {
        let eventId = req.params.id,
            eventParams = getEventParams(req.body);
            Event.findByIdAndUpdate(eventId, {
                $set: eventParams,
            })
            .then((events) => {
                res.locals.redirect = "/events";;
                res.locals.events = events;
                req.flash(
                    "success",
                    `The event's details is update successfully!`
                );
                next();
            })
            .catch((error) => {
                console.log(`Error updating event by ID: ${error.message}`);
                next(error);
            });
    },
    delete: (req, res, next) => {
        let eventId = req.params.id;
        Event.findByIdAndRemove(eventId)
            .then(() => {
                res.locals.redirect = "/events";
                req.flash(
                    "success",
                    `The event is deleted successfully!`
                );
                next();
            })
            .catch((error) => {
                console.log(`Error deleting event by ID: ${error.message}`);
                next();
            });
    },
    new: (req, res) => {
        res.render("events/new");
    },

    create: (req, res, next) => {
        let newEvent = new Event(getEventParams(req.body));
        newEvent.save()
            .then((events) => {
                res.locals.redirect = "/events";
                res.locals.events = events;
                req.flash(
                    "success",
                    `The program is created successfully!`
                );
                next();
            })
            .catch((error) => {
                console.log(`Error saving event: ${error.message}`);
                next(error);
            });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    validate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let messages = errors.array().map((e) => e.msg);
            req.skip = true;
            console.log(`Error validating user: ${messages.join(" and ")}`);
            req.flash('error', messages.join(' and '));
            res.locals.redirect = '/users/new';
            next();
        } else {
            next();
        }
    },
    eventValidationRules: () => {
        return [
            body('name', 'Name is required').notEmpty(),
            body('description', 'Description is required').notEmpty(),
            body('date', 'Date is required').notEmpty(),
            body('location', 'Location is required').notEmpty(),
        ];
    },
};
        
// const Event = require('../models/event');
// const { body, validationResult } = require("express-validator");

// // Helper function to extract contact parameters from the request body
// const getEventParams = (body) => {
//     return {
//         name: body.name,
//         description: body.description,
//         date: body.date,
//         location: body.location,
//     };
// };

// module.exports = {
//     // Get all events
//     index: (req, res, next) => {
//         Event.find({})
//             .then((events) => {
//                 res.locals.events = events;
//                 next();
//             })
//             .catch((error) => {
//                 console.log(`Error fetching events: ${error.message}`);
//                 req.flash("error", "Failed to fetch events.");
//                 next(error);
//             });
//     },
//     // Render the index view
//     indexView: (req, res) => {
//         res.render("events/index");
//     },
//     // Render the form for creating a new event
//     new: (req, res) => {
//         res.render("events/new");
//     },
//     // Get a event by ID
//     show: (req, res, next) => {
//         let eventId = req.params.id;
//         Event.findById(eventId)
//             .then((events) => {
//                 res.locals.events = events;
//                 next();
//             })
//             .catch((error) => {
//                 console.log(`Error fetching event by ID: ${error.message}`);
//                 req.flash("error", "Failed to fetch event by ID.");
//                 next(error);
//             });
//     },
//     // Render the events/show view
//     showView: (req, res) => {
//         res.render("events/show");
//     },
//     // Create a new event
//     create: (req, res, next) => {
//         if (req.skip) return next();
//         let eventParams = getEventParams(req.body);
//         Event.create(eventParams)
//             .then((events) => {
//                 console.log("Successfully created event");
//                 req.flash(
//                     "success",
//                     `Event created successfully!`
//                 );
//                 res.locals.redirect = "/events";
//                 res.locals.events = events;
//                 next();
//             })
//             .catch((error) => {
//                 console.log(`Error saving event: ${error.message}`);
//                 res.locals.redirect = "/events/new";
//                 req.flash(
//                     "error",
//                     `Failed to create event because: ${error.message}`
//                 );
//                 next();
//             });
//     },
//     // Redirect to the specified path
//     redirectView: (req, res, next) => {
//         let redirectPath = res.locals.redirect;
//         if (redirectPath) res.redirect(redirectPath);
//         else next();
//     },
//     // Validates event
//     validate: (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             let messages = errors.array().map((e) => e.msg);
//             req.skip = true;
//             console.log(`Error validating user: ${messages.join(" and ")}`);
//             req.flash('error', messages.join(' and '));
//             res.locals.redirect = '/users/new';
//             next();
//         } else {
//             next();
//         }
//     },
//     edit: (req, res, next) => {
//         let eventId = req.params.id;
//         Event.findById(eventId)
//             .then((events) => {
//                 res.render("events/edit", {
//                     events: events,
//                 });
//             })
//             .catch((error) => {
//                 console.log(`Error fetching event by ID: ${error.message}`);
//                 req.flash('error', 'Failed to fetch event for editing.');
//                 next(error);
//             });
//     },
//     // Update an existing event
//     update: (req, res, next) => {
//         // if (req.skip) return next();
//         // let eventId = req.params.id,
//         // eventParams = getEventParams(req.body);
//         // console.log("eventParams: ", eventParams)
//         // // Chrome sends two requests for some reason, so we need to check if the title is undefined
//         // if (eventParams.title === undefined) {
//         //     console.log("Invalid parameters received. Skipping...");
//         //     return next();
//         // }
//         // Event.findByIdAndUpdate(eventId, {
//         //     $set: eventParams,
//         // })
//         //     .then((events) => {
//         //         req.flash('success', 'Event updated successfully.');
//         //         res.locals.redirect = `/events/${eventId}`;
//         //         res.locals.events = events;
//         //         next();
//         //     })
//         //     .catch((error) => {
//         //         console.log(`Error updating event by ID: ${error.message}`);
//         //         req.flash('error', 'Failed to update event.');
//         //         next(error);
//         //     });
//         let eventId = req.params.id,
//         eventParams = getEventParams(req.body);
//         Event.findByIdAndUpdate(eventId, {
//             $set: eventParams,
//         })
//         .then((events) => {
//             res.locals.redirect = `/events`;
//             res.locals.events = events;
//             req.flash(
//                 "success",
//                 `The event details is update successfully!`
//             );
//             next();
//         })
//         .catch((error) => {
//             console.log(`Error updating event by ID: ${error.message}`);
//             next(error);
//         });
//     },
//     // Delete an existing event
//     delete: (req, res, next) => {
//         let eventId = req.params.id;
//         Event.findByIdAndRemove(eventId)
//             .then(() => {
//                 req.flash("success", "Event deleted successfully.");
//                 res.locals.redirect = "/events";
//                 next();
//             })
//             .catch((error) => {
//                 console.log(`Error deleting event by ID: ${error.message}`);
//                 req.flash("error", "Failed to delete event.");
//                 next();
//             });
//     },
// };