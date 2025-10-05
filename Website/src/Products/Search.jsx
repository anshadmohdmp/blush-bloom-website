import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
  const params = new URLSearchParams(location.search);
  const query = params.get("search") || "";
  console.log("Frontend sending search query:", query); // 👀 log this
  setSearchQuery(query);

  if (query) {
    axios
      .get(`https://blush-bloom-api.onrender.com/products?search=${query}`)
      .then((res) => {
        console.log("Backend response:", res.data); // 👀 log this
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  } else {
    setProducts([]);
  }
}, [location.search]);


    return (
        <Container className="my-5">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    navigate(`/Search?search=${e.target.value}`);
                }}
                placeholder="Search for products..."
                style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: '100px'
                }}
            />

            <Row className="mt-2 g-4">
                {products.map((item) => (
                    <Col key={item._id} xs={12} sm={6} md={4} lg={3}>
                        <Card className="h-100 shadow-sm">
                            <Card.Img
                                variant="top"
                                src={item.image}
                                style={{
                                    height: "420px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                }}
                            />
                            <Card.Body>
                                <Card.Title style={{ fontSize: "16px", fontWeight: "500" }}>{item.name}</Card.Title>
                                <Card.Text style={{ fontSize: "15px", color: "green" }}>₹{item.price}</Card.Text>
                                <Card.Text
                                    style={{
                                        fontSize: "14px",
                                        color: "#555",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {item.description}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Search;
