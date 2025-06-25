import React, { useEffect, useState, useCallback } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { LuMapPin } from 'react-icons/lu';
import { FiPhone } from 'react-icons/fi';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
import { useTranslation } from 'react-i18next';
import { validateFullName, validateEmail } from '../utils/validations';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();
  const { useFakeLoader } = useLoader();

  useEffect(() => {
    useFakeLoader();
    document.title = t('contact.pageTitle');
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};

    const firstNameError = validateFullName(formData.firstName);
    if (!formData.firstName) {
      newErrors.firstName = t('contact.validation.firstNameRequired');
    } else if (firstNameError) {
      newErrors.firstName = firstNameError;
    }

    const lastNameError = validateFullName(formData.lastName);
    if (!formData.lastName) {
      newErrors.lastName = t('contact.validation.lastNameRequired');
    } else if (lastNameError) {
      newErrors.lastName = lastNameError;
    }

    if (!formData.phone) {
      newErrors.phone = t('contact.validation.phoneRequired');
    } else if (formData.phone.length < 9) {
      newErrors.phone = t('contact.validation.phoneInvalid');
    }

    const emailError = validateEmail(formData.email);
    if (!formData.email) {
      newErrors.email = t('contact.validation.emailRequired');
    } else if (emailError) {
      newErrors.email = emailError;
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.validation.messageRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      console.log('Form submitted:', formData);

      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        message: '',
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

    } catch (error) {
      console.error('Submission error:', error);
      alert(t('contact.form.errorMessage'));
    }
  }, [formData, t]);

  return (
    <div>
      <RouteBanner title="contactPage" />
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-info">
            <div
              className="bg-overlay"
              style={{ backgroundImage: "url('../assets/images/leaves.jpg')" }}
            ></div>

            <h2 className="contact-title">{t('contact.info.title')}</h2>
            <p className="contact-description">
              {t('contact.info.description')}
            </p>

            <div className="contact-method">
              <div className="icon-wrapper"><FiPhone size={25} /></div>
              <span>{t('contact.info.phone')}</span>
            </div>

            <div className="contact-method">
              <div className="icon-wrapper"><MdOutlineMail size={25} /></div>
              <span>{t('contact.info.email')}</span>
            </div>

            <div className="contact-method">
              <div className="icon-wrapper"><LuMapPin size={25} /></div>
              <span>{t('contact.info.address')}</span>
            </div>
          </div>

          <div className="contact-form">
            {showSuccess && (
              <div className="success-message" style={{
                backgroundColor: '#d4edda',
                color: '#a4ce6a',
                padding: '12px 16px',
                borderRadius: '4px',
                border: '1px solid #c3e6cb',
                marginBottom: '20px',
                fontWeight: '500'
              }}>
                {t('contact.form.successMessage')}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">{t('contact.form.firstName')}</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                    required
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">{t('contact.form.lastName')}</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                    required
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t('contact.form.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    required
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('contact.form.email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    required
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">{t('contact.form.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'error' : ''}
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <div className="text-right mt-4">
                <button type="submit" className="submit-btn">
                  {t('contact.form.submitButton')}
                </button>
              </div>
            </form>
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
          title={t('contact.map.title')}
        ></iframe>
      </div>
    </div>
  );
}
