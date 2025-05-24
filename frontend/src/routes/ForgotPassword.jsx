import React, { useState } from 'react';
import { Button, InputGroup, Form, IconButton, FakeCard } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/validations';
import * as api from '../api/api.js';
import { useNotification } from '../context/NotificationContext';

function ForgotPassword() {
  const [state, setState] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const errorToDisplay = Object.values(errorMessages)[0];

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
      const { data } = await api.forgotPasswordUser(state);
      setErrorMessages({})
      showNotification('Sucessfully sent! Check email for further information')
    } catch (error) {
      setErrorMessages({ error: error?.message });
    }
  };

  const validate = (formData) => {
    const errors = {};

    const emailError = validateEmail(formData.email);

    if (emailError) errors.email = emailError;

    return errors;
  };

  return (
    <div className="forgotPassword">
      <div className="formContainer">
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className="titlesContainer">
            <h1 className="title">Forgot your password?</h1>
            <h3 className="subtitle">No worries, enter your email to get reset password link</h3>
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
          <Button type="submit">Send</Button>
          <div className="additionalContainer">
            <span className={`error ${errorToDisplay ? 'visible' : ''}`}>{errorToDisplay || '.'}</span>
            <p className="rememberPass">
              Remember your password? <Link to="/login">Log In</Link>
            </p>
          </div>
        </Form>
      </div>

      <FakeCard />
    </div>
  );
}

export default ForgotPassword;
