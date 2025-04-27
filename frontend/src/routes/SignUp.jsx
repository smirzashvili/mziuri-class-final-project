import React, { useState } from 'react'
import { Button, InputGroup, Form, IconButton } from '../components'
import { Link } from 'react-router-dom'
import { validateCheckbox, validateConfirmPassword, validateEmail, validateFullName, validateMedias, validatePassword, validateSelect } from '../utils/validations'
import Eye from '../assets/icons/eye.svg'
import EyeClosed from '../assets/icons/eye-closed.svg'

function SignUp() {
  const [state, setState] = useState({})
  const [errorMessages, setErrorMessages] = useState({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [uploadedMedias, setUploadedMedias] = useState(Array(9).fill(null));

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setState({
      ...state,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors)
      return
    }

    const isLastStep = activeStep === 3
    if(!isLastStep) {
      setActiveStep(activeStep + 1)
      setErrorMessages({})
      return
    }

    alert('reg')
    // const data = {
    //   email: state.email,
    //   password: state.password,
    // }
    // try {
    //   //
    //   setErrorMessages({})
    // } catch (err) {

    // }
  }

  const validate = () => {
    const errors = {};

    const fullNameError = validateFullName(state.fullName);
    const emailError = validateEmail(state.email);
    const passwordError = validatePassword(state.password);
    const confirmPasswordError = validateConfirmPassword(state.confirmPassword);
    const cityError = validateSelect(state.city);
    const genderError = validateSelect(state.gender);
    const termsError = validateCheckbox(state.terms);
    const genreError = validateSelect(state.favoriteGenre);
    const instrumentError = validateSelect(state.favoriteInstrument);
    // const bioError = validateBio(state.bio);
    const mediaError = validateMedias(state.media);

    if (fullNameError) errors.fullName = fullNameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    if (cityError) errors.city = cityError;
    if (genderError) errors.gender = genderError;
    if (termsError) errors.terms = termsError;
    if (genreError) errors.favoriteGenre = genreError;
    if (instrumentError) errors.favoriteInstrument = instrumentError;
    if (mediaError) errors.media = mediaError;

    return errors;
  };

  const handleFileUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedFiles = [...uploadedMedias];
    updatedFiles[uploadedMedias.findIndex(item => item === null)] = file; //set at first null index

    setUploadedMedias(updatedFiles);
    setState({
      ...state,
      media: updatedFiles
    });
  };

  const handleFileDelete = (index) => {
    const updatedFiles = [...uploadedMedias];
    updatedFiles.splice(index, 1); // remove 1 item at 'index'
    updatedFiles.push(null); // add a null at the end
  
    setUploadedMedias(updatedFiles);
    setState({
      ...state,
      media: updatedFiles
    });
  };

  return (
    <div className='signUp'>
      <div className='formContainer'>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className='titlesContainer'>
            <h1 className='title'>Create an account <span className='stepIndicator'>( {activeStep} of 3 )</span></h1>
            <h3 className='subtitle'>Join MelodyMatch and start connecting with musicians</h3>
          </div>
          {activeStep === 1 ?
          <>
            <InputGroup label="Full Name" name="fullName" error={errorMessages.fullName}>
              <input
                type="text"
                className="input"
                name="fullName"
                id="fullName"
                value={state.fullName}
                placeholder="enter your full name"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup label="Email" name="email" error={errorMessages.email}>
              <input
                type="text"
                className="input"
                name="email"
                id="email"
                value={state.email}
                placeholder="enter your email"
                onChange={handleChange}
              />
            </InputGroup>
            <div className='widthDivider'>
              <InputGroup label="Password" name="password" error={errorMessages.password}>
                <>
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    className="input"
                    name="password"
                    id="password"
                    placeholder="enter your password"
                    value={state.password}
                    onChange={(e) => handleChange(e)}
                  />
                  <IconButton icon={isPasswordVisible ? Eye : EyeClosed} onClick={() => setIsPasswordVisible(!isPasswordVisible)} size={20} additionalClassnames={'end'} type="button"/>
                </>
              </InputGroup>
              <InputGroup label="Confirm Password" name="confirmPassword" error={errorMessages.confirmPassword}>
                <>
                  <input
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    className="input"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="confirm your password"
                    value={state.confirmPassword}
                    onChange={(e) => handleChange(e)}
                  />
                  <IconButton icon={isConfirmPasswordVisible ? Eye : EyeClosed} onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} size={20} additionalClassnames={'end'} type="button" />
                </>
              </InputGroup>
            </div>
            <InputGroup label="City" name="city" error={errorMessages.city}>
              <select 
                className={`select ${!state.city || state.city === '' ? 'placeholder-selected' : ''}`}
                name="city" 
                id="city" 
                value={state.city}
                onChange={(e) => handleChange(e)}
                defaultValue={''}
              >
                <option disabled hidden value="">select city</option>
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
            <InputGroup label="Gender" name="city" error={errorMessages.gender}>
              <select 
                className={`select ${!state.gender || state.gender === '' ? 'placeholder-selected' : ''}`}
                name="gender" 
                id="gender" 
                value={state.gender}
                onChange={(e) => handleChange(e)}
                defaultValue={''}
              >
                <option disabled hidden value="">select gender</option>
                <option value="tbilisi">Male</option>
                <option value="gori">Female</option>
                <option value="batumi">Other</option>
              </select>
            </InputGroup>

            <InputGroup label="" name="terms" error={errorMessages.terms}>
              <label className='termsLabel'>
                <input
                  type="checkbox"
                  className='checkbox'
                  name="terms"
                  checked={state.terms || false} // safer in case it's undefined
                  // onClick={() => state.terms = !state.terms}
                  onChange={(e) => handleChange(e)}
                />
                <span className='terms'>I agree to the MelodyMatch's <Link to="/terms">Terms and Conditions</Link></span>
              </label>
            </InputGroup>
          </>
          : activeStep === 2 ?
          <>
            <InputGroup label="Favorite Musical Genre" name="favoriteGenre" error={errorMessages.favoriteGenre}>
              <select 
                className={`select ${!state.favoriteGenre || state.favoriteGenre === '' ? 'placeholder-selected' : ''}`}
                name="favoriteGenre" 
                id="favoriteGenre" 
                value={state.favoriteGenre}
                onChange={(e) => handleChange(e)}
                defaultValue={''}
              >
                <option disabled hidden value="">select genre</option>
                <option value="tbilisi">Male</option>
                <option value="gori">Female</option>
                <option value="batumi">Other</option>
              </select>
            </InputGroup>
            <InputGroup label="Favorite Musical Instrument" name="favoriteInstrument" error={errorMessages.favoriteInstrument}>
              <select 
                className={`select ${!state.favoriteInstrument || state.favoriteInstrument === '' ? 'placeholder-selected' : ''}`}
                name="favoriteInstrument" 
                id="favoriteInstrument" 
                value={state.favoriteInstrument}
                onChange={(e) => handleChange(e)}
                defaultValue={''}
              >
                <option disabled hidden value="">select instrument</option>
                <option value="tbilisi">Male</option>
                <option value="gori">Female</option>
                <option value="batumi">Other</option>
              </select>
            </InputGroup>
            <InputGroup label="Bio" name="bio" error={errorMessages.bio}>
              <textarea
                className="textarea"
                name="bio"
                id="bio"
                placeholder="write what you want"
                value={state.bio}
                onChange={(e) => handleChange(e)}
              />
            </InputGroup>
          </>
          :
          <>
            <div className='uploadMediaContainer'>
              <InputGroup label="Upload 2 or more videos/photos" name="media" error={errorMessages.media}>
                {uploadedMedias.map((file, index) => (
                  <label key={index} className={`${file ? 'uploaded' : ''}`}>
                    {
                      file ? (
                        <>
                          {
                            file.type.startsWith('video') ? (
                              <video src={URL.createObjectURL(file)} autoPlay />
                            ) : (
                              <img src={URL.createObjectURL(file)} alt={`uploaded ${index}`} />
                            )
                          }
                          <div className='deleteIcon' onClick={() => handleFileDelete(index)}>D</div>
                        </>
                      ) : (
                        <input
                          type="file"
                          className="input"
                          name="media"
                          id="media"
                          onChange={(e) => handleFileUpload(e, index)}
                        />
                      )
                    }
                  </label>
                ))}
              </InputGroup>
            </div>
          </>
          }
          <div className='widthDivider'>
            {activeStep > 1 && <Button type="button" variant="secondary" onClick={() => setActiveStep(activeStep - 1)}>Back</Button>}          
            <Button type="submit">{activeStep !==3 ? 'Continue' : 'Complete'}</Button>
          </div>
          <div className='additionalContainer'>
            <p className='alreadyHaveAcc'>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </Form>
      </div>

      <div className='mediaContainer'>
        <div>card</div>
      </div>
    </div>
  )
}

export default SignUp