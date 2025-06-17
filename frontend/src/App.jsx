import React, { useEffect } from 'react';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import './styles/main.scss';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import Login from './routes/Login';
import Blog from './routes/Blog';
import Compare from './routes/Compare';
import Checkout from './routes/Checkout';
import ForgotPassword from './routes/ForgotPassword';
import ResetPassword from './routes/ResetPassword';
import { LoaderProvider } from './hooks/useLoader';
import Loading from './components/Loading';
import useScrollTop from './hooks/useScrollTop';
import * as api from './api/api';
import { UserProvider, useUserData } from './context/UserContext';

function App() {
  useScrollTop();
  const navigate = useNavigate();
  const { setLoggedIn, setUserData } = useUserData();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const tokenResponse = await api.getToken();
        if (tokenResponse.data?.token) {
          const userResponse = await api.getUser(tokenResponse.data.token);
          if (userResponse.data) {
            setUserData(userResponse.data);
            setLoggedIn(true);
            // Uncomment if you want to redirect logged in users
            // navigate('/profile');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    getUserInfo();
  }, [navigate, setLoggedIn, setUserData]);

  return (
    <div className="App">
      <Header />
      <Loading />
      <main className="content">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="/contact"
            element={<Contact />}
          />
          <Route
            path="/shop"
            element={<Shop />}
          />
          <Route
            path="/product/:id"
            element={<SingleProduct />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="/wishlist"
            element={<Wishlist />}
          />
          <Route
            path="/cart"
            element={<Cart />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route
            path="/blog"
            element={<Blog />}
          />
          <Route
            path="/pages"
            element={<Pages />}
          />
          <Route
            path="/compare"
            element={<Compare />}
          />
          <Route
            path="/checkout"
            element={<Checkout />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
