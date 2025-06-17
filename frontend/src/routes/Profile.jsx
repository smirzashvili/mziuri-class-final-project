import React, { useState, useEffect } from 'react';
import { Button, InputGroup, Form, IconButton, Checkbox, FakeCard, UserAvatar } from '../components';
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
import { musicalGenres, musicalInstruments } from '../data/data.js';
import { useUserData } from '../context/UserContext.jsx';
import { useNotification } from '../context/NotificationContext';
import Male1 from '../assets/icons/user/male1.svg';
import { formatDate } from '../utils/textFormat.js';

function Profile() {
  const [state, setState] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const errorToDisplay = Object.values(errorMessages)[0];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [uploadedMedias, setUploadedMedias] = useState(Array(9).fill(null));

  const { userData } = useUserData();
  const {showNotification} = useNotification();

  const navigate = useNavigate();

  useEffect(() => {
    console.log(userData)
    if (userData && Object.keys(userData).length > 0) {
      setState(prevState => ({
        ...prevState,
        ...userData
      }));
      setUploadedMedias(userData.media || Array(9).fill(null)); // Optional if you're loading media too
    }
  }, [userData]);


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

    try {
      const { data } = await api.updateUser(state);
      showNotification('User details have been successfully updated');
      setErrorMessages({})
    } catch (error) {
      setErrorMessages({ error: error?.message });
    }
  };

  const validate = (formData) => {
    const errors = {};

    // if (activeStep === 1) {
      const fullNameError = validateFullName(formData.fullName);
      const emailError = validateEmail(formData.email);
      const cityError = validateSelect(formData.city, 'city');
      const genderError = validateSelect(formData.gender, 'gender');
      const dateError = validateDate(formData.date);

      if (fullNameError) errors.fullName = fullNameError;
      if (emailError) errors.email = emailError;
      if (cityError) errors.city = cityError;
      if (genderError) errors.gender = genderError;
      if (dateError) errors.date = dateError;
    // }

    // if (activeStep === 2) {
      const genreError = validateSelect(formData.favoriteGenre, 'genre');
      const instrumentError = validateSelect(formData.favoriteInstrument, 'instrument');
      // const bioError = validateBio(formData.bio);

      if (genreError) errors.favoriteGenre = genreError;
      if (instrumentError) errors.favoriteInstrument = instrumentError;
      // if (bioError) errors.bio = bioError;
    // }

    // if (activeStep === 3) {
      // const mediaError = validateMedias(formData.media);
      // if (mediaError) errors.media = mediaError;
    // }
    
    if(formData.password?.length > 0) {
      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
      if (passwordError) errors.password = passwordError;
      if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
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
    <div className="profile">
      <h1 className="title">Profile</h1>
      <div className='avatarContainer'>
        <UserAvatar 
          avatarIndex={userData?.avatarIndex}
          gender={userData?.gender}
        />
        <p>Joined MelodyMatch on {formatDate(userData?.createdAt)}</p>
      </div>
      <div className="formContainer">
        <Form onSubmit={(e) => handleSubmit(e)}>
            <h2 className="title">
              Account Details:
            </h2>
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
                    <option value="tbilisi">Tbilisi</option>
                    <option value="gori">Gori</option>
                    <option value="batumi">Batumi</option>
                    <option value="xashuri">Xashuri</option>
                    <option value="kutaisi">Kutaisi</option>
                    <option value="telavi">Telavi</option>
                    <option value="poti">Poti</option>
                    <option value="chiatura">Chiatura</option>
                    <option value="kobuleti">Kobuleti</option>
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
                    <option value="tbilisi">Male</option>
                    <option value="gori">Female</option>
                    <option value="batumi">Other</option>
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
            </>
            <>
              <h2 className="title">
                Personal Details:
              </h2>
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
            <>
              <h2 className="title">
                Content Details:
              </h2>
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
          <Button type="submit">Update</Button>
          <div className="additionalContainer">
            <span className={`error ${errorToDisplay ? 'visible' : ''}`}>{errorToDisplay || '.'}</span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Profile;
