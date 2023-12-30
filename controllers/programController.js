const Program = require('../models/program');
const { body, validationResult } = require('express-validator');

//helper function to extract program parameters from the request body
const getProgramParams = (body) => {
    return {
        name: body.name,
        description: body.description,
        schedule: body.schedule,
        instructor: body.instructor,
    };
  };

module.exports = {
    // Fetch all programs and store them in res.locals.programs
    index: (req, res, next) => {
        Program.find({})
          .then((programs) => {
            res.locals.programs = programs;
            next();
          })
          .catch((error) => {
            console.log(`Error fetching programs: ${error.message}`);
            req.flash("error", "Failed to fetch programs.");
            next(error);
          });
    },

    // Render the index view for programs
    indexView: (req, res) => {
        res.render("programs/index");
    },
    // find single program by ID
    show: (req, res, next) => {
        let programId = req.params.id;
        Program.findById(programId)
        .then((program) => {
            res.locals.program = program;
            next();
        })
        .catch((error) => {
            console.log(`Error fetching program by ID: ${error.message}`);
            next(error);
        });
    },
    // Render the single program view
    showView: (req, res) => {
        res.render("programs/show");
    },
    // Render the edit program form
    edit: (req, res, next) => {
        let programId = req.params.id;
        Program.findById(programId)
            .then((program) => {
                res.render("programs/edit", {
                    program: program,
                });
            })
            .catch((error) => {
                console.log(`Error fetching program by ID: ${error.message}`);
                next(error);
            });
    },
    // Update a program using parameters from the request body
    update: (req, res, next) => {
        let programId = req.params.id,
            programParams = getProgramParams(req.body);
            Program.findByIdAndUpdate(programId, {
                $set: programParams,
            })
            .then((program) => {
                res.locals.redirect = "/programs";;
                res.locals.program = program;
                req.flash(
                    "success",
                    `The program details is update successfully!`
                );
                next();
            })
            .catch((error) => {
                console.log(`Error updating program by ID: ${error.message}`);
                next(error);
            });
    },
    // Delete a program
    delete: (req, res, next) => {
        let programId = req.params.id;
        Program.findByIdAndRemove(programId)
            .then(() => {
                res.locals.redirect = "/programs";
                req.flash(
                    "success",
                    `The program is deleted successfully!`
                );
                next();
            })
            .catch((error) => {
                console.log(`Error deleting program by ID: ${error.message}`);
                next();
            });
    },

    // Render the new program form
    new: (req, res) => {
        res.render("programs/new");
    },
    // Create a new program using parameters from the request body
    create: (req, res, next) => {
        let newprogram = new Program(getProgramParams(req.body));
        newprogram.save()
            .then((program) => {
                res.locals.redirect = "/programs";
                res.locals.program = program;
                req.flash(
                    "success",
                    `The program is created successfully!`
                );
                next();
            })
            .catch((error) => {
                console.log(`Error saving program: ${error.message}`);
                next(error);
            });
    },
    // Redirect to the appropriate view
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    // Validate the program parameters
    validate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let messages = errors.array().map((e) => e.msg);
            req.skip = true;
            console.log(`Error validating user: ${messages.join(" and ")}`);
            req.flash('error', messages.join(' and '));
            res.locals.redirect = '/programs/new';
            next();
        } else {
            next();
        }
    },
    // Validate the program parameters
    validateUpdate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let programId = req.params.id;
            let messages = errors.array().map((e) => e.msg);
            req.skip = true;
            console.log(`Error validating user: ${messages.join(" and ")}`);
            req.flash('error', messages.join(' and '));
            res.locals.redirect = `/programs/${programId}}`;
            next();
        } else {
            next();
        }
    },
    // Validate the program parameters
    validationRules: () => {
        return [
            body('name', 'Name is required').notEmpty(),
            body('description', 'Description is required').notEmpty(),
            body('schedule', 'Schedule is required').notEmpty(),
            body('instructor', 'Instructor is required').notEmpty(),
        ];
    },
};
        