import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Authentification/AuthProvider";
import "../Css/Categories.css";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const Categories = () => {
  const { categoryname } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [filtered, setFiltered] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch products by category
  useEffect(() => {
    axios
      .get(`https://blush-bloom-api.onrender.com/products/category/${categoryname}`)
      .then((res) => setFiltered(res.data))
      .catch((err) => console.log(err));

    if (token) {
      fetchWishlist();
    }
  }, [categoryname, token]);

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`https://blush-bloom-api.onrender.com/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(res.data.items.map((item) => item.product._id));
    } catch (err) {
      console.error(err);
    }
  };

  // Add/remove from wishlist
  const toggleWishlist = async (productId) => {
    if (!token) {
      alert("Please login first to add items to your Wishlist.");
      navigate("/Login");
      return;
    }

    try {
      if (wishlistItems.includes(productId)) {
        await axios.delete(`https://blush-bloom-api.onrender.com/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(
          `https://blush-bloom-api.onrender.com/wishlist`,
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItems((prev) => [...prev, productId]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update Wishlist");
    }
  };

  const changePage = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <Container style={{ marginTop: "100px", marginBottom: "40px" }}>
      <h5
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          marginBottom: "25px",
          
        }}
      >
        {categoryname} / {filtered.length} items
      </h5>

      <Row className="g-3 g-md-4">
        {filtered.map((product) => (
          <Col
            key={product._id}
            xs={6} // ✅ 2 items per row on mobile
            sm={6}
            md={4} // ✅ 3 items per row on tablet
            lg={3} // ✅ 4 items per row on desktop
            style={{ cursor: "pointer" }}
          >
            <Card className="h-100 border-0 shadow-sm rounded-3">
              <div style={{ position: "relative" }}>
                <Card.Img
                  src={product.image}
                  alt={product.name}
                  onClick={() => changePage(product._id)}
                  style={{
                    width: "100%",
                    height: "420px",
                    objectFit: "cover",
                    borderRadius: "10px 10px 0 0",
                  }}
                />

                {/* Wishlist heart - bottom right corner of image */}
                <span
                  onClick={() => toggleWishlist(product._id)}
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: wishlistItems.includes(product._id) ? "red" : "white",
                    padding: "6px",
                  }}
                >
                  {wishlistItems.includes(product._id) ? (
                    <IoMdHeart />
                  ) : (
                    <IoMdHeartEmpty />
                  )}
                </span>
              </div>

              <Card.Body className="d-flex flex-column p-2">
                <Card.Title
                  onClick={() => changePage(product._id)}
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "4px",
                    textAlign: "left",
                  }}
                >
                  {product.name}
                </Card.Title>

                <Card.Text
                  style={{
                    fontSize: "13px",
                    color: "green",
                    marginBottom: "4px",
                  }}
                >
                  ₹{product.price}
                </Card.Text>

                <Card.Text
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Categories;
