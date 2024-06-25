const Appointment = require("../models/appointment.js");
const User = require("../models/users.js");

const appointment_page = async (req, res) => {
  try {
    const pets = await User.find({ username: req.session.username });
    res.render("appointments", {
      title: "Make an Appointment",
      username: req.session.username,
      messages: req.flash("error"),
      pets: pets,
    });
  } catch (error) {
    console.error("Error fetching pets:", error);
    req.flash("error", "Failed to fetch pets");
    res.redirect("/appointment");
  }
};

const makeAppointment = async (req, res) => {
  const { petId, reason, date, veterinarian, time } = req.body;
  let amount;
  if (reason === 'DentalCare'){
    amount = 1000
  } else if (reason === 'Vaccination'){
    amount = 1500
  } else if (reason === 'DiagnosticServices'){
    amount = 500
  } else if (reason === 'Surgery'){
    amount = 2000
  } else if (reason === 'HospiceCare'){
    amount = 2000
  }
  try {
    // Fetch the selected pet from the database
    const pet = await User.findById(petId);

    if (!pet) {
      req.flash("error", "Pet not found");
      return res.redirect("/appointment");
    }

    const { petName, petType, petAge } = pet;

    const availableDoctorTime = await Appointment.find({time, veterinarian, date});
    const availabeOwnerTime = await Appointment.find({petOwner:req.session.username ,time , date});

    if (availableDoctorTime.length === 0){
      if (availabeOwnerTime.length === 0){
      const newAppointment = new Appointment({
        petOwner: req.session.username,
        petName,
        petType,
        petAge,
        reason,
        amount,
        date,
        veterinarian,
        time: time.toString(), // Store time as a string
      })

      await newAppointment.save();
      // req.flash("success", "Appointment created successfully");
      res.redirect("/showAppointments")} else {
        req.flash("error", "You already have an appointment at that time.")
        res.redirect("/appointment")
      }
    } else {
      req.flash("error", "This time is not available.")
      res.redirect("/appointment")
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
    req.flash("error", "Failed to create appointment");
    res.redirect("/appointment");
  }
};

const showAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      petOwner: req.session.username,
    }).sort({date:1})
    res.render("showAppointments", {
      title: "Your Appointments",
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    req.flash("error", "Failed to fetch appointments");
    res.redirect("/");
  }
};

const deleteAppointmentUser = async (req, res) => {
  const id = req.body.id
  await Appointment.findOneAndDelete({_id:id})
      .then(()=> {
          res.redirect("showAppointments")
      })
      .catch(err => console.log(err))
}

module.exports = { appointment_page, makeAppointment, showAppointments, deleteAppointmentUser };
