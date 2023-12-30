const express = require('express');
const mongoose = require("mongoose");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const connectFlash = require("connect-flash");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const passport = require("passport");
const User = require("./models/user");
const router = require("./routes/index");
const app = express();

app.use(express.static("public"));
app.use(layouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("port", 8080);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Brandeis_Sports");
const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to mongodb!");
});

app.use(
    methodOverride("_method", {
        methods: ["POST", "GET"],
    })
);

// Express Session
app.use(cookieParser("secret-pascode"));
app.use(
    expressSession({
        secret: "secret_passcode",
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
        resave: false,
        saveUninitialized: false,
    })
);

app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());
// Passport config
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.isAdmin = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

app.use("/", router);

//port
app.listen(app.get("port"), () => {
    console.log(`Server is running at http://localhost:${app.get("port")}`);
});
