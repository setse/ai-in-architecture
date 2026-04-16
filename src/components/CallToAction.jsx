import React from 'react';
import { motion } from 'framer-motion';

export default function CallToAction() {
  return (
    <section>
      <div className="container">
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0, 85, 255, 0.05))' }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.5rem' }}>Ready to embrace the algorithm?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Discover the definitive toolset required to integrate neural networks into your architectural practice today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="cta-button">View Documentation</button>
            <button className="cta-button secondary">Join the Beta</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
