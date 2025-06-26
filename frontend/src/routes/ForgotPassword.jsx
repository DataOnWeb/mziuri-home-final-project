import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/validations';
import * as api from '../api/api.js';
import { useLoader } from '../hooks/useLoader';
import { useTranslation } from 'react-i18next';
function ForgotPassword() {
  const [state, setState] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const { t } = useTranslation();
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
      const response = await api.forgotPasswordUser(state);

      if (response.data) {
        alert('email has sent');
      }
    } catch (err) {
      throw err;
    }
  };

  const validate = () => {
    const errors = {};

    const emailError = validateEmail(state.email);

    if (emailError) errors.email = emailError;

    return errors;
  };
  const { useFakeLoader } = useLoader();
  useEffect(() => {
    useFakeLoader();
    document.title = 'Restore Your Password - Pronia';
  }, []);
  return (
    <div className="forgotPassword">
      <div className="formContainer">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="titlesContainer">
            <h1 className="title">{t('doNotWorry')}</h1>
            <h4 className="subtitle">{t('link')}</h4>
          </div>
          <div className="form-group">
            <label htmlFor="email">{t('register.email')}</label>
            <input
              type="text"
              className="input"
              name="email"
              id="email"
              value={state.email || ''}
              placeholder={t('example')}
              onChange={handleChange}
            />
            {errorMessages.email && <div className="error-message">{errorMessages.email}</div>}
          </div>
          <button
            type="submit"
            className="forgot_btn"
          >
            {t('send')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
