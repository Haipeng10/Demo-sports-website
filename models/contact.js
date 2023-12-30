const mongoose = require("mongoose");

// Contact Schema
const contactSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        issue: {
            type: String,
            required: true,
        },
    });

module.exports = mongoose.model("Contact", contactSchema);
