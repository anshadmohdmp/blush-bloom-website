import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Authentification/AuthProvider";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Css/Profile.css";
import { GoChecklist } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { SlLocationPin } from "react-icons/sl";
import { PiDownloadSimple } from "react-icons/pi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { CiHeart } from "react-icons/ci";

const Profile = () => {
  const { token, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.log(err));
    }
  }, [token]);

  const cards = [
    { image: <GoChecklist size={30} />, title: "My Orders" },
    { image: <PiDownloadSimple size={30} />, title: "Downloads" },
    { image: <SlLocationPin size={30} />, title: "Address" },
    { image: <MdOutlineAccountCircle size={30} />, title: "Account Details" },
    { image: <CiHeart size={30} />, title: "Wishlist" },
    { image: <CiLogout size={30} />, title: "Logout" },
  ];

  const handleCardClick = (title) => {
    switch (title) {
      case "My Orders":
        navigate("/MyOrders");
        break;
      case "Address":
        navigate("/Address");
        break;
      case "Logout":
        logout(); // Clear token from context and localStorage
        navigate("/"); // Redirect to home page
        break;
      case "Downloads":
        navigate("/Downloads");
        break;
      case "Account Details":
        navigate("/AccountDetails");
        break;
      case "Wishlist":
        navigate("/Wishlist");
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Full-width header */}
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "70px 0",
          marginTop: "140px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "4rem", fontWeight: "bolder" }}>
          My Account
        </h1>
        <h6
          style={{
            marginTop: "20px",
            fontSize: "0.875rem",
            display: "flex",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <Link className="home" to="/">
            Home
          </Link>
          <span className="current">/ My Account</span>
        </h6>
      </div>

      {/* Profile content */}
      <Container style={{ marginTop: "50px", marginBottom: "50px" }}>
        <Row className="justify-content-center text-center">
          <Col xs={12} md={8} lg={6}>
            <h3 style={{ fontSize: "1rem", fontWeight: "normal", marginTop: "20px" }}>
              Hello, <span style={{ fontWeight: "bolder" }}>{user?.email}</span>
            </h3>
            <p style={{ fontSize: "0.9rem", marginTop: "20px" }}>
              From your account dashboard you can view your recent orders, manage your shipping and billing addresses.
            </p>
          </Col>
        </Row>

        {/* Cards */}
        <Row className="mt-5 text-center justify-content-center" xs={1} sm={2} md={3} lg={3}>
          {cards.map((card, idx) => (
            <Col key={idx} className="mb-4 d-flex justify-content-center">
              <Card
                className="text-center card-hover"
                style={{ cursor: "pointer", padding: "20px", width: "100%", maxWidth: "300px" }}
                onClick={() => handleCardClick(card.title)}
              >
                <Card.Body>
                  <div className="cardimage mb-3">{card.image}</div>
                  <Card.Title className="cardtext" style={{ fontSize: "1rem" }}>
                    {card.title}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Profile;
