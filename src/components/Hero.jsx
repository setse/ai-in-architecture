import { motion } from 'framer-motion';
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Float } from '@react-three/drei';

import { ArrowRight } from 'lucide-react';
import '../index.css';

function InteractiveCube() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0} floatIntensity={0}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        {/* Stark flat Bauhaus red */}
        <meshStandardMaterial color="#e32636" roughness={1} />
      </mesh>
      <mesh scale={[1.02, 1.02, 1.02]}>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        {/* Thick black outline effect */}
        <meshBasicMaterial color="#1a1a1a" wireframe />
      </mesh>
    </Float>
  );
}

export default function Hero({ onOpenAssembly }) {
  return (
    <header className="container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
      position: 'relative'
    }}>
      {/* Removed glowing blob background for stark Bauhaus aesthetic */}
      <div 
        style={{
          position: 'absolute',
          top: '30%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'var(--accent-yellow)',
          zIndex: '-1',
          border: '3px solid var(--accent-black)',
          boxShadow: '10px 10px 0px var(--accent-black)'
        }}
      ></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ flex: 1, maxWidth: '600px', zIndex: 2 }}
      >
        <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
          The Future of <br />
          <span className="gradient-text">Architectural Design</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Artificial intelligence is reshaping the built environment. From generative floor plans to optimized structural analysis, computational power is unlocking a new era of sustainable and visionary architecture.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="cta-button" 
            onClick={() => document.getElementById('introduction').scrollIntoView({ behavior: 'smooth' })}
          >
            Explore AI Workflows <ArrowRight size={20} />
          </button>
          {onOpenAssembly && (
            <button 
              className="cta-button secondary" 
              onClick={onOpenAssembly}
            >
              View 3D Assembly Demo
            </button>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        style={{ flex: 1, height: '600px', width: '100%', position: 'relative', zIndex: 2, cursor: 'grab' }}
      >
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
          {/* Stark high-contrast lighting */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 10]} intensity={2} />
          <InteractiveCube />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </motion.div>
    </header>
  );
}
