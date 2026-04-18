/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React from 'react';


export default function Introduction() {
  return (
    <section id="introduction" className="container" style={{ padding: '8rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Redefining Architecture</h2>
          <p className="section-subtitle" style={{ margin: '0 auto', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            Traditional architecture is linear. AI-augmented architecture is cyclical and data-driven. 
            The designer acts as the curator of possibilities, guiding algorithms to produce highly bespoke, 
            efficient, and beautiful spaces.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '4rem', textAlign: 'left' }}>
          {[
            { phase: '01. Data Ingestion', desc: 'Topography, site limits, material availability, and civic rules are fed into the parametric engine.' },
            { phase: '02. Generative Iteration', desc: 'The model produces millions of permutations, evaluating them against human-defined metrics like thermal efficiency and views.' },
            { phase: '03. Human Curation', desc: 'Architects select, refine, and imbue emotional, cultural, or conceptual meaning into the generated geometries.' },
            { phase: '04. Predictive Fabrication', desc: 'Designs are seamlessly converted into precise CNC, robotic assembly, and 3D printing toolpaths.' }
          ].map((item, id) => (
            <motion.div 
              key={id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: id * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.5rem',
                background: 'var(--bg-card)',
                padding: '1.5rem 2rem',
                border: '3px solid var(--border-color)',
                boxShadow: '4px 4px 0px var(--accent-black)'
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--accent-red)', fontSize: '1.2rem', minWidth: '220px' }}>
                {item.phase}
              </div>
              <div style={{ color: 'var(--text-main)', opacity: 0.9, lineHeight: 1.6 }}>
                {item.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
