const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Product = require("./Models/Products");
const Category = require("./Models/Category");
const User = require("./Models/Users");
const Cart = require("./Models/Carts");
const Wishlist = require("./Models/Wishlist");
const Order = require("./Models/Orders");


const app = express();

require('dotenv').config();

// ------------------ DATABASE ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// ------------------ MIDDLEWARE ------------------
app.use(
  cors({
    origin: ["blush-bloom-chi.vercel.app", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: "google_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const JWT_SECRET = process.env.JWT_SECRET;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ------------------ AUTH MIDDLEWARE ------------------
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      // Store both id and email for flexibility
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };

      next();
    });
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Server error in auth middleware" });
  }
};

// ------------------ PRODUCTS ------------------
app.post("/create", async (req, res) => {
  Product.create(req.body)
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/products/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => res.json(product))
    .catch((err) => res.status(500).json(err));
});

app.put("/products/:id", (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.delete("/products/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: "Product deleted successfully" }))
    .catch((err) => res.json(err));
});

app.get("/products", async (req, res) => {
  try {
    const search = req.query.search || "";
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/products/category/:categoryname", (req, res) => {
  Product.find({ category: req.params.categoryname })
    .then((products) => res.json(products))
    .catch((err) => res.status(500).json(err));
});

// ------------------ CATEGORIES ------------------
app.post("/createcategory", async (req, res) => {
  Category.create(req.body)
    .then((category) => res.json(category))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/category", async (req, res) => {
  Category.find()
    .then((category) => res.json(category))
    .catch((err) => res.status(500).json(err));
});

app.get("/category/:id", (req, res) => {
  Category.findById(req.params.id)
    .then((category) => res.json(category))
    .catch((err) => res.status(500).json(err));
});

app.put("/category/:id", (req, res) => {
  Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((category) => res.json(category))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.delete("/category/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: "Category deleted successfully" }))
    .catch((err) => res.json(err));
});

// ------------------ USER AUTH ------------------
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found, please register" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  }
});

app.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ------------------ GOOGLE AUTH ------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://blush-bloom.onrender.com/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            password: "",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "blush-bloom-chi.vercel.app/Login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

   res.redirect(`blush-bloom-chi.vercel.app/google-success?token=${token}`);
  }
);

// ------------------ CART ------------------
app.get("/cart", authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) cart = { items: [] };
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/cart", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    if (!size) return res.status(400).json({ message: "Size is required" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity, size }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.equals(productId) && item.size === size
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, size });
      }
      await cart.save();
    }

    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/cart", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(400).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.equals(productId));
    if (item) {
      item.quantity = quantity;
      await cart.save();
      res.json(cart);
    } else res.status(404).json({ message: "Product not found in cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/cart/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(400).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => !i.product.equals(productId));
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/cart/size", authMiddleware, async (req, res) => {
  try {
    const { productId, size } = req.body;
    if (!size) return res.status(400).json({ message: "Size is required" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(400).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.equals(productId));
    if (item) {
      item.size = size;
      await cart.save();
      return res.json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/cart/clear", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Properly clear array
    await cart.updateOne({ $set: { items: [] } });

    console.log("Cart cleared successfully for user:", req.user.id);
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ WISHLIST ------------------
app.get("/wishlist", authMiddleware, async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
    "items.product"
  );
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user.id, items: [] });
  res.json({ items: wishlist.items });
});

app.post("/wishlist", authMiddleware, async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user.id, items: [] });

  if (!wishlist.items.find((i) => i.product.equals(productId))) {
    wishlist.items.push({ product: productId });
  }
  await wishlist.save();
  res.json({ items: wishlist.items });
});

app.delete("/wishlist/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  wishlist.items = wishlist.items.filter((i) => !i.product.equals(productId));
  await wishlist.save();
  res.json({ items: wishlist.items });
});

// ------------------ ORDERS ------------------
app.post("/order", authMiddleware, async (req, res) => {
  try {
    const orderData = { ...req.body, user: req.user.id };
    const order = await Order.create(orderData);
    res.json(order);
  } catch (err) {
    console.error("Order error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Get all orders for logged-in user
app.get("/myorders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("cartItems.product");
    res.json(orders);
  } catch (err) {
    console.error("MyOrders error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get single order for logged-in user
app.get("/myorders/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("cartItems.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    console.error("MyOrders error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get all orders (admin)
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("cartItems.product");
    res.json(orders);
  } catch (err) {
    console.error("Orders error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Cancel an order
app.delete("/orders/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus === "Delivered" || order.orderStatus === "Return Completed") {
      return res.status(400).json({ message: `Cannot cancel order with status: ${order.orderStatus}` });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order cancelled and removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Return a delivered order
app.put("/orders/:id/return", authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({ message: "Only delivered orders can be returned" });
    }

    order.orderStatus = "Return Requested";
    order.returnReason = reason || "No reason provided";

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/orders/:id/status", async (req, res) => { 
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Optional: prevent changing delivered/returned orders
    if (order.orderStatus === "Delivered" || order.orderStatus === "Return Completed") {
      return res.status(400).json({ message: `Cannot change status from: ${order.orderStatus}` });
    }

    order.orderStatus = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
// ------------------ SERVER ------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
