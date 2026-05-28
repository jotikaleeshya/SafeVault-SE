import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import './AboutPage.css';
import { useNavigate } from 'react-router-dom';

/**
 * AboutPage - app info, version, and credits
 * Single Responsibility: display static about content
 */
const AboutPage = () => {

  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      label: 'AES-256 Encryption',
      desc: 'Military-grade encryption for every entry',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      label: 'Zero-Knowledge',
      desc: 'Your master password never leaves your device',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      label: 'Password Health',
      desc: 'Monitor strength and spot weak credentials',
    },
  ];

  return (
    <div className="about-layout">
      <Sidebar />
      <div className="about-main">
         <button className="about-back-btn" onClick={() => navigate('/settings')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 5 5 12 12 19" />
            </svg>
            Back
          </button>
        <div className="about-body">

          {/* Hero card */}
          <div className="about-hero">
            <div className="about-hero-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="about-hero-text">
              <h1 className="about-title">SafeVault</h1>
              <p className="about-tagline">Your passwords, locked tight.</p>
            </div>
            <span className="about-version-badge">v1.0.0</span>
          </div>

          {/* Description */}
          <div className="about-card">
            <p className="about-description">
              SafeVault is a personal password manager built with security first.
              All your credentials are encrypted locally before ever reaching the server —
              meaning only you can access them.
            </p>
          </div>

          {/* Features */}
          <div className="about-section-label">WHAT'S INSIDE</div>
          <div className="about-features">
            {features.map((f) => (
              <div key={f.label} className="about-feature-row">
                <div className="about-feature-icon">{f.icon}</div>
                <div>
                  <div className="about-feature-name">{f.label}</div>
                  <div className="about-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stack */}
          <div className="about-section-label">BUILT WITH</div>
          <div className="about-stack">
            {['MongoDB', 'Express', 'React', 'Node.js'].map((tech) => (
              <span key={tech} className="about-stack-tag">{tech}</span>
            ))}
          </div>

          {/* Footer note */}
          <p className="about-footer-note">Made with care. Your privacy is the priority.</p>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;
