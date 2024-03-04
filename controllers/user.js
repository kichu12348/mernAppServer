const User = require("../models/user");
const message = require("../models/message");
const crypto = require("crypto");
const { createToken } = require("../services/Auth");
const shortid = require("shortid");

// function to signUp
async function signUp(req, res) {
  const { username, email, password } = req.body;
  const checkUserE = await User.findOne({ email });
  const checkUserU = await User.findOne({ username });

  if (checkUserE) {
    res.json({
      ok: false,
      message: "Email already exists",
    });
    return;
  }
  if (checkUserU) {
    res.json({
      ok: false,
      message: "Username already exists",
    });
    return;
  }
  const apikey = "CglVv3piOwAuoJ";
  const url = `https://api.multiavatar.com/${username}.png?apikey=${apikey}`;

  const newUser = await User.create({
    username,
    email,
    password,
    profilePicture: url,
  });

  const data = await newUser.populate("contacts.contact");

  const token = createToken(newUser._id.toString());
  const user = {
    username: newUser.username,
    email: newUser.email,
    profilePicture: newUser.profilePicture,
    contacts: data.contacts ? data.contacts : [],
  };
  res.json({
    ok: true,
    message: "User created 😎",
    token,
    user,
  });
}

// function to login

async function login(req, res) {
  const { email, password } = req.body;
  const checkUser = await User.findOne({ email }).populate("contacts.contact");
  if (!checkUser) {
    res.json({
      ok: false,
      message: "user not found",
    });
    return;
  }
  const hashPassword = await crypto
    .createHmac("sha512", checkUser.salt)
    .update(password)
    .digest("hex");
  if (hashPassword !== checkUser.password) {
    res.json({
      ok: false,
      message: "wrong password",
    });
    return;
  }
  const token = createToken(checkUser._id.toString());
  const user = {
    username: checkUser.username,
    email: checkUser.email,
    profilePicture: checkUser.profilePicture,
    contacts: checkUser.contacts,
  };
  res.json({
    ok: true,
    message: "login success 😎",
    token,
    user,
  });
}

// function to addContact
async function addContact(req, res) {
  const { contactID } = req.body;
  const user = req.user;
  const check = user.contacts.find((contact) => contact.contact._id.toString() === contactID);

  if (check) {
    res.json({
      ok: false,
      message: "contact already exists",
    });
    return;
  }
  const roomID = shortid.generate();

  await User.findByIdAndUpdate(user._id.toString(), {
    $push: {
      contacts: {
        contact: contactID,
        roomID,
      },
    },
  }).populate("contacts.contact");
  
  


await User.findByIdAndUpdate(contactID, {
    $push: {
      contacts: {
        contact: user._id,
        roomID,
      },
    },
  });

  const data = await User.findById(user._id.toString()).populate("contacts.contact");
  res.json({
    ok: true,
    message: "contact added",
    contacts: data.contacts,
  });
}

async function deleteContact(req, res) {
  const { contactID } = req.body;
  const user = req.user;
  const check = user.contacts.find((contact) => contact.contact === contactID);
  if (!check) {
    res.json({
      ok: false,
      message: "contact not found",
    });
    return;
  }
  await message.deleteMany({ roomID: check.roomID });
  const newData = await User.findByIdAndUpdate(user._id, {
    $pull: {
      contacts: {
        contact: contactID,
      },
    },
  });
  const data = await newData.populate("contacts.contact")
  await User.findByIdAndUpdate(contactID, {
    $pull: {
      contacts: {
        contact: user._id,
      },
    },
  });
  res.json({
    ok: true,
    message: "contact deleted",
    contacts: data.contacts,
  });
}

async function searchQuery(req, res) {
  const { searchQuery } = await req.body;
  const users = await User.find({
    username: { $regex: searchQuery, $options: "i" },
  });
  res.json({
    ok: true,
    data: users,
  });
}

module.exports = { signUp, login, addContact, deleteContact, searchQuery };
