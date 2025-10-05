import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_API_URL}/register`, { firstName, lastName, email, password })
      .then((res) => {
        alert("Registration successful! Please log in.");
        navigate("/login");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Registration failed");
      });
  }




  return (
    <div style={{
      maxWidth: "420px",
      margin: "100px auto",
      marginTop: "180px",
      padding: "30px",
      borderRadius: "15px",
      background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
      boxShadow: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff", // ✅ 3D Neumorphism effect
      transform: "perspective(1000px) rotateX(2deg) rotateY(2deg)", // tilt 3D
      transition: "all 0.3s ease-in-out"
    }}>
      <h2 style={{ textAlign: 'center' }}>Register</h2>
      <Form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>

        <Form.Group className="mb-3" >
          <Form.Label>First Name</Form.Label>
          <Form.Control onChange={(e) => setfirstName(e.target.value)} style={{
            borderRadius: "10px",
            boxShadow: "inset 5px 5px 10px #d1d1d1, inset -5px -5px 10px #ffffff",
            border: "none"
          }} type="text" placeholder="Enter First Name" />
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Label>Last Name</Form.Label>
          <Form.Control onChange={(e) => setlastName(e.target.value)}
            style={{
              borderRadius: "10px",
              boxShadow: "inset 5px 5px 10px #d1d1d1, inset -5px -5px 10px #ffffff",
              border: "none"
            }}
            type="text" placeholder="Enter Last Name" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onChange={(e) => setemail(e.target.value)} style={{
            borderRadius: "10px",
            boxShadow: "inset 5px 5px 10px #d1d1d1, inset -5px -5px 10px #ffffff",
            border: "none"
          }} 
          type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label >Password</Form.Label>
          <div style={{ position: "relative" }}>
            <Form.Control
              onChange={(e) => setpassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              style={{
                borderRadius: "10px",

                boxShadow: "inset 5px 5px 10px #d1d1d1, inset -5px -5px 10px #ffffff",
                border: "none"
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#555",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </Form.Group>

        <Button style={{ marginTop: '30px', backgroundColor: 'black', border: "none", width: "90px" }}
          className="d-block mx-auto" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Register;
