const Missing = require("../models/missing.js");
const moment = require("moment");

const lost_page = async (req, res) => {
  const missings = await Missing.find({ status: "missing" });
  res.render("lost", {
    title: "Lost",
    username: req.session.username,
    missings,
    moment,
  });
};

const found_page = async (req, res) => {
  const founds = await Missing.find({ status: "found" });
  res.render("found", {
    title: "Found",
    username: req.session.username,
    founds,
    moment,
  });
};

const post_page = (req, res) => {
  res.render("post", { title: "Post", username: req.session.username });
};

const post = async (req, res) => {
  const petName = req.body.petName;
  const postOwner = req.session.username;
  const petType = req.body.petType;
  const location = req.body.location;
  const status = req.body.status;
  const date = req.body.date;
  const comment = req.body.comment;
  const contactEmail = req.body.contactEmail;
  const contactNumber = req.body.contactNumber;
  const image = req.file.filename;
  const post = new Missing({
    petName,
    postOwner,
    petType,
    location,
    status,
    date,
    comment,
    contactEmail,
    contactNumber,
    image,
  });
  await post.save();
  res.redirect("/post");
};

const contact = async (req, res) => {
  const id = req.body.id;
  const missing = await Missing.findOne({ _id: id });
  if (missing) {
    res.render("contact", {
      title: "Contact",
      username: req.session.username,
      missing,
      moment, // Pass moment here
      errorMessages: [],
    });
  }
};

const lostSearch = async (req, res) => {
  const searchQuery = req.body;
  const queryConditions = [];

  if (searchQuery.name) {
    queryConditions.push({ petName: new RegExp(`^${searchQuery.name}$`, "i") });
  }
  if (searchQuery.location) {
    queryConditions.push({
      location: { $regex: new RegExp(searchQuery.location, "i") },
    });
  }
  if (searchQuery.date) {
    queryConditions.push({
      date: { $gt: new Date(searchQuery.date) },
    });
  }
  if (searchQuery.type) {
    queryConditions.push({
      petType: searchQuery.type,
    });
  }

  let query;
  if (queryConditions.length > 0) {
    query = {
      $and: [{ status: "missing" }, { $or: queryConditions }],
    };
  } else {
    query = { status: "missing" };
  }

  const missings = await Missing.find(query);

  res.render("lost", {
    title: "Lost",
    username: req.session.username,
    missings,
    moment,
  });
};

const foundSearch = async (req, res) => {
  const searchQuery = req.body;
  const queryConditions = [];

  if (searchQuery.name) {
    queryConditions.push({ petName: new RegExp(`^${searchQuery.name}$`, "i") });
  }
  if (searchQuery.location) {
    queryConditions.push({
      location: { $regex: new RegExp(searchQuery.location, "i") },
    });
  }
  if (searchQuery.date) {
    queryConditions.push({
      date: { $gt: new Date(searchQuery.date) },
    });
  }
  if (searchQuery.type) {
    queryConditions.push({
      petType: searchQuery.type,
    });
  }

  let query;
  if (queryConditions.length > 0) {
    query = {
      $and: [{ status: "found" }, { $or: queryConditions }],
    };
  } else {
    query = { status: "found" };
  }

  const founds = await Missing.find(query);

  res.render("found", {
    title: "Found",
    username: req.session.username,
    founds,
    moment,
  });
};

module.exports = {
  lost_page,
  found_page,
  post_page,
  post,
  contact,
  lostSearch,
  foundSearch,
};
