export const validateFullName = (value) => {
  if (!value) {
    return 'Name is required';
  }
};

export const validateEmail = (value) => {
  if (!value) {
    return 'Email is required';
  }

  // More comprehensive email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
};

export const validatePassword = (value) => {
  if (!value) {
    return 'Password is required';
  } else if (value.length < 8) {
    return 'Password must be at least 8 characters';
  }
};

export const validateConfirmPassword = (value) => {
  if (!value) {
    return 'Password is required';
  } else if (value.length < 8) {
    return 'Password must be at least 8 characters';
  }
};

export const validateSelect = (value) => {
  if (!value || value === '') {
    return 'This field is required';
  }
};

export const validateCheckbox = (value) => {
  if (!value) {
    return 'You must accept terms and conditions';
  }
};
