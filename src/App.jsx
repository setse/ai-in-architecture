import React, { useEffect } from 'react';
import './index.css';

function App() {
  // Simple scroll spy effect to ensure scroll smooth across devices
  useEffect(() => {
    document.title = "AI in Architecture";
  }, []);

  return (
    <>
      <header className="hero container">
        <div className="hero-blob"></div>
        <h1>
          The Future of <br />
          <span className="gradient-text">Architectural Design</span>
        </h1>
        <p>
          Artificial intelligence is reshaping the built environment. From generative floor plans to optimized structural analysis, computational power is unlocking a new era of sustainable and visionary architecture.
        </p>
        <button 
          className="cta-button" 
          onClick={() => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' })}
        >
          Explore AI Workflows
        </button>
      </header>

      <section id="explore" className="container">
        <h2 className="section-title">Key Capabilities</h2>
        <div className="grid">
          <div className="card">
            <div className="icon">📐</div>
            <h3>Generative Design</h3>
            <p>Algorithms rapidly iterate through thousands of spatial configurations based on sunlight, wind, and zoning constraints to find the optimal footprint.</p>
          </div>
          <div className="card">
            <div className="icon">🌉</div>
            <h3>Structural Intelligence</h3>
            <p>Predictive modeling anticipates load distribution, material stresses, and seismic vulnerabilities long before physical construction begins.</p>
          </div>
          <div className="card">
            <div className="icon">🌱</div>
            <h3>Sustainable Optimization</h3>
            <p>AI accurately models energy consumption, carbon footprints, and thermal behavior, paving the way for truly net-zero structures.</p>
          </div>
          <div className="card">
            <div className="icon">⚡</div>
            <h3>Automated Workflow</h3>
            <p>Say goodbye to tedious compliance checks and documentation. Deep learning models auto-annotate schematics and verify civic codes.</p>
          </div>
        </div>
      </section>

      <section className="container" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '4rem 2rem', marginTop: '2rem' }}>
        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem', marginLeft: '1rem' }}>The Transformation Timeline</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '800px', marginBottom: '3rem', marginLeft: '1rem', fontSize: '1.1rem' }}>
          Traditional architecture is linear. AI-augmented architecture is cyclical and data-driven. The designer acts as the curator of possibilities, guiding algorithms to produce highly bespoke, efficient, and beautiful spaces.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 1rem' }}>
          {[
            { phase: '01. Data Ingestion', desc: 'Topography, site limits, material availability, and civic rules are fed into the parametric engine.' },
            { phase: '02. Generative Iteration', desc: 'The model produces millions of permutations, evaluating them against human-defined metrics.' },
            { phase: '03. Human Curation', desc: 'Architects select, refine, and imbue emotional or conceptual meaning into the generated geometries.' },
            { phase: '04. Predictive Fabrication', desc: 'Designs are automatically converted into precise CNC and 3D printing paths for robotic assembly.' }
          ].map((item, id) => (
            <div className="timeline-item" key={id}>
              <div style={{ fontWeight: '800', color: 'var(--accent-blue)', fontSize: '1.2rem', minWidth: '220px' }}>{item.phase}</div>
              <div style={{ color: 'var(--text-main)', opacity: '0.9' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 className="section-title">Ready to embrace the algorithm?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          Discover the definitive toolset required to integrate neural networks into your architectural practice today.
        </p>
        <button className="cta-button">View Documentation</button>
      </section>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} AI In Architecture. Designed by Sets.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
