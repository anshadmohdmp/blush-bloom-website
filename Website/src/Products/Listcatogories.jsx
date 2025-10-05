import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import "../Css/Listcategories.css"

const ListCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/category`)
      .then((result) => setCategories(result.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container style={{ marginTop: "100px", marginBottom: "40px" }}>
      <h5
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          marginBottom: "25px",
        }}
      >
        Categories
      </h5>

      {/* ✅ One Row for all categories */}
      <Row className="g-3 g-md-4">
        {categories.map((item) => (
          <Col
            key={item._id}
            xs={6} // 2 items per row on mobile
            sm={6}
            md={4} // 3 items per row on tablet
            lg={3} // 4 items per row on desktop
            style={{ cursor: "pointer" }}
          >
            <Card  style={{border:"none",marginBottom:"20px"}} className=" h-100  rounded-3">
              <div style={{ position: "relative" }}>
                <Card.Img
                className="cat"
                  src={item.categoryimage}
                  alt={item.categoryname}
                  style={{
                    width: "100%",
                    height: "420px",
                    objectFit: "cover",
                    borderRadius: "10px 10px 10px 10px",
                  }}
                />
              </div>

              <Card.Body className="d-flex flex-column p-2">
                <Card.Title
                className="cattext"
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    marginBottom: "4px",
                    marginTop:"10px",
                    textAlign: "center",
                  }}
                >
                  {item.categoryname}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ListCategories;
