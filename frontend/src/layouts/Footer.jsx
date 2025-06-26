import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faPinterest, faDribbble } from '@fortawesome/free-brands-svg-icons';
import PaymentMethods from '../assets/images/payment-methods.png';
import Logo from '../assets/images/pronia-image.png';
import { useTranslation } from 'react-i18next';
const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column brand-column">
          <div className="logo">
            <img
              src={Logo}
              alt="Pronia Logo"
            />
          </div>
          <p className="brand-description">{t('footer.brandDescription')}</p>
          <div className="social-icons">
            <a
              onClick={scrollToTop}
              className="social-icon"
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              onClick={scrollToTop}
              className="social-icon"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              onClick={scrollToTop}
              className="social-icon"
              aria-label="Pinterest"
            >
              <FontAwesomeIcon icon={faPinterest} />
            </a>
            <a
              onClick={scrollToTop}
              className="social-icon"
              aria-label="Dribbble"
            >
              <FontAwesomeIcon icon={faDribbble} />
            </a>
          </div>
        </div>

        <div className="footer-column links-column">
          <h3>{t('footer.usefulLinks.title')}</h3>
          <ul>
            <li>
              <a onClick={scrollToTop}>{t('footer.usefulLinks.aboutPronia')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.usefulLinks.howToShop')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.usefulLinks.faq')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.usefulLinks.contactUs')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.usefulLinks.logIn')}</a>
            </li>
          </ul>
        </div>

        <div className="footer-column account-column">
          <h3>{t('footer.myAccount.title')}</h3>
          <ul>
            <li>
              <a onClick={scrollToTop}>{t('footer.myAccount.signIn')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.myAccount.viewCart')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.myAccount.wishlist')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.myAccount.trackOrder')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.myAccount.help')}</a>
            </li>
          </ul>
        </div>

        <div className="footer-column service-column">
          <h3>{t('footer.ourService.title')}</h3>
          <ul>
            <li>
              <a onClick={scrollToTop}>{t('footer.ourService.paymentMethods')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.ourService.moneyGuarantee')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.ourService.returns')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.ourService.shipping')}</a>
            </li>
            <li>
              <a onClick={scrollToTop}>{t('footer.ourService.privacyPolicy')}</a>
            </li>
          </ul>
        </div>

        <div className="footer-column contact-column">
          <h3>{t('footer.contact.title')}</h3>
          <div className="contact-info">
            <div className="phone-number">
              <h5>{t('footer.contact.phoneNumber')}</h5>
            </div>
            <div className="address-section">
              <p>{t('footer.contact.address')}</p>
              <div className="payment-cards">
                <img
                  src={PaymentMethods}
                  alt={t('footer.contact.paymentMethodsAlt')}
                  className="payment-methods-img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
