import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
import { useUserData } from '../context/UserContext';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validations';
import { updateUserProfile } from '../api/api';

export default function Profile() {
  const { useFakeLoader } = useLoader();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userData, setUserData, isLoggedIn, logout } = useUserData();
  const [orders, setOrders] = useState([]);

  const [activeTab, setActiveTab] = useState('account-details');
  const [profileInputs, setProfileInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  const splitUsername = (username) => {
    if (!username) return { firstName: '', lastName: '' };
    
    const parts = username.trim().split(' ');
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: '' };
    }

    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    return { firstName, lastName };
    
  };

  useEffect(() => {
    if (userData) {
      let firstName = userData.firstName || '';
      let lastName = userData.lastName || '';

      if (!firstName && !lastName && userData.username) {
        const splitNames = splitUsername(userData.username);
        firstName = splitNames.firstName;
        lastName = splitNames.lastName;
      }

      setProfileInputs((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: userData.email || '',
      }));
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileInputs((prev) => ({ ...prev, [name]: value }));
    if (hasAttemptedSubmit) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (successMessage) setSuccessMessage('');
  };

  const validateForm = () => {
    const newErrors = {
      firstName: validateFullName(profileInputs.firstName) || '',
      lastName: validateFullName(profileInputs.lastName) || '',
      email: validateEmail(profileInputs.email) || '',
    };

    if (
      profileInputs.newPassword ||
      profileInputs.confirmNewPassword ||
      profileInputs.currentPassword
    ) {
      if (!profileInputs.currentPassword.trim()) {
        newErrors.currentPassword = t('profile.accountDetails.errors.currentPasswordRequired');
      }
      if (!profileInputs.newPassword.trim()) {
        newErrors.newPassword = t('profile.accountDetails.errors.newPasswordRequired');
      } else {
        const passwordError = validatePassword(profileInputs.newPassword);
        if (passwordError) {
          newErrors.newPassword = passwordError;
        }
      }
      if (!profileInputs.confirmNewPassword.trim()) {
        newErrors.confirmNewPassword = t('profile.accountDetails.errors.confirmPasswordRequired');
      } else if (profileInputs.newPassword !== profileInputs.confirmNewPassword) {
        newErrors.confirmNewPassword = t('profile.accountDetails.errors.passwordsDoNotMatch');
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((val) => !val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const updateData = {
        username: `${profileInputs.firstName.trim()} ${profileInputs.lastName.trim()}`.trim(),
        email: profileInputs.email,
      };

      const isChangingPassword = profileInputs.newPassword && profileInputs.currentPassword;
      if (isChangingPassword) {
        updateData.currentPassword = profileInputs.currentPassword;
        updateData.newPassword = profileInputs.newPassword;
      }

      const response = await updateUserProfile(updateData);

      if (!response || !response.data) {
        throw new Error(t('profile.accountDetails.errors.invalidResponse'));
      }

      const updatedUserData = {
        ...userData,
        username: updateData.username,
        email: updateData.email,

        firstName: profileInputs.firstName,
        lastName: profileInputs.lastName,
      };

      setUserData(updatedUserData);

      if (isChangingPassword) {
        setProfileInputs((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }));
      }

      setSuccessMessage(
        isChangingPassword
          ? t('profile.accountDetails.successMessages.profileAndPasswordUpdated')
          : t('profile.accountDetails.successMessages.profileUpdated')
      );
      setHasAttemptedSubmit(false);
      setErrors({});
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      setErrors((prev) => ({
        ...prev,
        form: error.message || t('profile.accountDetails.errors.updateFailed'),
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    useFakeLoader();
    document.title = t('profile.pageTitle');
  }, [t]);

  if (!isLoggedIn || !userData) return null;

  return (
    <div>
      <RouteBanner title={t('profile1')} />
      <div className="profile-container">
        <div className="profile-wrapper">
          <div className="profile-sidebar">
            <div className="profile-nav">
              <button
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                {t('profile.navigation.dashboard')}
              </button>
              <button
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                {t('profile.navigation.orders')}
              </button>
              <button
                className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                {t('profile.navigation.addresses')}
              </button>
              <button
                className={`nav-item ${activeTab === 'account-details' ? 'active' : ''}`}
                onClick={() => setActiveTab('account-details')}
              >
                {t('profile.navigation.accountDetails')}
              </button>
              <button
                className="nav-item logout-btn"
                onClick={handleLogout}
              >
                {t('profile.navigation.logout')}
              </button>
            </div>
          </div>

          <div className="profile-content">
            {activeTab === 'account-details' && (
              <div className="account-details-section">
                {errors.form && <div className="error-message">{errors.form}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <form
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">
                        {t('profile.accountDetails.firstName')}
                        {t('profile.accountDetails.required')}
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileInputs.firstName}
                        onChange={handleInputChange}
                        required
                      />
                      {hasAttemptedSubmit && errors.firstName && (
                        <div className="field-error">{errors.firstName}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">
                        {t('profile.accountDetails.lastName')}
                        {t('profile.accountDetails.required')}
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileInputs.lastName}
                        onChange={handleInputChange}
                        required
                      />
                      {hasAttemptedSubmit && errors.lastName && (
                        <div className="field-error">{errors.lastName}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">
                      {t('profile.accountDetails.email')}
                      {t('profile.accountDetails.required')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileInputs.email}
                      onChange={handleInputChange}
                      required
                    />
                    {hasAttemptedSubmit && errors.email && (
                      <div className="field-error">{errors.email}</div>
                    )}
                  </div>

                  <div className="password-section">
                    <h4>{t('profile.accountDetails.passwordSection.title')}</h4>
                    <div className="form-group">
                      <label htmlFor="currentPassword">
                        {t('profile.accountDetails.currentPassword')}
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={profileInputs.currentPassword}
                        onChange={handleInputChange}
                        placeholder={t(
                          'profile.accountDetails.passwordSection.currentPasswordPlaceholder'
                        )}
                      />
                      {hasAttemptedSubmit && errors.currentPassword && (
                        <div className="field-error">{errors.currentPassword}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="newPassword">{t('profile.accountDetails.newPassword')}</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={profileInputs.newPassword}
                        onChange={handleInputChange}
                        placeholder={t(
                          'profile.accountDetails.passwordSection.newPasswordPlaceholder'
                        )}
                      />
                      {hasAttemptedSubmit && errors.newPassword && (
                        <div className="field-error">{errors.newPassword}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmNewPassword">
                        {t('profile.accountDetails.confirmNewPassword')}
                      </label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={profileInputs.confirmNewPassword}
                        onChange={handleInputChange}
                        placeholder={t(
                          'profile.accountDetails.passwordSection.confirmPasswordPlaceholder'
                        )}
                      />
                      {hasAttemptedSubmit && errors.confirmNewPassword && (
                        <div className="field-error">{errors.confirmNewPassword}</div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t('profile.accountDetails.submittingButton')
                      : t('profile.accountDetails.submitButton')}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="dashboard-section">
                <h3>{t('profile.dashboard.title')}</h3>
                <p>
                  {t('profile.dashboard.welcome', {
                    name: profileInputs.firstName || userData.username,
                  })}
                </p>
                <p>{t('profile.dashboard.description')}</p>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h3>{t('profile.orders.title')}</h3>
                <p>{t('profile.orders.noOrders')}</p>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="addresses-section">
                <p>{t('profile.addresses.description')}</p>
                <h3>{t('profile.addresses.title')}</h3>
                <h4>{t('profile.addresses.sampleAddress')}</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
