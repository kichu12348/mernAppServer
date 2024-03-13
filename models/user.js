const { Schema, model } = require("mongoose");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    contacts: [
      {
        contact: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        roomID: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const hashPassword = async (password) => {
  const salt = await crypto.randomBytes(16).toString("hex");
  const hash = await crypto
    .createHmac("sha512", salt)
    .update(password)
    .digest("hex");
  return {
    salt,
    hash,
  };
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const { salt, hash } = await hashPassword(this.password);
    this.password = hash;
    this.salt = salt;
    next();
  }
});

const User = model("user", userSchema);

module.exports = User;
