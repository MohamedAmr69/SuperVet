const Appointments = require("../models/appointment")
const Inventory = require("../models/inventory")
const Transactions = require("../models/transactions")
const Users = require("../models/users")
const bcrypt = require("bcrypt")

const showAppointmentsAdmin = async (req, res) => {
    const appointments = await Appointments.find().sort({createdAt:-1})
    res.render("showAppointmentsAdmin", {title: 'Show Appointments | Admin', username: req.session.username, appointments})
}

const inventoryAdmin = async (req, res) => {
    const inventories = await Inventory.find()
    res.render("inventoryPage", {title:'Inventory | Admin', username: req.session.username, inventories})
}

const deleteItem = async (req, res) => {
    const id = req.body.id
    await Inventory.findByIdAndDelete({_id: id})
        .then(() => {
            res.redirect("/inventoryAdmin")
        })
}

const updateItemPage = async (req, res) => {
    const id = req.body.id
    const item = await Inventory.findOne({_id:id})
    res.render("updateItem", {title: 'Update Item | Admin', username: req.session.username, item})
}

const updateItem = async (req, res) => {
    const {id, productName, productPrice, category, quantity, description, petType} = req.body
    await Inventory.findOneAndUpdate({_id:id},{productName,productPrice, category, quantity, description, petType})
        .then(()=> {
            res.redirect("/inventoryAdmin")
        })
}

const manageAccountsPage = async (req, res) => {
    const doctors = await Users.find({role: {$nin : ['petOwner', 'admin']}})
    res.render("manageAccounts", {title:'Manage Accounts | Admin', username: req.session.username, doctors})
}

const addAccount = (req, res) => {
    res.render("addAccount", {title: "Add Account | Admin", username: req.session.username})
}

const addAccountPost = async (req, res) => {
    const {username, firstName, lastName, email, plainTextPassword, confirmPassword, address, phoneNumber, role} = req.body
    const existedUsername = await Users.findOne({username})
    const existedEmail = await Users.findOne({email})
    if (plainTextPassword != confirmPassword) {
        flash('error', "passwords don't match")
        res.redirect("addAccount")
    } else if (existedUsername) {
        flash('error', "username already exists")
        res.redirect("addAccount")
    } else if (existedEmail) {
        flash('error', "email already exists")
        res.redirect("addAccount")
    }
    const password = await bcrypt.hash(plainTextPassword, 10)
    const user = new Users({username, firstName, lastName, email, password, address, phoneNumber, role})
    await user.save()
        .then(()=> {
            res.redirect("manageAccounts")
        })
        .catch(err=> console.log(err))
}

const editAccoundPage = async (req, res)=> {
    const id = req.body.id
    const user = await Users.findOne({_id:id})
    res.render("editAccountPage",{title:"Edit Account | Admin", username: req.session.username, user})
}

const editAccount = async (req, res) => {
    const {id, username, firstName, lastName, email, plainTextPassword, confirmPassword, address, phoneNumber, role} = req.body
    const existedUsername = await Users.findOne({ username: username, _id: { $ne: id } });
    const existedEmail = await Users.findOne({ email: email, _id: { $ne: id } });
    const user = await Users.findOne({_id:id})
    if (existedUsername){
        req.flash("error","This username already exists")
        res.render("editAccountPage",{title:"Edit Account | Admin", username: req.session.username, user})
    } else if (existedEmail){
        req.flash("error","This email already exists")
        res.render("editAccountPage",{title:"Edit Account | Admin", username: req.session.username, user})
    } else if (plainTextPassword && plainTextPassword !== confirmPassword){
        req.flash("error","password don't match")
        res.render("editAccountPage",{title:"Edit Account | Admin", username: req.session.username, user})
    } else {
        const password = await bcrypt.hash(plainTextPassword, 10)
        await Users.findOneAndUpdate({_id:id},{username, firstName, lastName, email, password, address, phoneNumber, role})
        res.redirect("manageAccounts")
    }
}

const deleteAccount = async (req, res) => {
    const id = req.body.id
    await Users.findByIdAndDelete({_id:id})
    res.redirect("manageAccounts")
}

const adminOrders = async (req, res) => {
    const orders = await Transactions.find()
    res.render("adminOrders", {title: "Orders | Admin", username:req.session.username, orders})
}

const deleteAppointment = async (req, res) => {
    const id = req.body.id
    await Appointments.findOneAndDelete({_id:id})
        .then(()=> {
            res.redirect("showAppointmentsAdmin")
        })
        .catch(err => console.log(err))
}

const deleteOrder = async (req, res) => {
    const id = req.body.id
    await Transactions.findOneAndDelete({_id:id})
        .then(()=> {
            res.redirect("ordersAdmin")
        })
        .catch(err => console.log(err))
}

module.exports = {showAppointmentsAdmin,
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
    deleteOrder}