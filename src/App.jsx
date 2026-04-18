import React, { useEffect, useState } from 'react';
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

function App() {
  const [showAssembly, setShowAssembly] = useState(false);
  useEffect(() => {
    document.title = "AI in Architecture";
  }, []);

  return (
    <>
      {showAssembly ? (
        <RoboticAssembly onClose={() => setShowAssembly(false)} />
      ) : (
        <>
          <Hero onOpenAssembly={() => setShowAssembly(true)} />
      <Introduction />
      <KeyTopics />
      <ToolsPlatforms />
      <CaseStudies />
      <BenefitsChallenges />
      <Future />
          <CallToAction onOpenAssembly={() => setShowAssembly(true)} />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
