import React from 'react';

export default function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-card)', 
      padding: '4rem 0', 
      background: 'rgba(0,0,0,0.5)',
      color: 'var(--text-muted)'
    }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '3rem', marginBottom: '3rem' }}>
          
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>AI in Architecture</h3>
            <p style={{ maxWidth: '300px', fontSize: '0.9rem' }}>
              Exploring the intersection of human creativity and computational power.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Platform</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0 }}>
                <li><a href="#">Generative Design</a></li>
                <li><a href="#">Simulation</a></li>
                <li><a href="#">Optimization</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Resources</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0 }}>
                <li><a href="#">Case Studies</a></li>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API Access</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Company</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0 }}>
                <li><a href="#">About</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>

        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-card)', paddingTop: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} AI In Architecture. Designed by Sets.</p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
