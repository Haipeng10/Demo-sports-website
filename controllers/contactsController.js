const Contact = require("../models/contact");
const { body, validationResult } = require("express-validator");

// Helper function to extract contact parameters from the request body
const getContactParams = (body) => {
    return {
        name: body.name,
        email: body.email,
        title: body.title,
        issue: body.issue,
    };
};

module.exports = {
    // Get all contacts
    index: (req, res, next) => {
        Contact.find({})
            .then((contacts) => {
                res.locals.contacts = contacts;
                next();
            })
            .catch((error) => {
                console.log(`Error fetching contacts: ${error.message}`);
                req.flash("error", "Failed to fetch contacts.");
                next(error);
            });
    },
    // Render the index view
    indexView: (req, res) => {
        res.render("contacts/index");
    },
    // Render the form for creating a new contact
    new: (req, res) => {
        res.render("contacts/new");
    },
    // Create a new contact
    create: (req, res, next) => {
        if (req.skip) return next();
        let contactParams = getContactParams(req.body);
        Contact.create(contactParams)
            .then((contact) => {
                console.log("Successfully created contact");
                req.flash(
                    "success",
                    `Contact request created successfully!`
                );
                res.locals.redirect = "/contacts/new";
                res.locals.contact = contact;
                next();
            })
            .catch((error) => {
                console.log(`Error saving contact: ${error.message}`);
                res.locals.redirect = "/contacts/new";
                req.flash(
                    "error",
                    `Failed to create contact because: ${error.message}`
                );
                next();
            });
    },
    // Redirect to the specified path
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    // Get a contact by ID
    show: (req, res, next) => {
        let contactId = req.params.id;
        Contact.findById(contactId)
            .then((contact) => {
                res.locals.contact = contact;
                next();
            })
            .catch((error) => {
                console.log(`Error fetching contact by ID: ${error.message}`);
                req.flash("error", "Failed to fetch contact by ID.");
                next(error);
            });
    },
    // Render the contacts/show view
    showView: (req, res) => {
        res.render("contacts/show");
    },
    // Render the form for editing an existing contact
    edit: (req, res, next) => {
        let contactId = req.params.id;
        Contact.findById(contactId)
            .then((contact) => {
                res.render("contacts/edit", {
                    contact,
                });
            })
            .catch((error) => {
                console.log(`Error fetching contact by ID: ${error.message}`);
                req.flash('error', 'Failed to fetch contact for editing.');
                next(error);
            });
    },
    // Update an existing contact
    update: (req, res, next) => {
        if (req.skip) return next();
        let contactId = req.params.id,
        contactParams = getContactParams(req.body);
        console.log("contactParams: ", contactParams)
        // Chrome sends two requests for some reason, so we need to check if the title is undefined
        if (contactParams.title === undefined) {
            console.log("Invalid parameters received. Skipping...");
            return next();
        }
        Contact.findByIdAndUpdate(contactId, {
            $set: contactParams,
        })
            .then((contact) => {
                req.flash('success', 'Contact updated successfully.');
                res.locals.redirect = `/contacts/${contactId}`;
                res.locals.contact = contact;
                next();
            })
            .catch((error) => {
                console.log(`Error updating contact by ID: ${error.message}`);
                req.flash('error', 'Failed to update contact.');
                next(error);
            });
    },
    // Delete an existing contact
    delete: (req, res, next) => {
        let contactId = req.params.id;
        Contact.findByIdAndRemove(contactId)
            .then(() => {
                req.flash("success", "Contact deleted successfully.");
                res.locals.redirect = "/contacts";
                next();
            })
            .catch((error) => {
                console.log(`Error deleting contact by ID: ${error.message}`);
                req.flash("error", "Failed to delete contact.");
                next();
            });
    },
    // Validate the contact form
    validate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let messages = errors.array().map((e) => e.msg);
            req.skip = true;
            console.log(`Error validating contact: ${messages.join(" and ")}`);
            req.flash('error', messages.join(' and '));
            res.locals.redirect = '/contacts/new';
            next();
        } else {
            next();
        }
    },
    // Validate contact update
    validateUpdate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let messages = errors.array().map((e) => e.msg);
            let contactId = req.params.id;
            req.skip = true;
            console.log(`Error validating contact: ${messages.join(" and ")}`);
            req.flash('error', messages.join(' and '));
            res.locals.redirect = `/contacts/${contactId}`;
            next();
        } else {
            next();
        }
    },
    // Validation rules
    contactValidationRules: () => {
        return [
            body('name', 'Name is required').notEmpty(),
            body('email')
                .trim()
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Email is invalid'),
            body('title', 'Title is required').notEmpty(),
            body('issue', 'Issue is required').notEmpty(),
        ];
    },
};

