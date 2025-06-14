import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
import { validateEmail, validatePassword } from '../utils/validations';
import { loginUser } from '../api/api';
import { useUserData } from '../context/UserContext';

export default function Login() {
  const { useFakeLoader } = useLoader();
  const navigate = useNavigate();
  const { setLoggedIn, setUserData } = useUserData();
  const handleNavigation = (path) => {
    navigate(path);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const [loginInputs, setLoginInputs] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginInputs({
      ...loginInputs,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Only clear errors after first submit attempt (like in Register)
    if (hasAttemptedSubmit && errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(loginInputs.email) || '',
      password: validatePassword(loginInputs.password) || '',
      form: '',
    };

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Mark that submit has been attempted (like in Register)
    setHasAttemptedSubmit(true);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        email: loginInputs.email,
        password: loginInputs.password,
      };

      const response = await loginUser(data);
      console.log('Login successful:', response);

      setUserData(response.data);
      setLoggedIn(true);

      setLoginInputs({
        email: '',
        password: '',
        rememberMe: false,
      });

      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        ...errors,
        form: error.message || 'Login failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    useFakeLoader();
    document.title = 'Login - Pronia';
  }, []);

  return (
    <div>
      <RouteBanner title="login" />
      <div className="auth-container">
        <div className="auth-form login-form">
          <h2>Login</h2>

          {errors.form && (
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
              {errors.form}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            noValidate
          >
            <div className="form-group">
              <label htmlFor="email">
                Email Address<span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                value={loginInputs.email}
                onChange={handleLoginChange}
                required
              />
              {hasAttemptedSubmit && errors.email && (
                <div
                  className="field-error"
                  style={{
                    color: '#e74c3c',
                    fontSize: '12px',
                    fontWeight: '500',
                    marginTop: '4px',
                  }}
                >
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password<span className="required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={loginInputs.password}
                onChange={handleLoginChange}
                required
              />
              {hasAttemptedSubmit && errors.password && (
                <div
                  className="field-error"
                  style={{
                    color: '#e74c3c',
                    fontSize: '12px',
                    fontWeight: '500',
                    marginTop: '4px',
                  }}
                >
                  {errors.password}
                </div>
              )}
            </div>

            <div className="form-group checkbox-group">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={loginInputs.rememberMe}
                  onChange={handleLoginChange}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>

              <div className="forgot-password">
                <a onClick={() => handleNavigation('/forgot-password')}>Forgotten password?</a>
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
