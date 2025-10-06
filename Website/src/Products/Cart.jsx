import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Card, Button, Form, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authentification/AuthProvider";
import { RxCross2 } from "react-icons/rx";

const Cart = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedToken = localStorage.getItem("token");
  if (!token && !storedToken) {
    navigate("/Login");
  } else {
    fetchCart();
  }
}, [token, navigate]);

// 👇 Add this effect to clear UI when backend cart is empty
useEffect(() => {
  if (cartItems.length === 0) {
    localStorage.removeItem("cartItems");
  }
}, [cartItems]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
      setLoading(false);
      console.log(res.data);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cart`,
        { productId, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handlesubmit = () => {
    navigate("/Order", { state: { cartItems, subtotal, token } });
  };

  useEffect(() => {
  const handleCartUpdate = () => {
    fetchCart(); // reload cart when cleared after order
  };

  window.addEventListener("cartUpdated", handleCartUpdate);
  return () => window.removeEventListener("cartUpdated", handleCartUpdate);
}, []);

  const updateSize = async (productId, newSize) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/size`,
        { productId, size: newSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // refresh cart
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading your cart...</p>;

  return (
    <div className="d-flex flex-wrap" style={{ marginBottom: "300px", marginTop: "120px" }}>
  {/* Left: Cart items */}
  <div className="cart-items me-3" style={{ flex: "1 1 700px", minWidth: "300px" }}>
    <Container>
      <h3 className="mb-4">Your Shopping Cart</h3>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Button style={{ backgroundColor: "black", border: "none" }} onClick={() => navigate("/")}>
            Go Shopping
          </Button>
        </p>
      ) : (
        <Row className="g-4">
          {cartItems.map((item) => (
            <Card
              style={{ width: "100%", height: "180px", borderRadius: "0px" }}
              className="shadow-sm"
              key={item.product._id}
            >
              {/* ... your existing Card content ... */}
            </Card>
          ))}
        </Row>
      )}
    </Container>
  </div>

  {/* Divider */}
  <div
    className="d-none d-md-block"
    style={{
      width: "1px",
      backgroundColor: "#ccc",
      marginTop: "130px",
      marginBottom: "50px",
    }}
  ></div>

  {/* Right: Price Details */}
  <div
    className="price-details mt-4 mt-md-0"
    style={{ flex: "0 0 300px", minWidth: "250px" }}
  >
    <h6 style={{ fontSize: "12px", fontWeight: "bolder", marginBottom: "20px" }}>PRICE DETAILS</h6>

    <div className="d-flex justify-content-between mb-2">
      <span>Total MRP</span>
      <span>₹{subtotal}</span>
    </div>
    <hr />
    <div className="d-flex justify-content-between mb-3">
      <strong>Total Amount</strong>
      <strong>₹{subtotal}</strong>
    </div>
    <Button style={{ width: "100%", borderRadius: "0px" }} variant="success" size="lg" onClick={handlesubmit}>
      Checkout
    </Button>
  </div>
</div>

  );
};

export default Cart;
