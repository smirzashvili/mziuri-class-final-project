import React, { useState } from 'react';
import { Button, InputGroup, Form, IconButton, FakeCard } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validations';
import Eye from '../assets/icons/eye.svg';
import EyeClosed from '../assets/icons/eye-closed.svg';
import * as api from '../api/api.js';
import { useUserData } from '../context/UserContext.jsx';

function SignIn() {
  const [state, setState] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const errorToDisplay = Object.values(errorMessages)[0];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { login } = useUserData();

  const navigate = useNavigate();

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

    setIsSubmitted(true);

    const errors = validate(state);
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const { data } = await api.loginUser(state);
      setErrorMessages({})
      login(data)
      navigate('/explore');
    } catch (error) {
      setErrorMessages({ error: error?.message });
    }
  };

  const validate = (formData) => {
    const errors = {};

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    return errors;
  };

  return (
    <div className="signIn">
      <div className="formContainer">
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className="titlesContainer">
            <h1 className="title">Welcome Back!</h1>
            <h3 className="subtitle">Sign in to continue your journey</h3>
          </div>
          <InputGroup
            label="Email"
            name="email"
            error={errorMessages.email}
          >
            <input
              type="text"
              className={`input ${errorMessages.email ? 'error' : ''}`}
              name="email"
              id="email"
              value={state.email || ""}
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </InputGroup>
          <InputGroup
            label="Password"
            name="password"
            error={errorMessages.password}
          >
            <>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                className={`input ${errorMessages.password ? 'error' : ''}`}
                name="password"
                id="password"
                value={state.password || ""}
                placeholder="enter your password"
                onChange={handleChange}
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
          <Button type="submit">Log in</Button>
          <div className="additionalContainer">
            <span className={`error ${errorToDisplay ? 'visible' : ''}`}>{errorToDisplay || '.'}</span>
            <Link className='forgotPass' to="/forgot-password">Forgot Password?</Link>
            <p className="dontHaveAcc">
              Don't have an account? <Link to="/registration">Register</Link>
            </p>
          </div>
        </Form>
      </div>

      <FakeCard />
    </div>
  );
}

export default SignIn;
