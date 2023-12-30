const mongoose = require("mongoose");

const programSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      schedule: { type: String, required: true },
      instructor: { type: String, required: true },
    },
  );

module.exports = mongoose.model("Program", programSchema);
