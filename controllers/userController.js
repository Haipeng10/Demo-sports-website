const User = require("../models/user");
const passport = require("passport");
const { body, validationResult } = require('express-validator');

const getUserParams = (body) => {
    return {
        name: body.name,
        email: body.email,
        password: body.password,
        memberships: body.memberships,
    };
};


module.exports = {
    // Get all users
    index: (req, res, next) => {
        User.find({})
            .then((users) => {
                res.locals.users = users;
                next();
            })
            .catch((error) => {
                console.log(`Error fetching users: ${error.message}`);
                next(error);
            });
    },
    // Render the index view
    indexView: (req, res) => {
        res.render("users/index");
    },
    // Render the form for creating a new user
    new: (req, res) => {
        res.render("users/new");
    },
    // Create a new user
    create: async (req, res, next) => {
        if (req.skip) return next();
        let newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                req.flash(
                    "success",
                    `${user.name}'s account created successfully!`
                );
                console.log("Successfully created user");
                req.session.userId = user._id;
                res.locals.redirect = `/`;
                next();
            } else {
                console.error(`Error creating user: ${error.message}`);
                res.locals.redirect = "/users/new";
                req.flash("error", `Failed to create user: ${error.message}`);
                next();
            }
        });
    },
    // Redirect views
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    // Get a user by ID
    show: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then((user) => {
                res.locals.user = user;
                next();
            })
            .catch((error) => {
                console.log(`show Error fetching user by ID: ${error.message}`);
                req.flash('error', 'Failed to retrieve user details.');
                next(error);
            });
    },
    // Render the show view
    showView: (req, res) => {
        res.render("users/show");
    },
    // Render the edit view
    edit: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then((user) => {
                res.render("users/edit", {
                    user: user,
                });
            })
            .catch((error) => {
                console.log(`edit Error fetching user by ID: ${error.message}`);
                next(error);
            });
    },
    // Update a user by ID
    update: async (req, res, next) => {
        if (req.skip) return next();
        let userId = req.params.id;
        let userParams = getUserParams(req.body);
        try {
            let user = await User.findById(userId);
            if (!user) {
                req.flash('error', 'User not found.');
                res.locals.redirect = '/users';
                return next();
            }
            // Update general fields
            Object.assign(user, userParams);
            // Update password if it's provided
            if (req.body.password) {
                await user.setPassword(req.body.password);
            }
            // Save the user with updated fields
            await user.save();
            req.flash('success', 'User updated successfully.');
            res.locals.redirect = `/users/${userId}`;
            res.locals.user = user;
            next();
        } catch (error) {
            console.log(`Error updating user by ID: ${error.message}`);
            req.flash('error', 'Failed to update user.');
            next(error);
        }
    },
    // Delete a user by ID
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
            .then(() => {
                req.flash('success', 'User deleted successfully.');
                res.locals.redirect = "/users";
                next();
            })
            .catch((error) => {
                console.log(`Error deleting user by ID: ${error.message}`);
                req.flash('error', 'Failed to delete user.');
                next();
            });
    },
    // Render the login view
    login: (req, res) => {
        res.render("users/login");
    },
    // Authenticate a user
    authenticate: (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('error', 'Failed to login.');
                return res.redirect('/users/login');
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash('success', 'Successfully logged in.');
                return res.redirect('/');
            });
        })(req, res, next);
    },
    // Validate user input
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
    // Validate user input
    validateUpdate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let messages = errors.array().map((e) => e.msg);
            let userId = req.params.id;
            req.skip = true;
            console.log(`Error validating user: ${messages.join(" and ")}`);
            req.flash('error', messages.join(' and '));
            res.locals.redirect = `/users/${userId}`;
            next();
        } else {
            next();
        }
    },
    // Logout a user
    logout: (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.flash("success", "You have been logged out!");
            res.locals.redirect = "/";
            next();
        });
    },
    // Validation rules
    userValidationRules: () => {
        return [
            body('name', 'Name is required').notEmpty(),
            body('email')
                .trim()
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Email is invalid'),
        ];
    },
    // Check if user is logged in
    isLoggedIn: (req, res, next) => {
        if (res.locals.loggedIn) {
            next()
        } else {
            req.flash('error', 'You must be logged in to view this page.')
            res.redirect('/users/login')
        }
    },
    // Check if user is admin
    isLoggedInAdmin: (req, res, next) => {
        if (res.locals.loggedIn && res.locals.currentUser.isAdmin) {
            next()
        } else {
            req.flash('error', 'You must be admin to view this page.')
            res.redirect('/users/login')
        }
    },
    // Check if user is admin or the user himself/herself
    allowAdminOrUser: (req, res, next) => {
        if (res.locals.loggedIn && (res.locals.currentUser.isAdmin || res.locals.currentUser._id.toString() === req.params.id)) {
            next();
        } else {
            req.flash('error', 'You must be the user or an admin to view/edit/delete this user.');
            res.redirect('/users/login');
        }
    },
};