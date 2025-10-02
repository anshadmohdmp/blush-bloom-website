import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Button, Modal } from "react-bootstrap";
import { AuthContext } from "../Authentification/AuthProvider";
import { IoBagOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((result) => {
        setName(result.data.name);
        setPrice(result.data.price);
        setDescription(result.data.description);
        setImage(result.data.image);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const addToCart = async () => {
    if (!token) {
      navigate("/Login");
      return;
    }

    if (!size) {
      alert("Please select a size before adding to cart");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
        { productId: id, quantity, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Show success modal instead of alert
      setShowModal(true);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async () => {
    if (!token) {
      navigate("/Login");
      return;
    }

    try {
      setWishLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/wishlist`,
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product added to wishlist ❤️");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to add to wishlist");
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: "130px", marginBottom: "50px" }}>
      <Row className="align-items-start">
        {/* Product Image */}
        <Col xs={12} md={6} className="text-center mb-4">
          <Image
            src={image}
            alt={name}
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              borderRadius: "20px",
            }}
            fluid
          />
        </Col>

        {/* Product Info */}
        <Col xs={12} md={6} style={{ textAlign: "left" }}>
          <h3>{name}</h3>
          <p style={{ fontSize: "16px", lineHeight: "1.6" }}>{description}</p>
          <hr />
          <h5 style={{ color: "green", margin: "10px 0" }}>₹{price}</h5>
          <h6>inclusive of all taxes</h6>

          {/* Size Selection */}
          <div style={{ margin: "20px 0" }}>
            <h6>Select Size:</h6>
            {["S", "M", "L", "XL"].map((s) => (
              <Button
                key={s}
                variant={size === s ? "dark" : "outline-dark"}
                onClick={() => setSize(s)}
                style={{
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  marginRight: "10px",
                  fontWeight: "bold",
                }}
              >
                {s}
              </Button>
            ))}
          </div>

          {/* Quantity Selector */}
          <div style={{ margin: "20px 0" }}>
            <h6>Quantity:</h6>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="outline-dark"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </Button>
              <span style={{ margin: "0 15px", fontWeight: "bold" }}>
                {quantity}
              </span>
              <Button
                variant="outline-dark"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
            <Button variant="success" onClick={addToCart} disabled={loading}>
              {loading ? (
                "Adding..."
              ) : (
                <>
                  <IoBagOutline
                    style={{ marginRight: "8px", fontSize: "18px", marginTop: "-5px" }}
                  />
                  Add to Cart
                </>
              )}
            </Button>

            <Button
              variant="outline-danger"
              onClick={addToWishlist}
              disabled={wishLoading}
            >
              {wishLoading ? (
                "Adding..."
              ) : (
                <>
                  <IoMdHeartEmpty
                    style={{ marginRight: "6px", fontSize: "18px", marginTop: "-5px" }}
                  />
                  Wishlist
                </>
              )}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Product added to cart successfully ✅
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Continue Shopping
          </Button>
          <Button variant="success" onClick={() => navigate("/cart")}>
            View Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DetailsPage;
