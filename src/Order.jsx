    import axios from "axios";
    import React, { useContext, useState } from "react";
    import { Button, Form, Card, Modal } from "react-bootstrap";
    import { useLocation, useNavigate } from "react-router-dom";
    import { AuthContext } from "./Authentification/AuthProvider";

    const Order = () => {
      const { token } = useContext(AuthContext);
      const location = useLocation();
      const cartItems = location.state?.cartItems || [];
      const subtotal = location.state?.subtotal || 0;

      const [Name, setName] = useState("");
      const [Mobile, setMobile] = useState("");
      const [Pincode, setPincode] = useState("");
      const [House, setHouse] = useState("");
      const [Address, setAddress] = useState("");
      const [Town, setTown] = useState("");
      const [District, setDistrict] = useState("");
      const [State, setState] = useState("");
      const [PincodeError, setPincodeError] = useState("");
      const [PaymentMode, setPaymentMode] = useState("COD");
      const [loading, setLoading] = useState(false);

      const [showSuccess, setShowSuccess] = useState(false); // ✅ modal state

      const navigate = useNavigate();

      // Auto-fill city/state from Pincode
      const handlePincodeChange = async (e) => {
        const pincode = e.target.value;
        setPincode(pincode);
        setPincodeError("");

        if (pincode.length === 6) {
          try {
            const res = await axios.get(
              `https://api.postalpincode.in/pincode/${pincode}`
            );
            if (res.data[0].Status === "Success") {
              const postOffice = res.data[0].PostOffice[0];
              setDistrict(postOffice.District);
              setState(postOffice.State);
              setTown(postOffice.Name);
            } else {
              setDistrict("");
              setState("");
              setTown("");
              setPincodeError("Invalid Pincode Code");
            }
          } catch (err) {
            console.error(err);
            setDistrict("");
            setState("");
            setTown("");
            setPincodeError("Error fetching Pincode code");
          }
        } else {
          setDistrict("");
          setState("");
          setTown("");
        }
      };

      // Razorpay loader
      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      // Submit order
      // Submit order
const submitOrder = async (paymentResponse = null, paymentMode = PaymentMode) => {
  setLoading(true);
  try {
    // 1️⃣ Save order
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/order`,
      {
        Name,
        Mobile,
        Pincode,
        House,
        Address,
        Town,
        District,
        State,
        cartItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
        })),
        subtotal,
        PaymentMode: paymentMode,
        paymentStatus:
          paymentMode === "COD"
            ? "pending"
            : paymentResponse
            ? "paid"
            : "failed",
        orderStatus: "Order Placed",
        paymentDetails: paymentResponse || null,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Order saved:", result.data);

    // 2️⃣ Clear backend cart immediately
    const clearRes = await axios.delete(`${import.meta.env.VITE_API_URL}/cart/clear`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Cart clear response:", clearRes.data);

    // 3️⃣ Clear frontend cart
    localStorage.removeItem("cartItems");
    window.dispatchEvent(new Event("cartUpdated"));

    // 4️⃣ Show success modal
    setShowSuccess(true);
  } catch (err) {
    console.error("Order submission error:", err.response || err);
    alert("Failed to place order. Please try again.");
  } finally {
    setLoading(false);
  }
};

      // Handle payment
      const handlePayment = async (e) => {
        e.preventDefault();

        if (PaymentMode === "COD") {
          submitOrder(null, "COD");
        } else if (PaymentMode === "UPI") {
          const res = await loadRazorpayScript();
          if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
          }

          const options = {
            key: "rzp_test_RLQA1rB6JY2JgQ",
            amount: subtotal * 100,
            currency: "INR",
            name: "My Shop",
            description: "Order Payment",
            handler: function (response) {
              console.log("Payment Success:", response);
              submitOrder(response, "UPI");
            },
            prefill: { name: Name, contact: Mobile },
            theme: { color: "#3399cc" },
          };

          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", function () {
            alert("Payment Failed. Try again.");
          });
          rzp.open();
        }
      };

      // Navigate to product details
      const change = (id) => navigate(`/details/${id}`);

      return (
        <div style={{ marginTop: "170px", display: "flex", marginBottom: "80px" }}>
          {/* Left side form */}
          <div style={{ marginLeft: "200px", width: "50%" }}>
            <h5 className="mb-4" style={{ fontWeight: "bolder" }}>
              Delivery Address
            </h5>
            <Form onSubmit={handlePayment}>
              <Form.Group className="mb-3">
                <Form.Control
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  value={Mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile Number"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  value={Pincode}
                  onChange={handlePincodeChange}
                  placeholder="Pincode Code"
                  isInvalid={!!PincodeError}
                />
                {PincodeError && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {PincodeError}
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  value={House}
                  onChange={(e) => setHouse(e.target.value)}
                  placeholder="House Number / Tower / Block"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  value={Address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address (locality, building, street)"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  value={Town}
                  onChange={(e) => setTown(e.target.value)}
                  placeholder="Locality / Town"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control value={District} readOnly placeholder="City / District" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control value={State} readOnly placeholder="State" />
              </Form.Group>

              {/* Payment Mode */}
              <Form.Group className="mb-3">
                <Form.Select
                  value={PaymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="UPI">UPI Payment</option>
                </Form.Select>
              </Form.Group>

              <div
                style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
              >
                <Button type="submit" style={{ width: "20%" }} disabled={loading}>
                  {loading ? "Processing..." : "Submit"}
                </Button>
              </div>
            </Form>
          </div>

          {/* Right side order summary */}
          <div style={{ marginLeft: "30px", width: "40%" }}>
            <h6 style={{ fontSize: "12px", fontWeight: "bolder" }}>
              DELIVERY ESTIMATES
            </h6>
            {cartItems.map((item) => (
              <Card
                key={item.product._id}
                className="mb-3 p-2 shadow-sm"
                style={{ width: "80%" }}
                onClick={() => change(item.product._id)}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "10px",
                    }}
                  />
                  <div>
                    <h6 style={{ margin: 0 }}>{item.product.name}</h6>
                    <small style={{ marginRight: "20px" }}>
                      Qty: {item.quantity}
                    </small>
                    <small>Size: {item.size}</small>
                    <p style={{ margin: 0 }}>
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
            <h5>Total: ₹{subtotal}</h5>
          </div>

          {/* ✅ Success Modal */}
          <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Order Placed Successfully 🎉</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Thank you for shopping with us.</p>
              <p>Your order has been placed successfully.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={() => { setShowSuccess(false); navigate("/"); }}>
                Continue Shopping
              </Button>
              <Button variant="primary" onClick={() => { setShowSuccess(false); navigate("/myorders"); }}>
                View My Orders
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    };

    export default Order;
