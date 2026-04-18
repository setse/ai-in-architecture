/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React from 'react';


export default function Future() {
  return (
    <section style={{ padding: '12rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Stark circular background element */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '50vw', height: '50vw', background: 'var(--accent-yellow)', borderRadius: '50%',
        zIndex: 0, pointerEvents: 'none', border: '3px solid var(--accent-black)'
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', background: 'var(--bg-main)', padding: '5rem', border: '3px solid var(--border-color)', boxShadow: '8px 8px 0px var(--accent-black)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="gradient-text-secondary" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-2px' }}>
            A New Paradigm
          </h2>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
            The future of architecture is not about machines replacing architects. It is about human intellect amplified by computational power. Together, we will build cities that breathe, structures that learn, and spaces that profoundly elevate the human experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
