import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import './Css/Footer.css';
import { Link } from "react-router-dom";
import image2 from "./Images/IMG_5313.PNG"

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "black",
        color: "#fff",
        padding: "30px 0",
        marginTop: "auto",
        width: "100%",
      }}
    >
      <Container>
        <Row className="text-center text-md-left">
          {/* About Section */}
          <Col xs={12} md={4} className="mb-4 mb-md-0">
            <img style={{height:"40px", width:"300px",marginBottom:"15px"}} className="footerimg" src={image2} alt="" />
            <p>
              Outfitly offers beautiful Indian traditional ladies wear – sarees, salwar suits, lehengas, and more. Celebrate every occasion with timeless style and elegance.
            </p>
          </Col>

          {/* Quick Links */}
          <Col xs={12} md={4} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              <li><a href="/" style={{ color: "#fff", textDecoration: "none" }}>Home</a></li>
              <li><a as={Link} to="/About" style={{ color: "#fff", textDecoration: "none" }}>About</a></li>
              <li><a as={Link} to="/categories/:categoryname" style={{ color: "#fff", textDecoration: "none" }}>Collections</a></li>
              <li><a as={Link} to="/Contactus" style={{ color: "#fff", textDecoration: "none" }}>Contact Us</a></li>
            </ul>
          </Col>

          {/* Social Media */}
          <Col xs={12} md={4}>
            <h5>Follow Us</h5>
            <div style={{ display: "flex", justifyContent: "center", gap: "15px", fontSize: "1.5rem" }}>
              <a href="https://facebook.com" style={{ color: "#fff" }}><FaFacebook /></a>
              <a href="https://instagram.com" style={{ color: "#fff" }}><FaInstagram /></a>
              <a href="https://twitter.com" style={{ color: "#fff" }}><FaTwitter /></a>
              <a href="https://linkedin.com" style={{ color: "#fff" }}><FaLinkedin /></a>
            </div>
          </Col>
        </Row>

        <hr style={{ backgroundColor: "#fff", margin: "20px 0" }} />

        <Row>
          <Col className="text-center">
            <p>© {new Date().getFullYear()} Blush & Bloom. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
