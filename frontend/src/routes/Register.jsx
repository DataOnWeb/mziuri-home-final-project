import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validations';
import { registerUser, loginUser } from '../api/api';
import { useUserData } from '../context/UserContext';

function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setLoggedIn, setUserData, setRememberMe } = useUserData();

  const [registerInputs, setRegisterInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  const [registerErrors, setRegisterErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    form: '',
  });

  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterInputs({
      ...registerInputs,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (hasAttemptedSubmit && registerErrors[name]) {
      setRegisterErrors({
        ...registerErrors,
        [name]: '',
      });
    }
  };

  const validateRegisterForm = () => {
    const newErrors = {
      firstName: validateFullName(registerInputs.firstName) || '',
      lastName: validateFullName(registerInputs.lastName) || '',
      email: validateEmail(registerInputs.email) || '',
      password: validatePassword(registerInputs.password) || '',
      confirmPassword: validateConfirmPassword(registerInputs.confirmPassword) || '',
      form: '',
    };

    if (
      registerInputs.password &&
      registerInputs.confirmPassword &&
      registerInputs.password !== registerInputs.confirmPassword
    ) {
      newErrors.confirmPassword = t('register.errors.passwordsDoNotMatch');
    }

    setRegisterErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!validateRegisterForm()) {
      return;
    }

    setIsSubmittingRegister(true);
    try {
      const userData = {
        firstName: registerInputs.firstName,
        lastName: registerInputs.lastName,
        email: registerInputs.email,
        password: registerInputs.password,
      };

      const registerResponse = await registerUser(userData);
      console.log('Registration successful:', registerResponse);

      try {
        const loginResponse = await loginUser({
          email: userData.email,
          password: userData.password,
          rememberMe: registerInputs.rememberMe,
        });

        console.log('Auto login response:', loginResponse);

        setUserData(loginResponse.data);
        setLoggedIn(true);
        setRememberMe(registerInputs.rememberMe, { email: userData.email });

        setRegisterInputs({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          rememberMe: false,
        });

        navigate('/profile');
      } catch (loginError) {
        console.error('Auto-login after registration failed:', loginError);

        if (registerResponse.data) {
          setUserData(registerResponse.data);
          setLoggedIn(true);
          setRememberMe(registerInputs.rememberMe, { email: userData.email });
          navigate('/profile');
        } else {
          setRegisterErrors({
            ...registerErrors,
            form: loginError.message || t('register.errors.autoLoginFailed'),
          });

          setTimeout(() => navigate('/login'), 3000);
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);

      const errorMessage = error.message || t('register.errors.registrationFailed');
      setRegisterErrors({
        ...registerErrors,
        form: errorMessage,
      });
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  const { useFakeLoader } = useLoader();

  useEffect(() => {
    useFakeLoader();
    document.title = t('register.pageTitle');
  }, [t]);

  return (
    <div>
      <RouteBanner title={t('register.title')} />
      <div className="auth-container">
        <div className="auth-forms-wrapper">
          <div className="auth-form register-form">
            <h2>{t('register.title')}</h2>
            {registerErrors.form && (
              <div
                className="error-message"
                style={{
                  color: '#e74c3c',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: '#ffeaea',
                  border: '1px solid #e74c3c',
                  borderRadius: '4px',
                  padding: '10px',
                  marginBottom: '15px',
                  textAlign: 'center',
                }}
              >
                {registerErrors.form}
              </div>
            )}
            <form
              onSubmit={handleRegister}
              noValidate
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    {t('register.firstName')}
                    <span className="required">{t('register.required')}</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder={t('register.placeholders.firstName')}
                    value={registerInputs.firstName}
                    onChange={handleRegisterChange}
                    required
                  />
                  {hasAttemptedSubmit && registerErrors.firstName && (
                    <div
                      className="field-error"
                      style={{
                        color: '#e74c3c',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginTop: '4px',
                      }}
                    >
                      {registerErrors.firstName}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    {t('register.lastName')}
                    <span className="required">{t('register.required')}</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder={t('register.placeholders.lastName')}
                    value={registerInputs.lastName}
                    onChange={handleRegisterChange}
                    required
                  />
                  {hasAttemptedSubmit && registerErrors.lastName && (
                    <div
                      className="field-error"
                      style={{
                        color: '#e74c3c',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginTop: '4px',
                      }}
                    >
                      {registerErrors.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="registerEmail">
                  {t('register.email')}
                  <span className="required">{t('register.required')}</span>
                </label>
                <input
                  type="email"
                  id="registerEmail"
                  name="email"
                  placeholder={t('register.placeholders.email')}
                  value={registerInputs.email}
                  onChange={handleRegisterChange}
                  required
                />
                {hasAttemptedSubmit && registerErrors.email && (
                  <div
                    className="field-error"
                    style={{
                      color: '#e74c3c',
                      fontSize: '12px',
                      fontWeight: '500',
                      marginTop: '4px',
                    }}
                  >
                    {registerErrors.email}
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="registerPassword">
                    {t('register.password')}
                    <span className="required">{t('register.required')}</span>
                  </label>
                  <input
                    type="password"
                    id="registerPassword"
                    name="password"
                    placeholder={t('register.placeholders.password')}
                    value={registerInputs.password}
                    onChange={handleRegisterChange}
                    required
                  />
                  {hasAttemptedSubmit && registerErrors.password && (
                    <div
                      className="field-error"
                      style={{
                        color: '#e74c3c',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginTop: '4px',
                      }}
                    >
                      {registerErrors.password}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    {t('register.confirmPassword')}
                    <span className="required">{t('register.required')}</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder={t('register.placeholders.confirmPassword')}
                    value={registerInputs.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                  />
                  {hasAttemptedSubmit && registerErrors.confirmPassword && (
                    <div
                      className="field-error"
                      style={{
                        color: '#e74c3c',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginTop: '4px',
                      }}
                    >
                      {registerErrors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Remember Me checkbox to registration */}
              <div className="form-group checkbox-group">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="registerRememberMe"
                    name="rememberMe"
                    checked={registerInputs.rememberMe}
                    onChange={handleRegisterChange}
                  />
                  <label htmlFor="registerRememberMe">{t('register.rememberMe')}</label>
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmittingRegister}
              >
                {isSubmittingRegister ? t('register.submittingButton') : t('register.submitButton')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
