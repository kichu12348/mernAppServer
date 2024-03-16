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
    encryptedKeyA: {
      type: String,
    },
    encryptedKeyB: {
      type: String,
    },
    iv: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Message = model("message", messageSchema);


module.exports = Message;   