import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Authentification/AuthProvider";

const Wishlist = () => {
  const { token, loading: authLoading } = useContext(AuthContext); // get auth loading state
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    // Wait for AuthProvider to finish loading
    if (!authLoading) {
      if (!token) {
        navigate("/Login");
      } else {
        fetchWishlist();
      }
    }
  }, [token, authLoading, navigate]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`https://blush-bloom-api.onrender.com/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`https://blush-bloom-api.onrender.com/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToCart = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  const moveToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    try {
      await axios.post(
        `https://blush-bloom-api.onrender.com/cart`,
        {
          productId: selectedProduct.product._id,
          size: selectedSize,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await removeItem(selectedProduct.product._id);

      setShowModal(false);
      setSelectedProduct(null);
      setSelectedSize("");
      navigate("/cart");
    } catch (err) {
      console.error(err);
      alert("Failed to move product to cart.");
    }
  };

  // Show loading while checking token or fetching wishlist
  if (authLoading || loading) return <p>Loading...</p>;

  return (
    <Container style={{ marginTop: "120px", marginBottom: "50px",height:"50vh" }}>
      <h3 className="mb-4">Your Wishlist</h3>

      {wishlist.length === 0 ? (
        <p>
          Your wishlist is empty.{" "}
          <Button style={{backgroundColor:"black",border:"none"}} onClick={() => navigate("/")}>Go Shopping</Button>
        </p>
      ) : (
        <Row className="g-4">
          {wishlist.map((item) => (
            <Col key={item.product._id + item.size} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={item.product.image}
                  style={{ height: "380px", objectFit: "cover", borderRadius: "10px" }}
                  onClick={() => navigate(`/details/${item.product._id}`)}
                />
                <Card.Body>
                  <Card.Title>{item.product.name}</Card.Title>
                  <Card.Text style={{ fontSize: "13px" }}>
                    {item.product.description}
                  </Card.Text>
                  <Card.Text>₹{item.product.price}</Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleMoveToCart(item)}
                  >
                    Move to Cart
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(item.product._id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">-- Select Size --</option>
            <option value="S">Small (S)</option>
            <option value="M">Medium (M)</option>
            <option value="L">Large (L)</option>
            <option value="XL">Extra Large (XL)</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={moveToCart}>
            Move to Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Wishlist;
