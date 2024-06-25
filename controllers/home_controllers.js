const Users = require("../models/users.js");
const bcrypt = require("bcrypt");
const User = require("../models/users.js");
const Transactions = require("../models/transactions.js")
const Appointments = require("../models/appointment.js");
const { clearCache } = require("ejs");

const home = async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.session.username });
    res.render("home", { title: "Home", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const adminHome = async (req, res) => {
  try {
    const user = await Users.findOne({ username: 'admin' });
    res.render("adminHome", { title: "Admin Home Page", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

const doctorHome = async (req, res) => {
  const user = await Users.findOne({ username : req.session.username})
  const appointments = await Appointments.find({veterinarian: req.session.username})
  res.render("doctorHome", {title: "Home Page", usrename:req.session.username, appointments})
}

const deleteAppointmentDoctor = async (req, res) => {
  const id = req.body.id
  await Appointments.findOneAndDelete({_id:id})
      .then(()=> {
          res.redirect("doctorHome")
      })
      .catch(err => console.log(err))
}

const editDiagnosis = async (req, res) => {
  const id = req.body.id
  const diagnosis = req.body.diagnosis
  await Appointments.findByIdAndUpdate({_id:id},{diagnosis})
    .then(()=> {
      res.redirect("doctorHome")
    })
    .catch(err=> console.log(err))
}

const login_page = (req, res) => {
  res.render("login", {
    title: "login page",
    messages: req.flash("error"),
  });
};

const login = async (req, res) => {
  const username = req.body.username;
  const PlaintextPassword = req.body.password;
  const user = await Users.findOne({ username });

  if (user) {
    const passwordMatch = await bcrypt.compare(
      PlaintextPassword,
      user.password
    );
    if (passwordMatch) {
      if (user.role === 'admin'){
      req.session.username = user.username;
      res.redirect("/adminHome")

      } else if (user.role === 'doctor'){
        req.session.username = user.username
        res.redirect("/doctorHome")
      }
      else {
      req.session.username = user.username;
      res.redirect("/")
    }
    } else {
      req.flash("error", "Password is incorrect");
      res.redirect("/login");
    }
  } else {
    req.flash("error", "This username doesn't exist");
    res.redirect("/login");
  }
};

const register_page = (req, res) => {
  res.render("register", { title: "Register", messages: req.flash("error") });
};

const register = async (req, res) => {
  const {
    username,
    email,
    password: Plaintextpassword,
    confirm: confirmPassword,
    firstName,
    lastName,
    address,
    phoneNumber,
    petName,
    petType,
    petAge,
  } = req.body;

  const role = 'petOwner'

  try {
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      req.flash("error", "Email already registered");
      return res.redirect("register");
    }

    if (Plaintextpassword !== confirmPassword) {
      req.flash("error", "Passwords don't match");
      return res.redirect("register");
    }

    if (Plaintextpassword.length < 8) {
      req.flash("error", "Password must be at least 8 characters long");
      return res.redirect("register");
    }

    const hashedPassword = await bcrypt.hash(Plaintextpassword, 10);
    const user = new Users({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      address,
      phoneNumber,
      petName,
      petType,
      petAge,
    });

    await user.save();
    console.log("User signed up successfully...");
    res.redirect("login");
  } catch (error) {
    console.error(error);
    req.flash(
      "error",
      "An error occurred while registering. Please try again later."
    );
    res.redirect("register");
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Logged out");
      res.redirect("/login");
    }
  });
};

// New account controller
const account = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.username });
    const transactions = await Transactions.find({username: req.session.username})
    const appointments = await Appointments.find({
      petOwner: req.session.username,
    });
    res.render("account", {
      title: "Your Account",
      user: user,
      appointments: appointments,
      transactions: transactions
    });
  } catch (error) {
    console.error("Error fetching account data:", error);
    req.flash("error", "Failed to fetch account data");
    res.redirect("/");
  }
};

module.exports = {
  home,
  adminHome,
  doctorHome,
  deleteAppointmentDoctor,
  editDiagnosis,
  login_page,
  login,
  register_page,
  register,
  logout,
  account,
};
