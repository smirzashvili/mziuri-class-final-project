import React, { useState } from 'react';
import { Button, InputGroup, Form, IconButton, Checkbox, FakeCard } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import {
  validateDate,
  validateCheckbox,
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
  validateSelect,
} from '../utils/validations';
import Eye from '../assets/icons/eye.svg';
import EyeClosed from '../assets/icons/eye-closed.svg';
import Close from '../assets/icons/close.svg';
import * as api from '../api/api.js';
import { cities, musicalGenres, musicalInstruments } from '../data/data.js';
import { useUserData } from '../context/UserContext.jsx';

function SignUp() {
  const [state, setState] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const errorToDisplay = Object.values(errorMessages)[0];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [uploadedMedias, setUploadedMedias] = useState(Array(9).fill(null));

  const { login } = useUserData();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    
    setState({
      ...state,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (isSubmitted) {
      const potentialNextState = { ...state, [name]: type === 'checkbox' ? checked : value, };
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

    const isLastStep = activeStep === 3;
    if (!isLastStep) {
      setActiveStep(activeStep + 1);
      setErrorMessages({});
      return;
    }

    try {
      const { data } = await api.registerUser(state);
      login(data)
      navigate('/explore');
    } catch (error) {
      setErrorMessages({ error: error?.message });
    }
  };

  const validate = (formData) => {
    const errors = {};

    if (activeStep === 1) {
      const fullNameError = validateFullName(formData.fullName);
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
      const cityError = validateSelect(formData.city, 'city');
      const genderError = validateSelect(formData.gender, 'gender');
      const dateError = validateDate(formData.date);
      const termsError = validateCheckbox(formData.terms);

      if (fullNameError) errors.fullName = fullNameError;
      if (emailError) errors.email = emailError;
      if (passwordError) errors.password = passwordError;
      if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
      if (cityError) errors.city = cityError;
      if (genderError) errors.gender = genderError;
      if (dateError) errors.date = dateError;
      if (termsError) errors.terms = termsError;
    }

    if (activeStep === 2) {
      const genreError = validateSelect(formData.favoriteGenre, 'genre');
      const instrumentError = validateSelect(formData.favoriteInstrument, 'instrument');
      // const bioError = validateBio(formData.bio);

      if (genreError) errors.favoriteGenre = genreError;
      if (instrumentError) errors.favoriteInstrument = instrumentError;
      // if (bioError) errors.bio = bioError;
    }

    if (activeStep === 3) {
      // const mediaError = validateMedias(formData.media);
      // if (mediaError) errors.media = mediaError;
    }

    return errors;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedFiles = [...uploadedMedias];
    updatedFiles[uploadedMedias.findIndex((item) => item === null)] = file; //set at first null index

    setUploadedMedias(updatedFiles);
    setState({
      ...state,
      media: updatedFiles,
    });
  };

  const handleFileDelete = (e, index) => {
    e.preventDefault();

    const updatedFiles = [...uploadedMedias];
    updatedFiles.splice(index, 1); // remove 1 item at 'index'
    updatedFiles.push(null); // add a null at the end

    setUploadedMedias(updatedFiles);
    setState({
      ...state,
      media: updatedFiles,
    });
  };

  return (
    <div className="signUp">
      <div className="formContainer">
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className="titlesContainer">
            <h1 className="title">
              Create an account <span className="stepIndicator">( {activeStep} of 3 )</span>
            </h1>
            <h3 className="subtitle">Join MelodyMatch and start connecting with musicians</h3>
          </div>
          {activeStep === 1 ? (
            <>
              <InputGroup
                label="Full Name"
                name="fullName"
                error={errorMessages.fullName}
              >
                <input
                  type="text"
                  className={`input ${errorMessages.fullName ? 'error' : ''}`}
                  name="fullName"
                  id="fullName"
                  value={state.fullName || ""}
                  placeholder="enter your full name"
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
                  className={`input ${errorMessages.email ? 'error' : ''}`}
                  name="email"
                  id="email"
                  value={state.email || ""}
                  placeholder="enter your email"
                  onChange={handleChange}
                />
              </InputGroup>
              <div className="widthDivider">
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
                      placeholder="enter your password"
                      value={state.password || ""}
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
                  label="Confirm Password"
                  name="confirmPassword"
                  error={errorMessages.confirmPassword}
                >
                  <>
                    <input
                      type={isConfirmPasswordVisible ? 'text' : 'password'}
                      className={`input ${errorMessages.confirmPassword ? 'error' : ''}`}
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="confirm your password"
                      value={state.confirmPassword || ""}
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
              </div>
              <div className="widthDivider">
                <InputGroup
                  label="City"
                  name="city"
                  error={errorMessages.city}
                >
                  <select
                    className={`select ${errorMessages.city ? 'error' : ''} ${!state.city || state.city === '' ? 'placeholder-selected' : ''}`}
                    name="city"
                    id="city"
                    value={state.city || ""}
                    onChange={(e) => handleChange(e)}
                    defaultValue={''}
                  >
                    <option
                      disabled
                      hidden
                      value=""
                    >
                      select city
                    </option>
                    {cities.map((item, i) => (
                      <option
                        key={i}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </InputGroup>
                <InputGroup
                  label="Gender"
                  name="gender"
                  error={errorMessages.gender}
                >
                  <select
                    className={`select ${errorMessages.gender ? 'error' : ''} ${!state.gender || state.gender === '' ? 'placeholder-selected' : ''}`}
                    name="gender"
                    id="gender"
                    value={state.gender || ""}
                    onChange={(e) => handleChange(e)}
                    defaultValue={''}
                  >
                    <option
                      disabled
                      hidden
                      value=""
                    >
                      select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </InputGroup>
              </div>
              <InputGroup
                  label="Date of Birth"
                  name="date"
                  error={errorMessages.date}
              >
                <input
                  type="date"
                  className={`input ${errorMessages.date ? 'error' : ''}`}
                  name="date"
                  id="date"
                  value={state.date || "2001-01-01"}
                  onChange={handleChange}
                />
              </InputGroup>

              <InputGroup
                label=""
                name="terms"
                error={errorMessages.terms}
              >
                <label className="termsLabel">
                  <Checkbox
                    type="checkbox"
                    name="terms"
                    checked={state.terms || false}
                    onChange={(e) => handleChange(e)}
                    additionalClassnames={errorMessages.email ? 'error' : ''}
                  />
                  <span className="acceptTerms">
                    I agree to the MelodyMatch's <Link to="/terms">Terms and Conditions</Link>
                  </span>
                </label>
              </InputGroup>
            </>
          ) : activeStep === 2 ? (
            <>
              <InputGroup
                label="Favorite Musical Genre"
                name="favoriteGenre"
                error={errorMessages.favoriteGenre}
              >
                <select
                  className={`select ${errorMessages.favoriteGenre ? 'error' : ''} ${!state.favoriteGenre || state.favoriteGenre === '' ? 'placeholder-selected' : ''}`}
                  name="favoriteGenre"
                  id="favoriteGenre"
                  value={state.favoriteGenre || ""}
                  onChange={(e) => handleChange(e)}
                  defaultValue={''}
                >
                  <option
                    disabled
                    hidden
                    value=""
                  >
                    select genre
                  </option>
                  {musicalGenres.map((item, i) => (
                    <option
                      key={i}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </InputGroup>
              <InputGroup
                label="Favorite Musical Instrument"
                name="favoriteInstrument"
                error={errorMessages.favoriteInstrument}
              >
                <select
                  className={`select ${errorMessages.favoriteInstrument ? 'error' : ''} ${!state.favoriteInstrument || state.favoriteInstrument === '' ? 'placeholder-selected' : ''}`}
                  name="favoriteInstrument"
                  id="favoriteInstrument"
                  value={state.favoriteInstrument || ""}
                  onChange={(e) => handleChange(e)}
                  defaultValue={''}
                >
                  <option
                    disabled
                    hidden
                    value=""
                  >
                    select instrument
                  </option>
                  {musicalInstruments.map((item, i) => (
                    <option
                      key={i}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </InputGroup>
              <InputGroup
                label="Bio"
                name="bio"
                error={errorMessages.bio}
              >
                <textarea
                  className={`textarea ${errorMessages.email ? 'error' : ''}`}
                  name="bio"
                  id="bio"
                  placeholder="write what you want"
                  value={state.bio || ""}
                  onChange={(e) => handleChange(e)}
                />
              </InputGroup>
            </>
          ) : (
            <>
              <div className="uploadMediaContainer">
                <InputGroup
                  label="Upload 2 or more videos/photos"
                  name="media"
                  error={errorMessages.media}
                >
                  {uploadedMedias.map((file, index) => (
                    <label
                      key={index}
                      className={`${file ? 'uploaded' : ''}`}
                      htmlFor={`media-${index}`}
                    >
                      {file ? (
                        <>
                          {file.type.startsWith('video') ? (
                            <video
                              src={URL.createObjectURL(file)}
                              autoPlay
                              muted
                            />
                          ) : (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`uploaded ${index}`}
                            />
                          )}
                          <IconButton
                            icon={Close}
                            onClick={(e) => handleFileDelete(e, index)}
                            size={"calc(14px * var(--app-scale))"}
                            type="button"
                          />
                        </>
                      ) : (
                        <input
                          type="file"
                          className="input"
                          name="media"
                          id={`media-${index}`}
                          onChange={(e) => handleFileUpload(e)}
                        />
                      )}
                    </label>
                  ))}
                </InputGroup>
              </div>
            </>
          )}
          <div className="widthDivider">
            {activeStep > 1 && (
              <Button
                type="button"
                additionalClassnames="secondary"
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Back
              </Button>
            )}
            <Button type="submit">{activeStep !== 3 ? 'Continue' : 'Complete'}</Button>
          </div>
          <div className="additionalContainer">
            <span className={`error ${errorToDisplay ? 'visible' : ''}`}>{errorToDisplay || '.'}</span>
            <p className="alreadyHaveAcc">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </Form>
      </div>

      <FakeCard />
    </div>
  );
}

export default SignUp;
