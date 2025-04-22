import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';

const Intro = () => {

  const navigate = useNavigate()

  return (
    <div id='intro'>
        <Logo hasAnimation={true}/>
        <h2>this website is created for introduce musicians by sharing their skills</h2>
        <Button onClick={() => navigate("/explore")}>Get Started</Button>
    </div>
  )
};

export default Intro;
