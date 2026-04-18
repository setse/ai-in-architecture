/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React from 'react';

import { CheckCircle2, AlertTriangle } from 'lucide-react';

const benefits = [
  "Rapid iteration and ideation",
  "Optimized building performance",
  "Material waste reduction",
  "Automated compliance checking",
  "Enhanced structural integrity"
];

const challenges = [
  "Data privacy and security",
  "High computational costs",
  "Learning curve for traditional firms",
  "Algorithmic bias in generative models",
  "Intellectual property concerns"
];

export default function BenefitsChallenges() {
  return (
    <section>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          
          <motion.div 
            style={{ flex: '1 1 400px' }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>The Upside</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {benefits.map((item, id) => (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle2 color="var(--accent-blue)" size={24} />
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            style={{ flex: '1 1 400px', background: 'var(--bg-card)', padding: '3rem', borderRadius: '24px', border: '1px solid var(--border-card)' }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>The Challenges</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {challenges.map((item, id) => (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <AlertTriangle color="var(--accent-purple)" size={24} />
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
