import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Row} from "react-bootstrap";
import axios from "axios";
import "./Css/Home.css";

const Home = () => {
  const navigate = useNavigate();


  // const sample= useParams()
// console.log(sample);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newarrivals, setnewarrivals] = useState([])
  const [popular, setpopular] = useState([])
  const [trending, settrending] = useState([])
  

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((result) => setProducts(result.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/category`)
      .then((result) => setCategories(result.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
  const Filtered = products.filter(
    (item) => item.category === "New Arrivals"
  );
  setnewarrivals(Filtered);
}, [products]);

useEffect(() => {
  const Popular = products.filter(
    (pop) => pop.category === "Popular"
  );
  setpopular(Popular);
}, [products]);

console.log(popular);


console.log("API URL:", import.meta.env.VITE_API_URL);

useEffect(() => {
  const Trending = products.filter(
    (tre) => tre.category === "Trending"
  );
  settrending(Trending);
}, [products]);

console.log(popular);

  
  

  const details = (id) => {
    navigate(`/details/${id}`);
  };

  const categoriesPage = (categoryname) => {
    navigate(`/categories/${categoryname}`);
  };
  
  
  

  return (
    <div>

      <Outlet />

      {/* Categories Section */}
      <Container className="my-5">
        <Row className="align-items-center">
          <Col xs={6}>
            <h2 className="fw-normal">Categories you might like</h2>
          </Col>
          <Col xs={6} className="text-end">
            <Link
              to="/listcategories"
              style={{
                textDecoration: "underline",
                color:'black',
                textUnderlineOffset: "4px",
                cursor: "pointer",
              }}
            >
              View All Categories
            </Link>
          </Col>
        </Row>

        <div
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            padding: "20px 0",
          }}
        >
          {categories.map((item, index) => (
            <Card
              key={index}
              onClick={() => categoriesPage(item.categoryname)}
              className="categoriescard"
              style={{
                minWidth: "180px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Card.Img
                variant="top"
                src={item.categoryimage}
                className="img-fluid rounded"
                style={{ height: "220px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="text-center">
                  {item.categoryname}
                </Card.Title>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>

      

      {/* New Arrivals */}
      <Container style={{ marginTop: "50px", marginBottom: "50px" }}>
            {/* Heading */}
            <h5 className="mb-5" style={{fontFamily:"sans-serif",fontWeight:"bold", textUnderlineOffset: "6px",marginLeft:'auto', color:"gray"  }} > New Arrivals </h5>
            
      
            {/* Product Grid */}
            <Row className="g-4">
              {newarrivals.map((product) => (
                <Col
                  key={product._id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  
                  style={{ cursor: "pointer" }}
                >
                  <Card onClick={() => details(product._id)} className="h-100 border-0 shadow-sm">
                    <Card.Img
                      className="card-image"
                      src={product.image}
                      alt={product.name}
                     
                      style={{
                        height: "420px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <Card.Body>
                      <Card.Title
                        className="card-title-items"
                        style={{ fontSize: "16px", fontWeight: "500" }}
                      >
                        {product.name}
                      </Card.Title>
                      <Card.Text style={{ fontSize: "15px", color: "green" }}>
                        ₹{product.price}
                      </Card.Text>
                      <Card.Text
                        style={{
                          fontSize: "14px",
                          color: "#555",
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

          <Container style={{ marginTop: "80px", marginBottom: "50px" }}>
            {/* Heading */}
            <h5 className=" mb-5" style={{fontFamily:"sans-serif",fontWeight:"bold", textUnderlineOffset: "6px",marginLeft:'auto', color:"gray"  }} > Popular Collections </h5>
            
      
            {/* Product Grid */}
            <Row className="g-4">
              {popular.map((product) => (
                <Col
                  key={product._id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  
                  style={{ cursor: "pointer" }}
                >
                  <Card onClick={() => details(product._id)} className="h-100 border-0 shadow-sm">
                    <Card.Img
                      className="card-image"
                      src={product.image}
                      alt={product.name}
                      style={{
                        height: "420px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <Card.Body>
                      <Card.Title
                        className="card-title-items"
                        style={{ fontSize: "16px", fontWeight: "500" }}
                      >
                        {product.name}
                      </Card.Title>
                      <Card.Text style={{ fontSize: "15px", color: "green" }}>
                        ₹{product.price}
                      </Card.Text>
                      <Card.Text
                        style={{
                          fontSize: "14px",
                          color: "#555",
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

          

           <Container style={{ marginTop: "80px", marginBottom: "50px" }}>
            {/* Heading */}
            <h5 className=" mb-5" style={{fontFamily:"sans-serif",fontWeight:"bold", textUnderlineOffset: "6px",marginLeft:'auto', color:"gray"  }} > Trending Now </h5>
            
      
            {/* Product Grid */}
            <Row className="g-4">
              {trending.map((product) => (
                <Col
                  key={product._id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  
                  style={{ cursor: "pointer" }}
                >
                  <Card onClick={() => details(product._id)} className="h-100 border-0 shadow-sm">
                    <Card.Img
                      className="card-image"
                      src={product.image}
                      alt={product.name}
                      style={{
                        height: "420px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <Card.Body>
                      <Card.Title
                        className="card-title-items"
                        style={{ fontSize: "16px", fontWeight: "500" }}
                      >
                        {product.name}
                      </Card.Title>
                      <Card.Text style={{ fontSize: "15px", color: "green" }}>
                        ₹{product.price}
                      </Card.Text>
                      <Card.Text
                        style={{
                          fontSize: "14px",
                          color: "#555",
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
    </div>
  );
};

export default Home;
