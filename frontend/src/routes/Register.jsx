import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterInputs({
      ...registerInputs,
      [name]: value,
    });

    // Only clear errors after first submit attempt
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

    // Additional validation for password confirmation match
    if (
      registerInputs.password &&
      registerInputs.confirmPassword &&
      registerInputs.password !== registerInputs.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setRegisterErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Mark that submit has been attempted
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
        });

        console.log('Auto login response:', loginResponse);

        setUserData(loginResponse.data);
        setLoggedIn(true);

        setRegisterInputs({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        navigate('/profile');
      } catch (loginError) {
        console.error('Auto-login after registration failed:', loginError);
        setRegisterErrors({
          ...registerErrors,
          form:
            loginError.message ||
            'Registration successful but login failed. Please try logging in manually.',
        });

        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      console.error('Registration failed:', error);

      const errorMessage = error.message || 'Registration failed. Please try again.';
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
    document.title = 'Register - Pronia';
  }, []);

  return (
    <div>
      <RouteBanner title="registerpage" />
      <div className="auth-container">
        <div className="auth-forms-wrapper">
          <div className="auth-form register-form">
            <h2>Register</h2>
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
