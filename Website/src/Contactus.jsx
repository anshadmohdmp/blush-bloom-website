import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { IoMdMail } from "react-icons/io";
import { IoMdCall } from "react-icons/io";
import { IoMdPin } from "react-icons/io";

const Contactus = () => {
  return (
    <Container style={{ marginTop: "120px", marginBottom: "50px" }}>
      <h2 className="text-center mb-5">Contact Us</h2>

      <Row className="g-4 justify-content-center">
        <Col md={4}>
          <Card className="p-4 text-center shadow-sm">
            <IoMdPin style={{ fontSize: "30px", color: "#198754", marginBottom: "10px" }} />
            <h5>Address</h5>
            <p>123 Your Street, Your City, Your Country</p>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-4 text-center shadow-sm">
            <IoMdCall style={{ fontSize: "30px", color: "#198754", marginBottom: "10px" }} />
            <h5>Phone</h5>
            <p>+1 234 567 890</p>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-4 text-center shadow-sm">
            <IoMdMail style={{ fontSize: "30px", color: "#198754", marginBottom: "10px" }} />
            <h5>Email</h5>
            <p>info@yourcompany.com</p>
          </Card>
        </Col>
      </Row>

      {/* Optional Map */}
      <Row className="mt-5 justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm">
            <iframe
              title="Company Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086234631133!2d-122.41941508468267!3d37.77492977975939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085818b1b2b1aab%3A0x1a2b3c4d5e6f7g8h!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1695312321234!5m2!1sen!2sus"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contactus;
