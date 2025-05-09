import React from "react";
import Header from "./layouts/Header";
import Footer from './layouts/Footer'
import "./styles/main.scss";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import About from './routes/About';
import Contact from './routes/Contact';
import Shop from './routes/Shop';
import SingleProduct from './routes/SingleProduct';
import Register from './routes/Register';
import Profile from './routes/Profile';
import Wishlist from './routes/Wishlist';
import Cart from './routes/Cart';
import Pages from './routes/Pages';
import Blog from './routes/Blog';
import { LoaderProvider } from './hooks/useLoader';
import Loading from './components/Loading'
function App() {

  
  return (
    <LoaderProvider>
      <Router>
      <div className="App">
      <Header />
      <Loading />
      <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/pages" element={<Pages/>} />
          </Routes>
        </main>
        <Footer/>
    </div>
    </Router>
    </LoaderProvider>
    
    
  )
}
export default App
