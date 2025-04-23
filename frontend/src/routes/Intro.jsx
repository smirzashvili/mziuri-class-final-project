import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Button } from '../components';

const Intro = () => {

  const navigate = useNavigate()

  return (
    <div className='intro'>
        <Logo hasAnimation={true}/>
        <h2>this website is created for introduce musicians by sharing their skills</h2>
        <Button onClick={() => navigate("/login")}>Get Started</Button>
    </div>
  )
};

export default Intro;
