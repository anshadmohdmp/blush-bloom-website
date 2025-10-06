import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Card, Button, Form } from "react-bootstrap";
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
    <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "300px", minHeight: "50vh" }}>
      <div style={{ width: "100%", maxWidth: "750px", marginLeft: "100px" }}>
        <Container style={{ marginTop: "120px", marginBottom: "50px" }}>
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
                <Card
                  style={{ width: "700px", height: "180px", borderRadius: "0px" }}
                  className="shadow-sm"
                  key={item.product._id}
                >
                  <div className="d-flex">
                    <div>
                      <Card.Img
                        variant="top"
                        src={item.product.image}
                        alt={item.product.name}
                        style={{
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "0px",
                          marginTop: "9px",
                        }}
                      />
                    </div>
                    <div>
                      <Card.Body>
                        <Card.Title style={{ fontSize: "18px" }}>{item.product.name}</Card.Title>
                        <Card.Text style={{ fontSize: "13px", marginTop: "-10px" }}>
                          {item.product.description}
                        </Card.Text>
                        <div
                          className="d-flex align-items-center gap-3 mb-2"
                          style={{ marginTop: "-10px" }}
                        >
                          <div className="d-flex align-items-center">
                            <span style={{ marginRight: "5px", fontSize: "13px" }}>Size:</span>
                            <Form.Select
                              value={item.size || ""}
                              onChange={(e) => updateSize(item.product._id, e.target.value)}
                              style={{
                                width: "70px",
                                height: "30px",
                                textAlign: "center",
                                padding: "2px 8px",
                                fontSize: "14px",
                              }}
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
                            <span style={{ marginRight: "5px", fontSize: "13px" }}>Qty:</span>
                            <Form.Select
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.product._id, parseInt(e.target.value))
                              }
                              style={{
                                width: "70px",
                                height: "30px",
                                textAlign: "center",
                                padding: "2px 8px",
                                fontSize: "14px",
                              }}
                            >
                              {[1, 2, 3, 4, 5, 6].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                        </div>
                        <Card.Text style={{ fontWeight: "bolder", fontSize: "14px" }}>
                          ₹{item.product.price}
                        </Card.Text>
                      </Card.Body>
                    </div>
                    <div>
                      <h6
                        style={{ marginTop: "10px", cursor: "pointer" }}
                        onClick={() => removeItem(item.product._id)}
                      >
                        <RxCross2 />
                      </h6>
                    </div>
                  </div>
                </Card>
              ))}
            </Row>
          )}
        </Container>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "300px",
          marginTop: "30px",
          marginLeft: "20px",
        }}
      >
        <div
          className="price-details text-center text-md-start"
          style={{ marginTop: "50px" }}
        >
          <h6 style={{ fontSize: "12px", fontWeight: "bolder", marginBottom: "15px" }}>
            PRICE DETAILS
          </h6>

          <div className="d-flex justify-content-between mb-1" style={{ fontSize: "12px" }}>
            <span>Total MRP</span>
            <span>₹{subtotal}</span>
          </div>
          <hr />
          <div
            className="d-flex justify-content-between mb-3"
            style={{ fontSize: "13px", fontWeight: "bold" }}
          >
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
