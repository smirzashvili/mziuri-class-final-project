import React, { useState } from 'react'
import { Button, InputGroup, Form } from '../components'

function SignIn() {
  const [state, setState] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState()

  const handleChange = (e) => {
    setState({
        ...state,
        [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      username: state.username,
      password: state.password,
    }
    try {
      setError("")
    } catch (err) {
      setError("Something went wrong!")
    }
  }

  return (
    <div className='signIn'>
      <div className='formContainer'>
        <h1 className='title'>Login</h1>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <InputGroup
            label="Username"
            name="username"
            value={state.username}
            onChange={(e) => handleChange(e)}
            error={error}
          />
          <InputGroup
            label="Password"
            name="password"
            value={state.password}
            onChange={(e) => handleChange(e)}
            error={error}
          />
          <Button>Login</Button>
        </Form>

        <a href="/registration">Register</a>
      </div>

      <div className='mediaContainer'>
        <div>card</div>
      </div>
    </div>
  )
}

export default SignIn