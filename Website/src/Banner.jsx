import React from "react";
import { Carousel, Image } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import image2 from "./Images/pexels-guru-praveen-169878542-15181112.jpg";
import image3 from "./Images/pexels-harsh-kushwaha-804217-1676059.jpg";
import image4 from "./Images/pexels-a-darmel-7176345.jpg";
import "./Css/Banner.css";

const Banner = () => {
  const location = useLocation();

  // Show only on homepage
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <div style={{marginTop:"-90px"}} className="banner-container">
      <Carousel interval={3000} controls indicators pause={false}>
        <Carousel.Item>
          <Image className="banner-img" src={image2} alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
          <Image className="banner-img" src={image3} alt="Second slide" />
        </Carousel.Item>
        <Carousel.Item>
          <Image className="banner-img" src={image4} alt="Third slide" />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Banner;
