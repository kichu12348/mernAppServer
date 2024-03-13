const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    from: {
      type: String,
    },
    message: {
      type: String,
    },
    roomID: {
      type: String,
      required: true,
    },
    encryptedSymetricKeyA: {
      type: String,
    },
    encryptedSymetricKeyB: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Message = model("message", messageSchema);


module.exports = Message;   