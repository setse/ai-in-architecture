import React, { useEffect } from 'react';
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

function App() {
  useEffect(() => {
    document.title = "AI in Architecture";
  }, []);

  return (
    <>
      <Hero />
      <Introduction />
      <KeyTopics />
      <ToolsPlatforms />
      <CaseStudies />
      <BenefitsChallenges />
      <Future />
      <CallToAction />
      <Footer />
    </>
  );
}

export default App;
