import React, { useState } from 'react';
import { Button, InputGroup, Form, IconButton, FakeCard } from '../components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { validateConfirmPassword, validatePassword } from '../utils/validations';
import * as api from '../api/api.js';
import Eye from '../assets/icons/eye.svg';
import EyeClosed from '../assets/icons/eye-closed.svg';

function ResetPassword() {
  const [state, setState] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const { token } = useParams()

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });

    // if(isSubmitted) {
    //   window.setTimeout(() => {
    //     const errors = validate()
    //     if (Object.keys(errors).length > 0) {
    //       setErrorMessages(errors)
    //       return
    //     }
    //   }, 20)
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const response = await api.resetPasswordUser(state, token);

      if (response.data) {
        // alert('email has sent')
        // setLoggedIn(true);
        // navigate('/explore');
      }
    } catch (err) {
      throw err;
    }
  };

  const validate = () => {
    const errors = {};

    const passwordError = validatePassword(state.password);
    const confirmPasswordError = validateConfirmPassword(state.confirmPassword);

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
            {/* <h3 className="subtitle">Sign in to continue your journey</h3> */}
          </div>
          <InputGroup
            label="Password"
            name="password"
            error={errorMessages.password}
          >
            <>
                <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    className="input"
                    name="password"
                    id="password"
                    placeholder="enter your password"
                    value={state.password || ""}
                    onChange={(e) => handleChange(e)}
                />
                <IconButton
                    icon={isPasswordVisible ? Eye : EyeClosed}
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    size={20}
                    additionalClassnames={'end'}
                    type="button"
                />
            </>
          </InputGroup>
          <InputGroup
            label="Confirm Password"
            name="confirmPassword"
            error={errorMessages.confirmPassword}
          >
            <>
                <input
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    className="input"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="confirm your password"
                    value={state.confirmPassword || ""}
                    onChange={(e) => handleChange(e)}
                />
                <IconButton
                    icon={isConfirmPasswordVisible ? Eye : EyeClosed}
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    size={20}
                    additionalClassnames={'end'}
                    type="button"
                />
            </>
            </InputGroup>
          <Button type="submit">Reset Password</Button>
          <div className="additionalContainer">
            <p className="backToLogin">
              Back to <Link to="/login">Log In</Link>
            </p>
          </div>
        </Form>
      </div>

      <div className="mediaContainer">
        <FakeCard />
      </div>
    </div>
  );
}

export default ResetPassword;
