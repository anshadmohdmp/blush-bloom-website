import React, { useContext, useState, useEffect } from "react";
import { Navbar, Container, Nav, NavDropdown, Modal, Button, Badge, Offcanvas } from "react-bootstrap";
import image1 from "./Images/IMG_5313.PNG";
import { IoSearchOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./Authentification/AuthProvider";
import axios from "axios";
import "./Css/Navigationbar.css";

const Navigationbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useContext(AuthContext);

  const [showCollections, setShowCollections] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const isHomepage = location.pathname === "/";

  useEffect(() => {
    axios
      .get(`https://blush-bloom-api.onrender.com/category`)
      .then((result) => setCategories(result.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get(`https://blush-bloom-api.onrender.com/cart`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setCartCount(res.data.items.length || 0))
        .catch((err) => console.log(err));

      axios
        .get(`https://blush-bloom-api.onrender.com/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setWishlistCount(res.data.items.length || 0))
        .catch((err) => console.log(err));
    } else {
      setCartCount(0);
      setWishlistCount(0);
    }
  }, [token]);

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (!showSearch) navigate("/Search");
  };

  const confirmLogout = () => {
    logout();
    navigate("/Login");
    setShowLogoutModal(false);
  };

  return (
    <>
      <Navbar
        expand="lg"
        className={`custom-navbar ${!isHomepage ? "navbar-colored" : "navbar-transparent"}`}
        fixed={!isHomepage ? "top" : undefined}
      >
        <Container fluid className="d-flex align-items-center">
          {/* Logo */}
          <Navbar.Brand
            onClick={() => navigate("/")}
            className="d-flex align-items-center logo-container"
            style={{ cursor: "pointer" }}
          >
            <img
              style={{ height: "25px", width: "150px" }}
              src={image1}
              alt="Logo"
              className="nav-img"
            />
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            onClick={() => setShowSidebar(true)}
          />

          <Navbar.Collapse className="d-none d-lg-flex">
            <Nav className="mx-auto text-center">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <NavDropdown
                title="Collections"
                id="collections-dropdown"
                show={showCollections}
                onMouseEnter={() => setShowCollections(true)}
                onMouseLeave={() => setShowCollections(false)}
              >
                {categories.map((cat) => (
                  <NavDropdown.Item key={cat._id} as={Link} to={`/categories/${cat.categoryname}`}>
                    {cat.categoryname}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <Nav.Link as={Link} to="/categories/Bags">Bags</Nav.Link>
              <Nav.Link as={Link} to="/categories/Sandals">Sandals</Nav.Link>
              <Nav.Link as={Link} to="/categories/Watches">Watches</Nav.Link>
              <Nav.Link as={Link} to="/About">About</Nav.Link>
              <Nav.Link as={Link} to="/Contactus">Contact Us</Nav.Link>
            </Nav>

            <Nav className="d-flex align-items-center gap-3">
              <Nav.Link onClick={handleSearchClick}>
                <IoSearchOutline size={22} />
              </Nav.Link>

              <NavDropdown
                title={<FiUser size={22} />}
                id="user-dropdown"
                show={showUser}
                onMouseEnter={() => setShowUser(true)}
                onMouseLeave={() => setShowUser(false)}
              >
                {token ? (
                  <>
                    <NavDropdown.Item as={Link} to="/Profile">Profile</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => setShowLogoutModal(true)}>Logout</NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <NavDropdown.Item as={Link} to="/Login">Log in</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/Register">Register</NavDropdown.Item>
                  </>
                )}
              </NavDropdown>

              <Nav.Link onClick={() => navigate("/Wishlist")} style={{ position: "relative" }}>
                <IoMdHeartEmpty size={22} />
                {wishlistCount > 0 && (
                  <Badge bg="danger" pill style={{ position: "absolute", top: "-5px", right: "-10px", fontSize: "12px" }}>
                    {wishlistCount}
                  </Badge>
                )}
              </Nav.Link>

              <Nav.Link onClick={() => navigate("/Cart")} style={{ position: "relative" }}>
                <IoBagOutline size={22} />
                {cartCount > 0 && (
                  <Badge bg="danger" pill style={{ position: "absolute", top: "3px", right: "-2px", fontSize: "10px" }}>
                    {cartCount}
                  </Badge>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Sidebar for mobile */}
      < Offcanvas  show={showSidebar} onHide={() => setShowSidebar(false)} placement="start" className="bg-black text-white sidebar">
        <Offcanvas.Body  className="d-flex flex-column">
  {/* Mobile Icons at top */}
  <div onClick={() => setShowSidebar(false)} style={{marginTop:"5px"}} className="d-flex justify-content-around mb-3">
    {/* Search */}
    <div onClick={handleSearchClick} style={{ cursor: "pointer" }}>
      <IoSearchOutline size={22} />
    </div>

    {/* Profile / Login */}
    <div>
      {token ? (
        <div onClick={() => navigate("/Profile")} style={{ cursor: "pointer" }}>
          <FiUser size={22} />
        </div>
      ) : (
        <div onClick={() => navigate("/Login")} style={{ cursor: "pointer" }}>
          <FiUser size={22} />
        </div>
      )}
    </div>

    {/* Wishlist */}
    <div onClick={() => navigate("/Wishlist")} style={{ position: "relative", cursor: "pointer" }}>
      <IoMdHeartEmpty size={22} />
      {wishlistCount > 0 && (
        <Badge
          bg="danger"
          pill
          style={{ position: "absolute", top: "-5px", right: "-10px", fontSize: "12px" }}
        >
          {wishlistCount}
        </Badge>
      )}
    </div>

    {/* Cart */}
    <div onClick={() => navigate("/Cart") } style={{ position: "relative", cursor: "pointer" }}>
      <IoBagOutline size={22} />
      {cartCount > 0 && (
        <Badge
          bg="danger"
          pill
          style={{ position: "absolute", top: "-5px", right: "-10px", fontSize: "12px" }}
        >
          {cartCount}
        </Badge>
      )}
    </div>
  </div>

  {/* Navigation Links */}
  <Nav className="flex-column gap-3">
    <Nav.Link as={Link} to="/" onClick={() => setShowSidebar(false)} className="text-white">Home</Nav.Link>
    <NavDropdown title="Collections" id="collections-dropdown-mobile" className="text-white">
      {categories.map((cat) => (
        <NavDropdown.Item key={cat._id} as={Link} to={`/categories/${cat.categoryname}`} onClick={() => setShowSidebar(false)}>
          {cat.categoryname}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
    <Nav.Link as={Link} to="/categories/Bags" onClick={() => setShowSidebar(false)} className="text-white">Bags</Nav.Link>
    <Nav.Link as={Link} to="/categories/Sandals" onClick={() => setShowSidebar(false)} className="text-white">Sandals</Nav.Link>
    <Nav.Link as={Link} to="/categories/Watches" onClick={() => setShowSidebar(false)} className="text-white">Watches</Nav.Link>
    <Nav.Link as={Link} to="/About" onClick={() => setShowSidebar(false)} className="text-white">About</Nav.Link>
    <Nav.Link as={Link} to="/Contactus" onClick={() => setShowSidebar(false)} className="text-white">Contact Us</Nav.Link>
    <Nav.Link
  as={Link}
  to={token ? "#" : "/Login"} // If logged in, prevent navigation
  onClick={() => {
    setShowSidebar(false);
    if (token) {
      // Perform logout
      logout();
      navigate("/Login");
    }
  }}
  className="text-white"
>
  {token ? "Log Out" : "Log In"}
</Nav.Link>
 <Nav.Link as={Link} to="/Register" onClick={() => setShowSidebar(false)} className="text-white">Register Now</Nav.Link>
  </Nav>
</Offcanvas.Body>
      </Offcanvas>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmLogout}>Logout</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navigationbar;
