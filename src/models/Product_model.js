const {Schema, model} = require("mongoose");

const schema = new Schema(
  {
    title: {
      type: String,
      maxlength: 32,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 32,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      maxlength: 32,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Product", schema);
