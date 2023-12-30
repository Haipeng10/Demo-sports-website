const mongoose = require("mongoose");

const facilitySchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
      description: { type: String, required: true },
    },
  );

module.exports = mongoose.model("Facility", facilitySchema);
