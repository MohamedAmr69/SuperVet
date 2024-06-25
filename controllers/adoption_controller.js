const Adoption = require("../models/adoption");
const moment = require("moment");

const adoptionPage = async (req, res) => {
  const adoptions = await Adoption.find();
  console.log(adoptions);
  res.render("adoption", {
    title: "adoption page",
    username: req.session.username,
    adoptions,
    moment,
  });
};

const adoptionPost = (req, res) => {
  res.render("addAdoption", {
    title: "adoption page",
    username: req.session.username,
  });
};

const addAdoptionPost = async (req, res) => {
  const adoptionPost = new Adoption({
    petName: req.body.petName,
    postOwner: req.session.username,
    petType: req.body.petType,
    birthDate: req.body.BirthDate,
    comment: req.body.comment,
    contactNumber: req.body.contactNumber,
    contactEmail: req.body.contactEmail,
    image: req.file.filename,
  });
  await adoptionPost
    .save()
    .then(() => {
      res.redirect("/adoption");
    })
    .catch((err) => {
      console.log(err);
    });
};

const contactAdoption = async (req, res) => {
  const id = req.body.id;
  const adoption = await Adoption.findOne({ _id: id });
  if (adoption) {
    res.render("contactAdoption", {
      title: "Contact",
      username: req.session.username,
      adoption,
      moment,
      errorMessages: [],
    });
  }
};

module.exports = {
  adoptionPage,
  adoptionPost,
  addAdoptionPost,
  contactAdoption,
};
