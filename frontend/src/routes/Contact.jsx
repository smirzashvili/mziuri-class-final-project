import React, { useEffect, useState } from 'react';
import { useLoader } from '../context/LoaderContext';
import Email from '../assets/icons/rules/email.svg';
import Call from '../assets/icons/rules/call.svg';
import Visit from '../assets/icons/rules/visit.svg';
import { Button, InputGroup, Form } from '../components';
import {
  validateEmail,
  validateFullName,
  validateSubject,
  validateMessage,
} from '../utils/validations';
import * as api from '../api/api.js';

function Contact() {
  const [state, setState] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  // const navigate = useNavigate();

  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const response = await api.contact(state);
      console.log(response)
      if (response.data) {
        alert('email has sent')
      }
    } catch (err) {
      throw err;
    }
  };

  const validate = () => {
    const errors = {};

    const nameError = validateFullName(state.name);
    const emailError = validateEmail(state.email);
    const subjectError = validateSubject(state.subject);
    const messageError = validateMessage(state.message);

    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (subjectError) errors.subject = subjectError;
    if (messageError) errors.message = messageError;

    return errors;
  };

  return (
    <div className="contact">
      <h1 className="title">Contact Us</h1>
      <div className="content">
        <div className="contactOptions">
          <div>
            <img
              src={Email}
              alt=""
            />
            <h3>Email Us</h3>
            <p>support@melodymatch.com</p>
            <p>business@melodymatch.com</p>
          </div>
          <div>
            <img
              src={Call}
              alt=""
            />
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon-Fri, 9am-5pm EST</p>
          </div>
          <div>
            <img
              src={Visit}
              alt=""
            />
            <h3>Visit Us</h3>
            <p>123 Music Avenue</p>
            <p>New York, NY 10001</p>
          </div>
        </div>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className="widthDivider">
            <InputGroup
              label="Name"
              name="name"
              error={errorMessages.name}
            >
              <input
                type="text"
                className="input"
                name="name"
                id="name"
                value={state.name || ""}
                placeholder="enter your name"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup
              label="Email"
              name="email"
              error={errorMessages.email}
            >
              <input
                type="text"
                className="input"
                name="email"
                id="email"
                placeholder="enter your email"
                value={state.email || ""}
                onChange={(e) => handleChange(e)}
              />
            </InputGroup>
          </div>
          <InputGroup
            label="Subject"
            name="subject"
            error={errorMessages.subject}
          >
            <input
              type="text"
              className="input"
              name="subject"
              id="subject"
              placeholder="enter subject"
              value={state.subject || ""}
              onChange={(e) => handleChange(e)}
            />
          </InputGroup>
          <InputGroup
            label="Message"
            name="message"
            error={errorMessages.message}
          >
            <textarea
              className="textarea"
              name="message"
              id="message"
              placeholder="how can we help you?"
              value={state.message || ""}
              onChange={(e) => handleChange(e)}
            />
          </InputGroup>
          <Button type="submit">Send Message</Button>
        </Form>
      </div>
    </div>
  );
}

export default Contact;
