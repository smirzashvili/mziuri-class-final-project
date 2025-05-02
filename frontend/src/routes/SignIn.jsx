import React, { useState } from 'react'
import { Button, InputGroup, Form, IconButton } from '../components'
import { Link } from 'react-router-dom'
import { validateEmail, validatePassword } from '../utils/validations'
import Eye from '../assets/icons/eye.svg'
import EyeClosed from '../assets/icons/eye-closed.svg'

function SignIn() {
  const [state, setState] = useState({})
  const [errorMessages, setErrorMessages] = useState({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handleChange = (e) => {
    setState({
        ...state,
        [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validate()
    if(Object.keys(errors).length === 0) {
      // const data = {
      //   email: state.email,
      //   password: state.password,
      // }
      // try {
      //   //
      //   setErrorMessages({})
      // } catch (err) {
        
      // }
    } else {
      setErrorMessages(errors)
    }
  }

  const validate = () => {
    const errors = {};

    const emailError = validateEmail(state.email);
    const passwordError = validatePassword(state.password);

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    return errors;
  };

  return (
    <div className='signIn'>
      <div className='formContainer'>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className='titlesContainer'>
            <h1 className='title'>Welcome Back!</h1>
            <h3 className='subtitle'>Sign in to continue your journey</h3>
          </div>
          <InputGroup label="Email" name="email" error={errorMessages.email}>
            <input
              type="text"
              className="input"
              name="email"
              id="email"
              value={state.email}
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </InputGroup>
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
              <IconButton icon={isPasswordVisible ? Eye : EyeClosed} onClick={() => setIsPasswordVisible(!isPasswordVisible)} size={20} additionalClassnames={'end'} type="button" />            
            </>
          </InputGroup>
          <Button type="submit" >Login</Button>
          <div className='additionalContainer'>
            <p className='dontHaveAcc'>Don't have an account? <Link to="/registration">Register</Link></p>
          </div>
        </Form>
      </div>

      <div className='mediaContainer'>
        <div>card</div>
      </div>
    </div>
  )
}

export default SignIn