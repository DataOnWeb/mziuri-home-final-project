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

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginInputs({
      ...loginInputs,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear error for the field being changed
    if (errors[name]) {
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

      // Update user context with login data
      setUserData(response.user);
      setLoggedIn(true);

      // Reset form after successful login
      setLoginInputs({
        email: '',
        password: '',
        rememberMe: false,
      });

      // Redirect to profile page
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        ...errors,
        form: error.response?.data?.message || 'Login failed. Please try again.',
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
      <RouteBanner title="Login" />
      <div className="auth-container">
        <div className="auth-form login-form">
          <h2>Login</h2>
          {errors.form && <div className="error-message">{errors.form}</div>}
          <form onSubmit={handleLogin}>
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
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={loginInputs.password}
                onChange={handleLoginChange}
                required
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
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
                <a onClick={scrollToTop}>Forgotten password?</a>
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
