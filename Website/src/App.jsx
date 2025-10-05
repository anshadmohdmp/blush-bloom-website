import React from 'react'
import Home from './Home'
import { Routes, Route, BrowserRouter} from 'react-router-dom';
import Navigationbar from './Navigationbar'
 import 'bootstrap/dist/css/bootstrap.min.css';
import Banner from './Banner'
import './Css/App.css'
import DetailsPage from './Products/DetailsPage'
import Categories from './Products/Categories';
import Footer from './Footer';
import Login from './Authentification/Login';
import Register from './Authentification/Register';
import { AuthProvider } from './Authentification/AuthProvider';
import GoogleSuccess from './Authentification/GoogleSuccess';
import Search from './Products/Search';
import About from './About';
import Contactus from './Contactus';

import Cart from './Products/Cart';
import Wishlist from './Products/Wishlist';
import Order from './Order';
import Profile from './Profile';
import MyOrders from './MyOrders';
import Orderdetails from './Orderdetails';
import Listcatogories from './Products/Listcatogories';


const App = () => {
  return (
    <div className= 'app-container' >

      
      
      <BrowserRouter>
      <AuthProvider>
      <Navigationbar />
      <Banner />
      <div className='content'>
      <Routes>
  {/* Home Page */}
  <Route path="/" element={<Home />} />

  {/* Other Pages */}
  <Route path="/search" element={<Search />} />
  <Route path="/details/:id" element={<DetailsPage />} />
  <Route path="/categories/:categoryname" element={<Categories />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/google-success" element={<GoogleSuccess />} />
  <Route path="/about" element={<About />} />
  <Route path="/contactus" element={<Contactus />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/wishlist" element={<Wishlist />} />
  <Route path="/order" element={<Order />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/myorders" element={<MyOrders />} />
  <Route path="/orderdetails/:id" element={<Orderdetails />} />
  <Route path="/listcategories" element={<Listcatogories />} />

</Routes>

      </div>
      <Footer/>
      </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App