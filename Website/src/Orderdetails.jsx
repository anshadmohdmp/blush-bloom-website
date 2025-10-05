import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./Authentification/AuthProvider";
import { Card, Container, Row, Col, Button, Modal, Form } from "react-bootstrap";

const Orderdetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);

  // Cancel order modal
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Return product modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(""); // fixed radio reason
  const [customReason, setCustomReason] = useState("");     // optional textarea reason

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/myorders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setOrder(res.data))
        .catch((err) => console.log("API Error:", err));
    }
  }, [id, token]);

  // Cancel order handlers
  const confirmCancel = () => setShowCancelModal(true);
  const closeCancelModal = () => setShowCancelModal(false);

  const cancelOrder = async () => {
    if (!order?._id) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/${order._id}/cancel`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeCancelModal();
      navigate("/myorders");
    } catch (err) {
      console.error("Cancel error:", err.response?.data || err.message);
    }
  };

  // Return product modal handlers
  const confirmReturn = () => setShowReturnModal(true);
  const closeReturnModal = () => {
    setShowReturnModal(false);
    setSelectedReason("");
    setCustomReason("");
  };

  const submitReturn = async () => {
    if (!order?._id) return;

    const reasonToSend = selectedReason 
  ? customReason.trim() 
    ? `${selectedReason} - ${customReason.trim()}` 
    : selectedReason
  : customReason.trim() || "No reason provided";

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${order._id}/return`,
        { reason: reasonToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder({ ...order, orderStatus: "Return Requested", returnReason: reasonToSend });
      closeReturnModal();
    } catch (err) {
      console.error("Return error:", err);
    }
  };

  if (!order) return <p>Loading order details...</p>;

  const productdetails = (id) => navigate(`/details/${id}`);

  return (
    <Container style={{ marginTop: "120px", marginBottom: "50px" }}>
      <h2 className="mb-4">Order #{order._id.slice(-6).toUpperCase()}</h2>

      {order.cartItems.map((item) => (
        <Card
          onClick={() => productdetails(item.product._id)}
          key={item.product._id}
          className="mb-4 shadow-sm"
          style={{ border: "none" }}
        >
          <Row className="g-0">
            <Col xs={12} md={4} className="d-flex justify-content-center align-items-center p-2">
              <Card.Img
                src={item.product.image}
                alt={item.product.name}
                style={{
                  width: "100%",
                  maxWidth: "250px",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            </Col>
            <Col xs={12} md={8} className="p-3 d-flex flex-column justify-content-center">
              <Card.Body>
                <Card.Title>{item.product.name}</Card.Title>
                <Card.Text>
                  <strong>Description:</strong> {item.product.description} <br />
                  <strong>Size:</strong> {item.size || "-"} <br />
                  <strong>Quantity:</strong> {item.quantity} <br />
                  <strong>Total:</strong> ₹{item.product.price * item.quantity}
                </Card.Text>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      ))}

      <div className="d-flex justify-content-center justify-content-md-end mt-3">
        <Button
          onClick={() => {
            if (order.orderStatus === "Delivered") confirmReturn();
            else confirmCancel();
          }}
          disabled={["Cancelled", "Return Requested", "Return Completed"].includes(order.orderStatus)}
          style={{
            backgroundColor:
              order.orderStatus === "Delivered"
                ? "#198754"
                : order.orderStatus === "Cancelled"
                ? "#dc3545"
                : order.orderStatus === "Return Requested"
                ? "#fd7e14"
                : order.orderStatus === "Return Completed"
                ? "#20c997"
                : "red",
            border: "none",
            color: "white",
          }}
        >
          {order.orderStatus === "Cancelled"
            ? "Order Cancelled"
            : order.orderStatus === "Delivered"
            ? "Return Product"
            : order.orderStatus === "Return Requested"
            ? "Return Requested"
            : order.orderStatus === "Return Completed"
            ? "Return Completed"
            : "Cancel Order"}
        </Button>
      </div>

      {/* Cancel Order Modal */}
      <Modal show={showCancelModal} onHide={closeCancelModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCancelModal}>
            Close
          </Button>
          <Button variant="danger" onClick={cancelOrder}>
            Yes, Cancel Order
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Return Product Modal */}
      <Modal show={showReturnModal} onHide={closeReturnModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Return Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select a reason for return:</Form.Label>
              {["Damaged Product", "Wrong Item Delivered", "Not as Described", "Size/fit Issue", "Other"].map(
                (reason) => (
                  <Form.Check
                    key={reason}
                    type="radio"
                    label={reason}
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    name="returnReason"
                    className="mb-2"
                  />
                )
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Specify your reason (optional):</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Type your reason here..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeReturnModal}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={submitReturn}
            disabled={!selectedReason && !customReason.trim()}
          >
            Submit Return Request
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orderdetails;
