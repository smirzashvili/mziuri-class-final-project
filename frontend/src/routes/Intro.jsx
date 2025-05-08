import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Button } from '../components';
import FancyButton from '../components/FancyButton';

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className="intro">
      <Logo hasAnimation={true} />
      <h2>this website is created for introduce musicians by sharing their skills</h2>
      <FancyButton onClick={() => navigate('/login')}>Get Started</FancyButton>
    </div>
  );
};

export default Intro;
