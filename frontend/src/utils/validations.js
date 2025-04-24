export const validateEmail = (email) => {
    if (!email) {
        return 'Email is required';
    } else if (!email.includes('@')) {
        return 'Email is invalid';
    }
};
  
export const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    } else if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
};
  