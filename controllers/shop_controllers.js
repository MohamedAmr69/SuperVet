const Inventory = require("../models/inventory.js");
const Transaction = require("../models/transactions.js");
const Users = require("../models/users.js");

const shop_page = async (req, res) => {
  const inventory = await Inventory.find();
  res.render("shop", {
    title: "shop",
    username: req.session.username,
    inventory,
  });
};

const addInventory_page = async (req, res) => {
  res.render("addInventory", {
    title: "Add Inventory",
    username: req.session.username,
  });
};

const addInventory = async (req, res) => {
  const {
    productName,
    productPrice,
    category,
    quantity,
    description,
    petType,
  } = req.body;

  const inventory = new Inventory({
    productName,
    productPrice,
    category,
    quantity,
    description,
    petType,
    image: req.file.filename,
  });

  await inventory.save();
  res.redirect("/inventoryAdmin");
};

const search = async (req, res) => {
  console.log(req.body);
  query = {};
  if (req.body.search) {
    const productName = req.body.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.productName = { $regex: "\\b" + productName + "\\b", $options: "i" };
  }
  if (req.body.category && req.body.category !== "all") {
    query.category = req.body.category;
  }
  if (req.body.type && req.body.type !== "all") {
    query.petType = req.body.type;
  }

  const productPrice = parseInt(req.body.price);
  query.productPrice = { $lte: productPrice };

  const inventory = await Inventory.find(query);
  res.render("shop", {
    title: "shop",
    username: req.session.username,
    inventory,
  });
};

const items = async (req, res) => {
  const id = req.query.id;
  const username = req.session.username;
  const item = await Inventory.findOne({ _id: id });
  res.render(`items`, {
    title: "item",
    username: username,
    item,
    errorMessages: req.flash("error"),
    successMessages: req.flash("success"),
  });
};

const transaction = async (req, res) => {
  const username = req.session.username;
  const productId = req.body.productId;
  const productName = req.body.productName;
  const productPrice = req.body.productPrice;
  const category = req.body.category;
  const petType = req.body.petType;
  const quantity = parseInt(req.body.qty);
  const stock = req.body.stock;

  const new_quantity = stock - quantity;

  const totalPrice = quantity * productPrice;
  if (quantity > stock) {
    req.flash("error", "Quantity out of stock");
    return res.redirect(`/items?id=${productId}`);
  }

  const transaction = new Transaction({
    username,
    productId: [productId],
    productName: [productName],
    productPrice: [productPrice],
    category: [category],
    quantity: [quantity],
    petType: [petType],
    totalPrice,
  });

  await transaction.save();
  await Inventory.findOneAndUpdate(
    { _id: productId },
    { quantity: new_quantity }
  );
  req.flash("success", "Transaction completed successfully");
  res.redirect(`/items?id=${productId}`);
};

const cart_page = async (req, res) => {
  try {
    const username = req.session.username;
    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userCart = user.cart;

    const productIds = userCart.map((item) => item.productId);

    const products = await Inventory.find({ _id: { $in: productIds } });
    const cartWithProductDetails = userCart.map((cartItem) => {
      const product = products.find(
        (product) => product._id.toString() === cartItem.productId
      );
      return {
        ...cartItem,
        productName: product ? product.productName : "Product Not Found",
        image: product ? product.image : "placeholder.jpg",
      };
    });

    const totalPrice = cartWithProductDetails.reduce((total, item) => {
      const price = parseFloat(item.productPrice); // Ensure the price is a number
      const quantity = parseInt(item.qty, 10); // Ensure the quantity is an integer
      return total + price * quantity;
    }, 0);

    res.render("cart", {
      title: "Cart",
      cart: cartWithProductDetails,
      totalPrice: totalPrice,
    });
  } catch (error) {
    console.error("Error fetching cart page:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addToCart = async (req, res) => {
  const username = req.session.username;
  const currentUser = await Users.findOne({ username });

  const product = await Inventory.findById(req.body.productId);
  if (!product) {
    req.flash("error", "Product not found");
    return res.redirect(`/items?id=${req.body.productId}`);
  }

  const cartItem = {
    productId: req.body.productId,
    productPrice: parseFloat(req.body.productPrice),
    qty: parseInt(req.body.qty, 10),
    productName: product.productName, // Include productName here
  };

  currentUser.cart.push(cartItem);

  await currentUser.save();

  req.flash("success", "Product added to cart");
  return res.redirect(`/items?id=${req.body.productId}`);
};

const removeFromCart = async (req, res) => {
  try {
    const username = req.session.username;
    const productId = req.query.id;

    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();

    req.flash("success", "Product removed from cart");
    return res.redirect("/cart");
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const buyFromCart = async (req, res) => {
  try {
    const username = req.session.username;
    const cart = JSON.parse(req.body.cart);

    const productIds = [];
    const productNames = [];
    const productPrices = [];
    const categories = [];
    const quantities = [];
    const petTypes = [];
    let totalTransactionPrice = 0;

    for (const item of cart) {
      const { productId, productPrice, qty, productName } = item;

      const product = await Inventory.findById(productId);

      if (!product) {
        console.error(`Product with ID ${productId} not found in inventory`);
        continue; // Skip to the next item if product not found
      }

      const { petType, category } = product;
      const totalPrice = productPrice * qty;

      productIds.push(productId);
      productNames.push(productName);
      productPrices.push(productPrice);
      categories.push(category);
      quantities.push(qty);
      petTypes.push(petType);
      totalTransactionPrice += totalPrice;
    }

    if (productIds.length > 0) {
      const transaction = new Transaction({
        username,
        productId: productIds,
        productName: productNames,
        productPrice: productPrices,
        category: categories,
        quantity: quantities,
        petType: petTypes,
        totalPrice: totalTransactionPrice,
      });

      await transaction.save();
      await Users.findOneAndUpdate({ username }, { cart: [] });
    } else {
      console.error("No valid products found in cart");
      return res.status(400).json({ message: "No valid products in cart" });
    }

    res.redirect("/cart");
  } catch (error) {
    console.error("Error creating transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
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
};
