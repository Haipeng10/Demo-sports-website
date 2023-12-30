const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        memberships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Membership' }],
        isAdmin: { type: Boolean, default: false },
    });

// Add passport-local-mongoose to User Schema
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
module.exports = mongoose.model("User", userSchema);