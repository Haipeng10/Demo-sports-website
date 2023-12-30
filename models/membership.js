const mongoose = require("mongoose");

const membershipSchema = mongoose.Schema(
    {
        type: {type: String, required: true},
        duration: {type: Number, required: true},
        price: {type: Number, required: true}
    }
)

module.exports = mongoose.model("Membership", membershipSchema);
