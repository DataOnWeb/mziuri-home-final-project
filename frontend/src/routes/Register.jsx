import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
import { validateEmail, validatePassword } from '../utils/validations';
import { registerUser, loginUser } from '../api/api';
import { useUserData } from '../context/UserContext';

function Register() {
  const navigate = useNavigate();
  const { setLoggedIn, setUserData } = useUserData();

  const [registerInputs, setRegisterInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterInputs({
      ...registerInputs,
      [name]: value,
    });

    if (registerErrors[name]) {
      setRegisterErrors({
        ...registerErrors,
        [name]: '',
      });
    }
  };

  const validateRegisterForm = () => {
    const newErrors = {
      firstName: !registerInputs.firstName ? 'First name is required' : '',
      lastName: !registerInputs.lastName ? 'Last name is required' : '',
      email: validateEmail(registerInputs.email) || '',
      password: validatePassword(registerInputs.password) || '',
      confirmPassword: '',
      form: '',
    };

    if (registerInputs.password !== registerInputs.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setRegisterErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

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

      // Register the user
      const registerResponse = await registerUser(userData);
      console.log('Registration successful:', registerResponse);

      if (registerResponse.err) {
        throw new Error(registerResponse.err);
      }

      // Automatically log in the user after successful registration
      try {
        const loginResponse = await loginUser({
          email: userData.email,
          password: userData.password,
        });

        if (loginResponse.err) {
          throw new Error(loginResponse.err);
        }

        // Update user context with login data
        setUserData(loginResponse.data);
        setLoggedIn(true);

        // Reset form after successful registration
        setRegisterInputs({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        // Redirect to profile page
        navigate('/');
      } catch (loginError) {
        console.error('Auto-login after registration failed:', loginError);
        setRegisterErrors({
          ...registerErrors,
          form:
            loginError.message ||
            'Registration successful but login failed. Please try logging in manually.',
        });
        // Redirect to login page if auto-login fails
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setRegisterErrors({
        ...registerErrors,
        form: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  const { useFakeLoader } = useLoader();

  useEffect(() => {
    useFakeLoader();
    document.title = 'Register - Pronia';
  }, []);

  return (
    <div>
      <RouteBanner title="Login & Register Page" />
      <div className="auth-container">
        <div className="auth-forms-wrapper">
          <div className="auth-form register-form">
            <h2>Register</h2>
            {registerErrors.form && <div className="error-message">{registerErrors.form}</div>}
            <form onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    First Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={registerInputs.firstName}
                    onChange={handleRegisterChange}
                    required
                  />
                  {registerErrors.firstName && (
                    <div className="field-error">{registerErrors.firstName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    Last Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={registerInputs.lastName}
                    onChange={handleRegisterChange}
                    required
                  />
                  {registerErrors.lastName && (
                    <div className="field-error">{registerErrors.lastName}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="registerEmail">
                  Email Address<span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="registerEmail"
                  name="email"
                  placeholder="Email Address"
                  value={registerInputs.email}
                  onChange={handleRegisterChange}
                  required
                />
                {registerErrors.email && <div className="field-error">{registerErrors.email}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="registerPassword">
                    Password<span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="registerPassword"
                    name="password"
                    placeholder="Password"
                    value={registerInputs.password}
                    onChange={handleRegisterChange}
                    required
                  />
                  {registerErrors.password && (
                    <div className="field-error">{registerErrors.password}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password<span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={registerInputs.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                  />
                  {registerErrors.confirmPassword && (
                    <div className="field-error">{registerErrors.confirmPassword}</div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmittingRegister}
              >
                {isSubmittingRegister ? 'REGISTERING...' : 'REGISTER'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
