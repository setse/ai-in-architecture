import React from 'react';
import { motion } from 'framer-motion';
import { Network, Layers, Sparkles, Binary, Building2, Trees } from 'lucide-react';

const topics = [
  {
    icon: <Sparkles size={32} color="var(--accent-cyan)" />,
    title: 'Generative Design',
    desc: 'Algorithms rapidly iterate through thousands of spatial configurations based on sunlight, wind, and zoning constraints to find the optimal footprint.'
  },
  {
    icon: <Layers size={32} color="var(--accent-blue)" />,
    title: 'Parametric Workflows',
    desc: 'Complex variable-driven geometry where changing a single rule dynamically updates the entire architectural model.'
  },
  {
    icon: <Binary size={32} color="var(--accent-cyan)" />,
    title: 'Simulation & Analysis',
    desc: 'Predictive modeling anticipates load distribution, material stresses, and seismic vulnerabilities long before physical construction begins.'
  },
  {
    icon: <Trees size={32} color="var(--accent-blue)" />,
    title: 'Sustainable Optimization',
    desc: 'AI accurately models energy consumption, carbon footprints, and thermal behavior, paving the way for truly net-zero structures.'
  },
  {
    icon: <Network size={32} color="var(--accent-cyan)" />,
    title: 'Smart Buildings',
    desc: 'Integrating neural networks into the IoT of the building itself, creating responsive environments that adapt to human presence.'
  },
  {
    icon: <Building2 size={32} color="var(--accent-blue)" />,
    title: 'Automated Documentation',
    desc: 'Say goodbye to tedious compliance checks. Deep learning models auto-annotate schematics and verify civic codes instantly.'
  }
];

export default function KeyTopics() {
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
            Key Capabilities
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Explore the core pillars of computational architecture and how machine learning elevates every phase of design.
          </motion.p>
        </div>

        <div className="grid">
          {topics.map((item, idx) => (
            <motion.div 
              key={idx}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '1rem', background: 'rgba(0, 229, 255, 0.05)', borderRadius: '12px' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
