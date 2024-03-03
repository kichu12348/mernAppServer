const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    message: {
      type: String,
    },
    roomID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const message = model("message", messageSchema);


module.exports = message;   