import React, { useState } from 'react';
import { Button, InputGroup, Form, IconButton, FakeCard } from '../components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { validateConfirmPassword, validatePassword } from '../utils/validations';
import * as api from '../api/api.js';
import Eye from '../assets/icons/eye.svg';
import EyeClosed from '../assets/icons/eye-closed.svg';
import { useNotification } from '../context/NotificationContext';

function ResetPassword() {
  const [state, setState] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const errorToDisplay = Object.values(errorMessages)[0];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const { token } = useParams()
  
  const {showNotification} = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });

    if (isSubmitted) {
      const potentialNextState = { ...state, [name]: value };
      const errors = validate(potentialNextState);
      setErrorMessages(errors || {});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true)

    const errors = validate(state);
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const { data } = await api.resetPasswordUser(state, token);
      showNotification('The password has been reset!')
      setErrorMessages({})
    } catch (error) {
      setErrorMessages({ error: error?.message });
    }
  };

  const validate = (formData) => {
    const errors = {};

    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

    if (passwordError) errors.password = passwordError;
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    return errors;
  };

  return (
    <div className="resetPassword">
      <div className="formContainer">
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className="titlesContainer">
            <h1 className="title">Reset Your Password</h1>
          </div>
          <InputGroup
            label="New Password"
            name="password"
            error={errorMessages.password}
          >
            <>
                <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    className={`input ${errorMessages.password ? 'error' : ''}`}
                    name="password"
                    id="password"
                    placeholder="enter new password"
                    value={state.password}
                    onChange={(e) => handleChange(e)}
                />
                <IconButton
                    icon={isPasswordVisible ? Eye : EyeClosed}
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    size={"calc(20px * var(--app-scale))"}
                    additionalClassnames={'end'}
                    type="button"
                />
            </>
          </InputGroup>
          <InputGroup
            label="Confirm New Password"
            name="confirmPassword"
            error={errorMessages.confirmPassword}
          >
            <>
                <input
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    className={`input ${errorMessages.confirmPassword ? 'error' : ''}`}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="confirm new password"
                    value={state.confirmPassword}
                    onChange={(e) => handleChange(e)}
                />
                <IconButton
                    icon={isConfirmPasswordVisible ? Eye : EyeClosed}
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    size={"calc(20px * var(--app-scale))"}
                    additionalClassnames={'end'}
                    type="button"
                />
            </>
            </InputGroup>
          <Button type="submit">Reset Password</Button>
          <div className="additionalContainer">
            <span className={`error ${errorToDisplay ? 'visible' : ''}`}>{errorToDisplay || '.'}</span>
            <p className="backToLogin">
              Back to <Link to="/login">Log In</Link>
            </p>
          </div>
        </Form>
      </div>

      <FakeCard />
    </div>
  );
}

export default ResetPassword;
