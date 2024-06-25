const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");

const Users = require("./models/users.js");

const { Auth, adminAuth } = require("./middlewares/auth");

const {
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
} = require("./controllers/home_controllers.js");

const {
  appointment_page,
  makeAppointment,
  showAppointments,
  deleteAppointmentUser,
} = require("./controllers/appointment_controller.js");

const {
  shop_page,
  addInventory_page,
  addInventory,
  search,
  items,
  transaction,
  cart_page,
  addToCart,
  removeFromCart,
  buyFromCart,
} = require("./controllers/shop_controllers.js");

const {
  lost_page,
  found_page,
  post_page,
  post,
  contact,
  lostSearch,
  foundSearch,
} = require("./controllers/lostandfound_controller.js");

const {
  adoptionPage,
  adoptionPost,
  addAdoptionPost,
  contactAdoption,
} = require("./controllers/adoption_controller.js");

const {
  showAppointmentsAdmin,
  inventoryAdmin,
  deleteItem,
  updateItemPage,
  updateItem,
  manageAccountsPage,
  addAccount,
  addAccountPost,
  editAccoundPage,
  editAccount,
  deleteAccount,
  adminOrders,
  deleteAppointment,
  deleteOrder,
} = require("./controllers/admin_controller.js");

const app = express();
const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date(Date.now() + 30 * 86400 * 1000), // 30 days
    },
  })
);
app.use(flash());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/inventory_images");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    console.log(filename);
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

mongoose
  .connect("mongodb://127.0.0.1:27017/clinic")
  .then(() => {
    console.log("db connected...");
  })
  .catch((err) => console.log(err));

const db = mongoose.connection;
db.once("open", async function () {
  console.log("Connected to the database");

  try {
    const adminExists = await Users.findOne({ username: "admin" });

    if (!adminExists) {
      password = await bcrypt.hash("admin", 10);
      const adminUser = new Users({
        username: "admin",
        password: password,
        role: "admin",
      });

      await adminUser.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
});

// Get requests
app.get("/", Auth, home);
app.get("/adminHome", adminAuth, adminHome);
app.get("/login", Auth, login_page);
app.get("/register", Auth, register_page);
app.get("/appointment", Auth, appointment_page);
app.get("/showAppointments", Auth, showAppointments);
app.get("/shop", Auth, shop_page);
app.get("/addInventory", adminAuth, addInventory_page);
app.get("/items", Auth, Auth, items);
app.get("/lost", Auth, lost_page);
app.get("/found", Auth, found_page);
app.get("/post", Auth, post_page);
app.get("/account", Auth, account); // Add account route
app.get("/services", Auth, (req, res) => {
  res.render("services", { title: "About", user: req.user });
});
app.get("/cart", Auth, cart_page);
app.get("/adoption", Auth, adoptionPage);
app.get("/adoptionPost", Auth, adoptionPost);
app.get("/showAppointmentsAdmin", adminAuth, showAppointmentsAdmin);
app.get("/inventoryAdmin", adminAuth, inventoryAdmin);
app.get("/manageAccounts", adminAuth, manageAccountsPage);
app.get("/addAccount", adminAuth, addAccount);
app.get("/doctorHome", Auth, doctorHome);
app.get("/ordersAdmin", adminAuth, adminOrders);

// Post requests
app.post("/login", login);
app.post("/register", register);
app.post("/logout", logout);
app.post("/appointment", Auth, makeAppointment);
app.post("/addInventory", adminAuth, upload.single("image"), addInventory);
app.post("/search", Auth, search);
app.post("/transaction", Auth, transaction);
app.post("/post", Auth, upload.single("image"), post);
app.post("/contact", Auth, contact);
app.post("/lostSearch", Auth, lostSearch);
app.post("/foundSearch", Auth, foundSearch);
app.post("/addToCart", Auth, addToCart);
app.post("/removeFromCart", Auth, removeFromCart);
app.post("/buyFromCart", Auth, buyFromCart);
app.post("/addAdoptionPost", Auth, upload.single("image"), addAdoptionPost);
app.post("/contactAdoption", Auth, contactAdoption);
app.post("/deleteItem", adminAuth, deleteItem);
app.post("/updateItemPage", adminAuth, updateItemPage);
app.post("/updateItem", adminAuth, updateItem);
app.post("/addAccountPost", adminAuth, addAccountPost);
app.post("/editAccoundPage", adminAuth, editAccoundPage);
app.post("/editAccount", adminAuth, editAccount);
app.post("/deleteAccount", adminAuth, deleteAccount);
app.post("/deleteAppointment", adminAuth, deleteAppointment);
app.post("/deleteOrder", adminAuth, deleteOrder);
app.post("/deleteAppointmentDoctor", Auth, deleteAppointmentDoctor);
app.post("/editDiagnosis", Auth, editDiagnosis);
app.post("/deleteAppointmentUser", Auth, deleteAppointmentUser);

const handle404 = (req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
};
app.use(handle404);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
