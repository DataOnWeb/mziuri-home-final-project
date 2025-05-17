import React, { useEffect, useState, useCallback } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { LuMapPin } from 'react-icons/lu';
import { FiPhone } from 'react-icons/fi';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
        alert('Please fill in all required fields');
        return;
      }

      try {
        console.log('Form submitted:', formData);
        alert('Form submitted successfully! We will get back to you within 24 hours.');

        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          message: '',
        });
      } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to submit form. Please try again.');
      }
    },
    [formData]
  );

  const { useFakeLoader } = useLoader();
  useEffect(() => {
    useFakeLoader();
    document.title = 'Contact Us - Pronia';
  }, []);

  return (
    <div>
      <RouteBanner title="Contact Us" />
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-info">
            <div
              className="bg-overlay"
              style={{ backgroundImage: "url('../assets/images/leaves.jpg')" }}
            ></div>

            <h2 className="contact-title">Contact Info:</h2>
            <p className="contact-description">
              Fill the form and our team will get to back to you within 24 hours.
            </p>

            <div className="contact-method">
              <div className="icon-wrapper">
                <FiPhone size={25} />
              </div>
              <span>123 456 789</span>
            </div>

            <div className="contact-method">
              <div className="icon-wrapper">
                <MdOutlineMail size={25} />
              </div>
              <span>info@example.com</span>
            </div>

            <div className="contact-method">
              <div className="icon-wrapper">
                <LuMapPin size={25} />
              </div>
              <span>13, Your Address, Here</span>
            </div>
          </div>

          <div className="contact-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name*</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone*</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="text-right mt-4">
              <button
                onClick={handleSubmit}
                className="submit-btn"
              >
                POST COMMENT
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="map-section">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596552044!2d-74.25986652425023!3d40.69714941680757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1620796556183!5m2!1sen!2s"
          width="100%"
          height="520px"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Google Maps"
        ></iframe>
      </div>
    </div>
  );
}
