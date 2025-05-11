import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Button } from '../components';
import FancyButton from '../components/FancyButton';
import { useUserData } from '../context/UserContext.jsx';

const Intro = () => {
  const navigate = useNavigate();
  const { loggedIn } = useUserData();

  return (
    <div className="intro">
      <Logo hasAnimation={true} />
      <h2>this website is created for introduce musicians by sharing their skills</h2>
      <FancyButton onClick={() => navigate(`/${!loggedIn ? 'login' : 'explore'}`)}>Get Started</FancyButton>
    </div>
  );
};

export default Intro;
