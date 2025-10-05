import React from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";

const About = () => {
  return (
    <Container style={{ marginTop: "120px", marginBottom: "50px" }}>
      <h2 className="text-center mb-5">About Us</h2>

      {/* Company Info */}
      <Row className="mb-5 align-items-center">
        <Col md={6}>
          <Image
            src="https://via.placeholder.com/500x300" // replace with your image
            fluid
            rounded
          />
        </Col>
        <Col md={6}>
          <h3>Who We Are</h3>
          <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
            We are a passionate e-commerce platform committed to bringing you
            the best products at the best prices. Our mission is to make online
            shopping simple, convenient, and enjoyable for everyone.
          </p>
        </Col>
      </Row>

      {/* Mission & Vision */}
      <Row className="mb-5 text-center">
        <Col md={6}>
          <Card className="p-4 h-100 shadow-sm">
            <h4>Our Mission</h4>
            <p>
              To provide high-quality products, excellent customer service, and
              a seamless online shopping experience.
            </p>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-4 h-100 shadow-sm">
            <h4>Our Vision</h4>
            <p>
              To become a trusted brand for online shoppers worldwide,
              revolutionizing the way people shop online.
            </p>
          </Card>
        </Col>
      </Row>

      {/* Team Section */}
      <h3 className="text-center mb-4">Meet Our Team</h3>
      <Row className="g-4 text-center">
        {[
          { name: "John Doe", role: "Founder & CEO", img: "https://via.placeholder.com/150" },
          { name: "Jane Smith", role: "Head of Marketing", img: "https://via.placeholder.com/150" },
          { name: "Mike Johnson", role: "Lead Developer", img: "https://via.placeholder.com/150" },
          { name: "Emily Davis", role: "Customer Support", img: "https://via.placeholder.com/150" },
        ].map((member, idx) => (
          <Col key={idx} xs={12} sm={6} md={3}>
            <Card className="p-3 h-100 shadow-sm">
              <Image
                src={member.img}
                roundedCircle
                style={{ width: "100px", height: "100px", objectFit: "cover", marginBottom: "15px" }}
              />
              <h5>{member.name}</h5>
              <p style={{ fontSize: "14px", color: "gray" }}>{member.role}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default About;
