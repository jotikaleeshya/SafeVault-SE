import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import './HelpPage.css';

/**
 * HelpPage - help, FAQ, and support contact
 * Single Responsibility: display help content and support info
 */
const HelpPage = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      label: 'How do I add a new password?',
      desc: 'Tap the "+ Add Entry" button on the bottom left sidebar to save a new credential.',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      label: 'Is my data safe?',
      desc: 'Yes. All entries are encrypted with AES-256 before leaving your device. We never see your passwords.',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      ),
      label: 'I forgot my master password. What now?',
      desc: 'For security reasons, master passwords cannot be recovered. Please contact us so we can assist you.',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      label: 'How do I check my password health?',
      desc: 'Go to the Security page from the sidebar to view weak, reused, or compromised passwords.',
    },
  ];

  return (
    <div className="help-layout">
      <Sidebar />
      <div className="help-main">
        <button className="help-back-btn" onClick={() => navigate('/settings')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 5 5 12 12 19" />
          </svg>
          Back
        </button>

        <div className="help-body">

          {/* Hero card */}
          <div className="help-hero">
            <div className="help-hero-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <div className="help-hero-text">
              <h1 className="help-title">Help Center</h1>
              <p className="help-tagline">We're here to help you stay secure.</p>
            </div>
          </div>

          {/* Description */}
          <div className="help-card">
            <p className="help-description">
              Find answers to common questions below. If you need further assistance,
              don't hesitate to reach out to our support team directly via email.
            </p>
          </div>

          {/* FAQs */}
          <div className="help-section-label">FREQUENTLY ASKED</div>
          <div className="help-features">
            {faqs.map((f) => (
              <div key={f.label} className="help-feature-row">
                <div className="help-feature-icon">{f.icon}</div>
                <div>
                  <div className="help-feature-name">{f.label}</div>
                  <div className="help-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="help-section-label">NEED MORE HELP?</div>
          <div className="help-contact-card">
            <div className="help-contact-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <div className="help-contact-label">Email Support</div>
              <a href="mailto:safevault@gmail.com" className="help-contact-email">
                safevault@gmail.com
              </a>
            </div>
          </div>

          <p className="help-footer-note">We usually respond within 24 hours. Your privacy is our priority.</p>

        </div>
      </div>
    </div>
  );
};

export default HelpPage;
