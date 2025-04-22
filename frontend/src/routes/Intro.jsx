import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Intro = () => {

  const navigate = useNavigate()

  return (
    <div id='intro'>
        <Logo hasAnimation={true}/>
        <h2>this website is created for introduce musicians by sharing their skills</h2>
        <button onClick={() => navigate("/explore")}>Get Started</button>
    </div>
  )
};

export default Intro;
