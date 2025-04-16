
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faTwitter, faPinterest, faDribbble} from "@fortawesome/free-brands-svg-icons";
import PaymentMethods from '../assets/images/payment-methods.png'
import Logo from '../assets/images/pronia-image.png'
const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column brand-column">
          <div className="logo">
            <img src={Logo}></img>
          </div>
          <p className="brand-description">
            Lorem ipsum dolor sit amet, consec adipisi elit, sed do eiusmod tempor incidio ut labore et dolore magna.
          </p>
          <div className="social-icons">
            <a onClick={scrollToTop} className="social-icon" >
              <FontAwesomeIcon icon={faFacebook}/>
            </a>
            <a onClick={scrollToTop} className="social-icon" >
              <FontAwesomeIcon icon={faTwitter}/>
            </a>
            <a onClick={scrollToTop}  className="social-icon">
            <FontAwesomeIcon icon={faPinterest}/>
            </a>
            <a onClick={scrollToTop} className="social-icon">
            <FontAwesomeIcon icon={faDribbble}/>
            </a>
          </div>
        </div>

        <div className="footer-column links-column">
          <h3>Useful Links</h3>
          <ul>
            <li><a onClick={scrollToTop}>About Pronia</a></li>
            <li><a onClick={scrollToTop}>How to Shop</a></li>
            <li><a onClick={scrollToTop}>FAQ</a></li>
            <li><a onClick={scrollToTop}>Contact us</a></li>
            <li><a onClick={scrollToTop}>Log in</a></li>
          </ul>
        </div>

        <div className="footer-column account-column">
          <h3>My Account</h3>
          <ul>
            <li><a onClick={scrollToTop}>Sign In</a></li>
            <li><a onClick={scrollToTop}>View Cart</a></li>
            <li><a onClick={scrollToTop}>My Wishlist</a></li>
            <li><a onClick={scrollToTop}>Track My Order</a></li>
            <li><a onClick={scrollToTop}>Help</a></li>
          </ul>
        </div>

        <div className="footer-column service-column">
          <h3>Our Service</h3>
          <ul>
            <li><a onClick={scrollToTop}>Payment Methods</a></li>
            <li><a onClick={scrollToTop}>Money Guarantee!</a></li>
            <li><a onClick={scrollToTop}>Returns</a></li>
            <li><a onClick={scrollToTop}>Shipping</a></li>
            <li><a onClick={scrollToTop}>Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-column contact-column">
          <h3>Got Question? Call Us</h3>
          <div className="contact-info">
            <div className="phone-number">
                <h5>123 456 789</h5>
              
            </div>
            <div className="address-section">
              <p>Your Address Goes Here</p>
              <div className="payment-cards">
                <img src={PaymentMethods} alt="Payment Methods" className="payment-methods-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2021 Pronia Made With ❤️ By Data</p>
      </div>
    </footer>
  );
}

export default Footer;