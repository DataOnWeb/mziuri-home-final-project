import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { userData, setUserData, isLoggedIn, logout } = useUserData();

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

  // Helper function to split username into first and last name
  const splitUsername = (username) => {
    if (!username) return { firstName: '', lastName: '' };

    const parts = username.trim().split(' ');
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: '' };
    }

    // Take first part as firstName, join the rest as lastName
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    return { firstName, lastName };
  };

  useEffect(() => {
    if (userData) {
      // Handle the case where we have username instead of separate firstName/lastName
      let firstName = userData.firstName || '';
      let lastName = userData.lastName || '';

      // If we don't have separate first/last names but have username, split it
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

    // Password validation - only validate if user is trying to change password
    if (
      profileInputs.newPassword ||
      profileInputs.confirmNewPassword ||
      profileInputs.currentPassword
    ) {
      if (!profileInputs.currentPassword.trim()) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      if (!profileInputs.newPassword.trim()) {
        newErrors.newPassword = 'New password is required';
      } else {
        const passwordError = validatePassword(profileInputs.newPassword);
        if (passwordError) {
          newErrors.newPassword = passwordError;
        }
      }
      if (!profileInputs.confirmNewPassword.trim()) {
        newErrors.confirmNewPassword = 'Please confirm your new password';
      } else if (profileInputs.newPassword !== profileInputs.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Passwords do not match';
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
    setErrors({}); // Clear previous errors

    try {
      const updateData = {
        // Combine first and last name back to username for backend
        username: `${profileInputs.firstName.trim()} ${profileInputs.lastName.trim()}`.trim(),
        email: profileInputs.email,
      };

      // Only include password fields if user is trying to change password
      const isChangingPassword = profileInputs.newPassword && profileInputs.currentPassword;
      if (isChangingPassword) {
        updateData.currentPassword = profileInputs.currentPassword;
        updateData.newPassword = profileInputs.newPassword;
      }

      console.log('Sending update data:', updateData); // Debug log
      console.log('Is changing password:', isChangingPassword); // Debug log

      const response = await updateUserProfile(updateData);
      console.log('Update response:', response); // Debug log

      // Check if response is valid
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      // Update user data in context
      const updatedUserData = {
        ...userData,
        username: updateData.username,
        email: updateData.email,
        // Keep firstName and lastName for display purposes
        firstName: profileInputs.firstName,
        lastName: profileInputs.lastName,
      };

      setUserData(updatedUserData);

      // Clear password fields after successful update
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
          ? 'Profile and password updated successfully!'
          : 'Profile updated successfully!'
      );
      setHasAttemptedSubmit(false);
      setErrors({}); // Clear any previous errors
    } catch (error) {
      console.error('Profile update error:', error); // Debug log
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      setErrors((prev) => ({
        ...prev,
        form: error.message || 'Failed to update profile. Please try again.',
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
    document.title = 'My Account - Pronia';
  }, []);

  if (!isLoggedIn || !userData) return null;

  return (
    <div>
      <RouteBanner title="profile" />
      <div className="profile-container">
        <div className="profile-wrapper">
          <div className="profile-sidebar">
            <div className="profile-nav">
              <button
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                DASHBOARD
              </button>
              <button
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                ORDERS
              </button>
              <button
                className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                ADDRESSES
              </button>
              <button
                className={`nav-item ${activeTab === 'account-details' ? 'active' : ''}`}
                onClick={() => setActiveTab('account-details')}
              >
                ACCOUNT DETAILS
              </button>
              <button
                className="nav-item logout-btn"
                onClick={handleLogout}
              >
                LOGOUT
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
                      <label htmlFor="firstName">First Name*</label>
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
                      <label htmlFor="lastName">Last Name*</label>
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
                    <label htmlFor="email">Email*</label>
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
                    <h4>Change Password (Leave blank to keep current password)</h4>
                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={profileInputs.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter current password to change"
                      />
                      {hasAttemptedSubmit && errors.currentPassword && (
                        <div className="field-error">{errors.currentPassword}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={profileInputs.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                      />
                      {hasAttemptedSubmit && errors.newPassword && (
                        <div className="field-error">{errors.newPassword}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmNewPassword">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={profileInputs.confirmNewPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
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
                    {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="dashboard-section">
                <h3>Dashboard</h3>
                <p>Welcome back, {profileInputs.firstName || userData.username}!</p>
                <p>Manage your account details, orders and more here.</p>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h3>Orders</h3>
                <p>No orders yet.</p>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="addresses-section">
                <p>The following addresses will be used on the checkout page by default.</p>
                <h3>BILLING ADDRESS</h3>
                <h4>1234 Heaven Stress, Beverly Hill OldYork UnitedState of Lorem</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
