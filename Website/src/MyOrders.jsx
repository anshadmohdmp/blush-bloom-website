import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./Authentification/AuthProvider";
import { Container, Table, Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Css/Myorders.css";

const MyOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .get(`https://blush-bloom-api.onrender.com/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setOrders(res.data))
        .catch((err) => console.log(err));
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed": return "#6c757d";
      case "Order Confirmed": return "#0d6efd";
      case "Shipped": return "#0dcaf0";
      case "Delivered": return "#198754";
      case "Cancelled": return "#dc3545";
      case "Return Requested": return "#fd7e14";
      case "Return Completed": return "#20c997";
      default: return "#ffffff";
    }
  };

  const details = (id) => navigate(`/orderdetails/${id}`);

  return (
    <Container style={{ marginTop: "100px", marginBottom: "50px" }}>
      <h2 className="text-center mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="mb-4 shadow-sm p-3">
            <Row className="align-items-center mb-3">
  <Col xs={12} className="d-flex align-items-center justify-content-between">
    <div className="d-flex align-items-center">
      <h5 style={{ fontWeight: "bold", marginBottom: 0 }}>
        Order #{order._id.slice(-6).toUpperCase()}
      </h5>
      <Button
        variant="outline-dark"
        size="sm"
        className="ms-2"
        onClick={() => details(order._id)}
      >
        View Order
      </Button>
    </div>
    <span
      style={{
        fontWeight: "bold",
        color: "white",
        padding: "5px 10px",
        borderRadius: "8px",
        backgroundColor: getStatusColor(order.orderStatus),
        fontSize: "0.9rem",
      }}
    >
      {order.orderStatus}
    </span>
  </Col>
</Row>

            {/* Mobile-friendly card layout */}
            <div className="d-block d-md-none">
              {order.cartItems.map((item, index) => (
                <Card key={item.product._id} className="mb-3 p-2">
                  <Row>
                    <Col xs={5}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "5px" }}
                      />
                    </Col>
                    <Col xs={7}>
                      <h6>{item.product.name}</h6>
                      <p style={{ fontSize: "0.85rem", marginBottom: "2px" }}>
                        <strong>Size:</strong> {item.size || "-"}
                      </p>
                      <p style={{ fontSize: "0.85rem", marginBottom: "2px" }}>
                        <strong>Qty:</strong> {item.quantity}
                      </p>
                      <p style={{ fontSize: "0.85rem", marginBottom: "2px" }}>
                        <strong>Total:</strong> ₹{item.product.price * item.quantity}
                      </p>
                    </Col>
                  </Row>
                </Card>
              ))}
              <p className="text-end fw-bold">
                Subtotal: ₹{order.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
              </p>
            </div>

            {/* Desktop Table Layout */}
            <div className="d-none d-md-block">
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.cartItems.map((item, index) => (
                    <tr key={item.product._id}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ width: "120px", height: "180px", objectFit: "cover" }}
                        />
                      </td>
                      <td>{item.product.name}</td>
                      <td>{item.product.description}</td>
                      <td>{item.size || "-"}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.product.price}</td>
                      <td>₹{item.product.price * item.quantity}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="7" className="text-end fw-bold">
                      Subtotal:
                    </td>
                    <td className="fw-bold">
                      ₹{order.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card>
        ))
      )}
    </Container>
  );
};

export default MyOrders;
