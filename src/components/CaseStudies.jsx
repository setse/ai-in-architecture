import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const cases = [
  {
    title: 'Biophilic Skyscraper',
    location: 'Singapore',
    image: '/case_study_1.png',
    desc: 'An AI-generated tower optimizing vertical green spaces to passively cool the environment.',
  },
  {
    title: 'Parametric Timber Museum',
    location: 'Oslo',
    image: '/case_study_2.png',
    desc: 'Complex gridshell structure resolved via machine learning to minimize material waste by 30%.',
  }
];

export default function CaseStudies() {
  return (
    <section>
      <div className="container">
        <div className="section-header-center">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Real-World Impact
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            See how algorithmic design transforms visionary concepts into physical reality.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
          {cases.map((cs, idx) => (
            <motion.div 
              key={idx}
              className="card"
              style={{ padding: 0 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={cs.image} 
                  alt={cs.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{cs.title}</h3>
                    <span style={{ color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.9rem' }}>{cs.location}</span>
                  </div>
                  <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', cursor: 'pointer' }}>
                    <ArrowUpRight size={20} color="var(--accent-cyan)" />
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>{cs.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
