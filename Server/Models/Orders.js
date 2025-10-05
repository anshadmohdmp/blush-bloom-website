const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  Name: String,
  Mobile: String,
  Pincode: String,
  House: String,
  Address: String,
  Town: String,
  District: String,
  State: String,

  cartItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: Number,
      price: Number,
      size: String,
    },
  ],

  subtotal: Number,
  PaymentMode: { type: String, enum: ["COD", "UPI"], default: "COD" },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },

  orderStatus: {
    type: String,
    enum: [
      "Order Placed",
      "Order Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Return Requested",
      "Return Completed",
    ],
    default: "Order Placed",
  },

  // ✅ Separate reasons
  returnReason: { type: String, default: "" },

  paymentDetails: { type: Object, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
