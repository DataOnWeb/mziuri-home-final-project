import { useEffect, useState } from 'react';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
export default function Register() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const [loginInputs, setLoginInputs] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [registerInputs, setRegisterInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginInputs({
      ...loginInputs,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterInputs({
      ...registerInputs,
      [name]: value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login data:', loginInputs);
    

    setLoginInputs({
      email: '',
      password: '',
      rememberMe: false
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Register data:', registerInputs);
    

    setRegisterInputs({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };
  const { useFakeLoader } = useLoader();
  

  useEffect(() => {
    useFakeLoader();
    document.title = "Register - Pronia";
  }, []);
  
  return (
    <div>
      <RouteBanner title="Login & Register Page" />
      <div className="auth-container">
      <div className="auth-forms-wrapper">
        <div className="auth-form login-form">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address<span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                value={loginInputs.email}
                onChange={handleLoginChange}
                required
              />
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
            
            <button type="submit" className="btn-submit" onClick={scrollToTop}>LOGIN</button>
          </form>
        </div>
        
        <div className="auth-form register-form">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={registerInputs.firstName}
                  onChange={handleRegisterChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={registerInputs.lastName}
                  onChange={handleRegisterChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="registerEmail">Email Address<span className="required">*</span></label>
              <input
                type="email"
                id="registerEmail"
                name="email"
                placeholder="Email Address"
                value={registerInputs.email}
                onChange={handleRegisterChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="registerPassword">Password</label>
                <input
                  type="password"
                  id="registerPassword"
                  name="password"
                  placeholder="Password"
                  value={registerInputs.password}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={registerInputs.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn-submit" onClick={scrollToTop}>REGISTER</button>
          </form>
        </div>
      </div>
    </div>

    </div>
  );
}


