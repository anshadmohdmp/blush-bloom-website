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
    <div style={{display:"flex",marginBottom:"300px",height:"50vh"}}>
    <div style={{width: "750px",marginLeft:"100px"}}> 
    <Container style={{ marginTop: "120px", marginBottom: "50px" }}>
      
      <h3 className="mb-4">Your Shopping Cart</h3>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Button style={{backgroundColor:"black",border:"none"}} onClick={() => navigate("/")}>Go Shopping</Button>
        </p>
      ) : (
        <Row className="g-4">
          {cartItems.map((item) => (
            <Card style={{ width: "700px", height: "180px", borderRadius: "0px" }} className="shadow-sm" key={item.product._id}>
              <div className="d-flex">
                <div>

                  <Card.Img
                    variant="top"
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ height: "160px", objectFit: "cover", borderRadius: "0px", marginTop: "9px" }}
                  />
                </div>
                <div>

                  <Card.Body>
                    <Card.Title style={{ fontSize: "18px" }}>{item.product.name}</Card.Title>
                    <Card.Text style={{ fontSize: "13px", marginTop: "-10px" }}>{item.product.description}</Card.Text>
                    <div className="d-flex align-items-center gap-3 mb-2 " style={{ marginTop: "-10px" }}>
                      {/* Editable Size */}
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

                      {/* Editable Quantity */}
                      <div className="d-flex align-items-center" >
                        <span style={{ marginRight: "5px", fontSize: "13px" }}>Qty:</span>
                        <Form.Select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value))}
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
                    <Card.Text style={{ fontWeight: "bolder", fontSize: "14px" }}>₹{item.product.price}</Card.Text>
                  </Card.Body>
                </div>
                <div>
                  <h6 style={{ marginTop: "10px", cursor: "pointer" }} onClick={() => removeItem(item.product._id)}><RxCross2 /></h6>
                </div>
              </div>
            </Card>
          ))}
        </Row>
      )}
      {/* {cartItems.length > 0 && (
        <Card className="mt-4 p-3 shadow-sm">
          <h4>Subtotal: ₹{subtotal}</h4>
          <Button variant="success" size="lg" onClick={handlesubmit}>
            Checkout
          </Button>
        </Card>
      )} */}
    </Container>
    </div> 
    <div
    style={{
      width: "1px",
      backgroundColor: "#ccc",
      marginTop: "130px",
      marginBottom: "50px",
    }}
  ></div>
    <div style={{marginTop:"190px",marginLeft:"20px"}}>
      <h6 style={{fontSize:"12px",fontWeight:"bolder",marginBottom:"20px"}}>PRICE DETAILS</h6>
      <div style={{display: "flex",marginBottom:"-10px"}}>
      <div>
      <h6 style={{fontSize:"13px"}}>Total MRP</h6>
      </div>
      <div>
        <h6 style={{fontSize:"13px",marginLeft:"255px"}}>₹{subtotal}</h6>
      </div>
      </div>
      <hr />
      <div style={{display: "flex"}}>
      <div >
      <h6 style={{fontSize:"15px",fontWeight:"bold"}}>Total Amount</h6>
      </div>
      <div>
        <h6 style={{fontSize:"15px",marginLeft:"223px",fontWeight:"bold"}}>₹{subtotal}</h6>
      </div>
      </div>
      <Button style={{width:"100%",borderRadius:"0px"}} variant="success" size="lg" onClick={handlesubmit}> Checkout </Button>
    </div>


    </div>
  );
};

export default Cart;
