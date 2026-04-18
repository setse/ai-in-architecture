/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React from 'react';


const platforms = [
  { name: 'Midjourney & Stable Diffusion', use: 'Concept Ideation' },
  { name: 'Spacemaker (Autodesk)', use: 'Site & Masterplanning' },
  { name: 'Hypar', use: 'Parametric Generation' },
  { name: 'Testfit', use: 'Feasibility & Yield Analysis' },
  { name: 'Midjourney', use: 'Concept Art' },
  { name: 'Veras', use: 'Render Visualization' },
];

export default function ToolsPlatforms() {
  return (
    <section style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--border-card)', borderBottom: '1px solid var(--border-card)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '3rem' }}>Powered by Industry-Leading Algorithms</h2>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          justifyContent: 'center',
          maxWidth: '900px',
          margin: '0 auto' 
        }}>
          {platforms.map((tool, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              style={{
                padding: '1rem 2rem',
                background: 'var(--bg-card)',
                border: '3px solid var(--border-color)',
                boxShadow: '4px 4px 0px var(--accent-black)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                cursor: 'default',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '6px 6px 0px var(--accent-red)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0px, 0px)';
                e.currentTarget.style.boxShadow = '4px 4px 0px var(--accent-black)';
              }}
            >
              <span style={{ fontWeight: 700, color: 'var(--text-main)', textTransform: 'lowercase' }}>{tool.name}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tool.use}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
