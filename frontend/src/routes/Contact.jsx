import React, { useEffect, useState } from 'react';
import RouteBanner from '../components/RouteBanner';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle form submission
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };
  useEffect(() => {
    document.title = 'Contact Us - Pronia';
  }, []);

  return (
    <div>
      <RouteBanner title="Contact Us" />
         <div className="container">
        <div className="contact-container">
          <div className="contact-wrapper">
            {/* Contact Info Sidebar */}
            <div className="contact-sidebar">
              <h2 className="sidebar-title">Contact Info:</h2>
              <p className="sidebar-desc">Fill the form and our team will get to back to you within 24 hours.</p>
              
              <div className="contact-info">
                <div className="contact-info-item">
                  <div className="contact-icon phone-icon"></div>
                  <span className="contact-text">123 456 789</span>
                </div>
                
                <div className="contact-info-item">
                  <div className="contact-icon email-icon"></div>
                  <span className="contact-text">info@example.com</span>
                </div>
                
                <div className="contact-info-item">
                  <div className="contact-icon address-icon"></div>
                  <span className="contact-text">13, Your Address, Here</span>
                </div>
              </div>
              
              <div className="sidebar-decoration"></div>
            </div>
            
            {/* Contact Form */}
            <div className="contact-form-container">
              <div className="contact-form">
                <div className="form-group-row">
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="firstName" 
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name*" 
                      className="form-input" 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="lastName" 
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name*" 
                      className="form-input" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group-row">
                  <div className="form-group">
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone*" 
                      className="form-input" 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email*" 
                      className="form-input" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <textarea 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message" 
                    className="form-textarea"
                    rows="6"
                  ></textarea>
                </div>
                
                <div className="form-submit">
                  <button 
                    type="button" 
                    className="submit-button"
                    onClick={handleSubmit}
                  >
                    POST COMMENT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section - Positioned below the form as requested */}
      {/* <div className="map-section">
        <div className="map-container">
          <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304903!3d40.69766374873451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1620664903050!5m2!1sen!2s" 
          allowFullScreen="" 
          loading="lazy"
          title="Google Map of New York"
        ></iframe>
        
        <div className="map-info">
          <div className="location-title">New York</div>
          <div className="location-address">New York, USA</div>
          <a href="#" className="directions-link">Directions</a>
        </div>
        
        <div className="map-controls">
          <button className="zoom-in">+</button>
          <button className="zoom-out">-</button>
        </div>
        </div>
      </div> */}
    </div>
  );
}




 