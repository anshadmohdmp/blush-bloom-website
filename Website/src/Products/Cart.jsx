import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authentification/AuthProvider";
import { RxCross2 } from "react-icons/rx";
import "../Css/Cart.css";

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
      fetchCart();
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
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading your cart...</p>;

  return (
    <div className="cart-container">
      {/* Left Section - Cart Items */}
      <div className="cart-items-section">
        <Container className="cart-main">
          <h3 className="mb-4">Your Shopping Cart</h3>
          {cartItems.length === 0 ? (
            <p>
              Your cart is empty.{" "}
              <Button
                style={{ backgroundColor: "black", border: "none" }}
                onClick={() => navigate("/")}
              >
                Go Shopping
              </Button>
            </p>
          ) : (
            <Row className="g-4">
              {cartItems.map((item) => (
                <Card className="cart-card shadow-sm" key={item.product._id}>
                  {/* Remove Button */}
                  <Button
                    variant="link"
                    className="remove-btn"
                    onClick={() => removeItem(item.product._id)}
                  >
                    <RxCross2 />
                  </Button>

                  {/* Product Image */}
                  <div className="cart-img-wrapper">
                    <Card.Img
                      src={item.product.image}
                      alt={item.product.name}
                      className="cart-img"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="cart-details">
                    <div>
                      <Card.Title className="cart-title">
                        {item.product.name}
                      </Card.Title>
                      <Card.Text className="cart-desc">
                        {item.product.description}
                      </Card.Text>

                      {/* Size & Quantity */}
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <div className="d-flex align-items-center">
                          <span className="small-text">Size:</span>
                          <Form.Select
                            value={item.size || ""}
                            onChange={(e) =>
                              updateSize(item.product._id, e.target.value)
                            }
                            className="cart-select"
                          >
                            <option value="" disabled>
                              Size
                            </option>
                            {["S", "M", "L", "XL"].map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </Form.Select>
                        </div>

                        <div className="d-flex align-items-center">
                          <span className="small-text">Qty:</span>
                          <Form.Select
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.product._id,
                                parseInt(e.target.value)
                              )
                            }
                            className="cart-select"
                          >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </div>
                    </div>

                    <Card.Text className="cart-price">
                      ₹{item.product.price}
                    </Card.Text>
                  </div>
                </Card>
              ))}
            </Row>
          )}
        </Container>
      </div>

      {/* Right Section - Price Summary */}
      <div className="price-section">
        <div className="price-details">
          <h6 className="price-header">PRICE DETAILS</h6>

          <div className="d-flex justify-content-between mb-1 small-text">
            <span>Total MRP</span>
            <span>₹{subtotal}</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between mb-3 fw-bold small-text">
            <span>Total Amount</span>
            <span>₹{subtotal}</span>
          </div>
          <Button
            style={{ width: "100%", borderRadius: "0px", fontSize: "13px" }}
            variant="success"
            size="lg"
            onClick={handlesubmit}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
