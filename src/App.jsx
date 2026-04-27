import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';

// Components
import Hero from './components/Hero';
import Introduction from './components/Introduction';
import KeyTopics from './components/KeyTopics';
import ToolsPlatforms from './components/ToolsPlatforms';
import CaseStudies from './components/CaseStudies';
import BenefitsChallenges from './components/BenefitsChallenges';
import Future from './components/Future';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import RoboticAssembly from './components/RoboticAssembly';

function MainSite() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'AI in Architecture';
  }, []);

  return (
    <>
      <Hero onOpenAssembly={() => navigate('/assembly')} />
      <Introduction />
      <KeyTopics />
      <ToolsPlatforms />
      <CaseStudies />
      <BenefitsChallenges />
      <Future />
      <CallToAction onOpenAssembly={() => navigate('/assembly')} />
      <Footer />
    </>
  );
}

function AssemblyPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = '3D Assembly Demo — AI in Architecture';
  }, []);

  return <RoboticAssembly onClose={() => navigate('/')} />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/assembly" element={<AssemblyPage />} />
    </Routes>
  );
}

export default App;
