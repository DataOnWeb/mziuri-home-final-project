import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { validateConfirmPassword, validatePassword } from '../utils/validations.js';
import * as api from '../api/api.js';
import { useLoader } from '../hooks/useLoader';
function ResetPassword() {
  const [state, setState] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate()
const handleNavigation = (path) => {
    navigate(path);
  };
  const { token } = useParams();

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const response = await api.resetPasswordUser(state, token);

      if (response.data) {
        // alert('Password reset successfully');
        // navigate('/login');
      }
    } catch (err) {
      throw err;
    }
  };

  const validate = () => {
    const errors = {};

    const passwordError = validatePassword(state.password);
    const confirmPasswordError = validateConfirmPassword(
      state.password,
      state.confirmPassword
    );

    if (passwordError) errors.password = passwordError;
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    return errors;
  };
  const { useFakeLoader } = useLoader();
    useEffect(() => {
    useFakeLoader();
    document.title = 'Reset Your Password - Pronia';
  }, []);
  return (
    <div className="resetPassword">
      <div className="formContainer">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="titlesContainer">
            <h1 className="title">Reset Your Password</h1>
            {/* <h3 className="subtitle">Sign in to continue your journey</h3> */}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                className="input"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={state.password || ''}
                onChange={handleChange}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
              </button>
            </div>
            {errorMessages.password && (
              <div className="error-message">{errorMessages.password}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                className="input"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={state.confirmPassword || ''}
                onChange={handleChange}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >

              </button>
            </div>
            {errorMessages.confirmPassword && (
              <div className="error-message">{errorMessages.confirmPassword}</div>
            )}
          </div>
          
          <button type="submit" className='reset_btn' onClick={() => handleNavigation('/login')}>Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;