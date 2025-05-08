import React, { useEffect } from 'react';
import { useLoader } from '../context/LoaderContext';
import Music from '../assets/icons/rules/music.svg';
import Heart from '../assets/icons/rules/heart.svg';
import Armor from '../assets/icons/rules/armor.svg';
import Chat from '../assets/icons/rules/chat.svg';
import { Button } from '../components';
import { useNavigate } from 'react-router-dom';

function About() {
  const { useFakeLoader } = useLoader();
  const navigate = useNavigate();

  useEffect(() => useFakeLoader(), []);

  return (
    <div className="about">
      <h1 className="title">About MelodyMatch</h1>
      <div className="content">
        <h3>Our Mission</h3>
        <p>
          MelodyMatch was founded with a simple yet powerful mission: to connect musicians around
          the world, fostering collaboration, friendship, and creative partnerships. We believe that
          music is a universal language that brings people together, and our platform is designed to
          make those connections easier than ever before.
        </p>
        <h3>Our Story</h3>
        <p>
          Founded in 2025 by a group of passionate musicians who struggled to find like-minded
          artists to collaborate with, MelodyMatch has grown from a small community to a global
          platform connecting thousands of musicians daily. What started as a simple idea has
          evolved into a comprehensive platform that helps musicians find their perfect match,
          whether for professional collaboration, casual jamming, or meaningful friendships.
        </p>
        <h3>What Makes Us Different</h3>
        <ul>
          <li>
            <img
              src={Music}
              alt=""
            />
            <div className="listContent">
              <h4>Music-First Matching</h4>
              <p>
                Our algorithm prioritizes musical compatibility, matching you with musicians who
                share your tastes, influences, and creative vision.
              </p>
            </div>
          </li>
          <li>
            <img
              src={Heart}
              alt=""
            />
            <div className="listContent">
              <h4>Genuine Connections</h4>
              <p>
                We foster authentic relationships based on shared musical passion, not just
                superficial interactions.
              </p>
            </div>
          </li>
          <li>
            <img
              src={Armor}
              alt=""
            />
            <div className="listContent">
              <h4>Safe Community</h4>
              <p>
                We prioritize user safety with robust verification processes and community
                guidelines that ensure a respectful environment.
              </p>
            </div>
          </li>
          <li>
            <img
              src={Chat}
              alt=""
            />
            <div className="listContent">
              <h4>Seamless Communication</h4>
              <p>
                Our platform offers intuitive messaging and collaboration tools designed
                specifically for musicians.
              </p>
            </div>
          </li>
        </ul>
        <h3>Join Our Community</h3>
        <p>
          Whether you're a seasoned professional or just starting your musical journey, MelodyMatch
          is the perfect place to find your musical counterparts. Join our growing community today
          and discover the magic that happens when the right musicians connect.
        </p>
        <Button onClick={() => navigate('/registration')}>Join MelodyMatch Today</Button>
      </div>
    </div>
  );
}

export default About;
