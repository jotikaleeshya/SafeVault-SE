import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/common/PasswordInput';
import CannotChangePasswordModal from '../components/modals/CannotChangePasswordModal';
import './LoginPage.css';
import { authService } from '../services/api';
import { calculatePasswordStrength } from '../utils/passwordUtils';
import WeakPasswordModal from '../components/modals/WeakPasswordModal';
import StrengthBar from '../components/common/StrengthBar';

/**
 * LoginPage - entry point for user authentication
 * Single Responsibility: login/register form handling
 */
const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', masterPassword: '' });
  const [trustDevice, setTrustDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCannotChangeModal, setShowCannotChangeModal] = useState(false);
  const [showWeakPasswordModal, setShowWeakPasswordModal] = useState(false);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleRegisterSubmit = async () => {
    if (!form.email || !form.masterPassword) {
      setError('Email and master password are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.masterPassword.length < 8) {
      setError('Master password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(form.masterPassword)) {
      setError('Master password must contain at least one uppercase letter.');
      return;
    }
    if (!/[a-z]/.test(form.masterPassword)) {
      setError('Master password must contain at least one lowercase letter.');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(form.masterPassword)) {
      setError('Master password must contain at least one special character.');
      return;
    }
    
    const { score } = calculatePasswordStrength(form.masterPassword);
    if (score < 40) {
      setShowWeakPasswordModal(true);
      return;
    }
    setShowCannotChangeModal(true);
  };

  const handleWeakPasswordContinue = () => {
    setShowWeakPasswordModal(false);
    setShowCannotChangeModal(true);
  };

  const handleCannotChangeConfirm = () => {
    setShowCannotChangeModal(false);
    executeRegister();
  };

  const executeRegister = async () => {
    setIsLoading(true);
    setError('');
    try {
      await register(form.email, form.masterPassword);
      localStorage.setItem('safevault_email', form.email);
      if (trustDevice) {
        let deviceId = localStorage.getItem('safevault_device_id');
        if (!deviceId) {
          deviceId = crypto.randomUUID();
          localStorage.setItem('safevault_device_id', deviceId);
        }
        await authService.trustDevice(deviceId);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (mode === 'login') {
      if (!form.email || !form.masterPassword) {
        setError('Email and master password are required.');
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        await login(form.email, form.masterPassword, trustDevice);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      handleRegisterSubmit();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="login-page">
      {/* Ambient background */}
      <div className="login-bg-glow login-bg-glow--1" />
      <div className="login-bg-glow login-bg-glow--2" />

      <div className="login-content">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="login-logo-name">SafeVault</h1>
          <p className="login-logo-sub">Personal Vault</p>
        </div>

        {/* Card */}
        <div className="login-card" onKeyDown={handleKeyDown}>
          {error && (
            <div className="login-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          <div className="login-field">
            <label className="login-label">EMAIL ADDRESS</label>
            <div className="login-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="login-input-icon">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                className="login-input"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange('email')}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-field">
            <div className="login-label-row">
              <label className="login-label">MASTER PASSWORD</label>
            </div>
            <PasswordInput
              value={form.masterPassword}
              onChange={handleChange('masterPassword')}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder='Master Password'
            />
          </div>

          
          {mode === 'register' && form.masterPassword && (
            <StrengthBar password={form.masterPassword} />
          )}
          
          
          <label className="login-trust">
            <input
              type="checkbox"
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
              className="login-trust-checkbox"
            />
            Trust this device for 30 days
          </label>
          

          <button
            className="login-submit-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? (mode === 'login' ? 'Logging In...' : 'Creating Vault...')
              : (mode === 'login' ? 'Log In →' : 'Create Vault →')
            }
          </button>

          <div className="login-divider" />

          <div className="login-secured">
            <div className="login-secured-dot" />
            SECURED WITH AES-256
          </div>

          <p className="login-switch">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button className="login-switch-btn" onClick={() => setMode('register')}>
                  Create Vault
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button className="login-switch-btn" onClick={() => setMode('login')}>
                  Log In
                </button>
              </>
            )}
          </p>
        </div>

        {/* Page indicator */}
        <div className="login-page-indicator">
          <div className="login-indicator active" />
          <div className="login-indicator" />
          <div className="login-indicator" />
        </div>
      </div>

      <footer className="login-footer">
        © 2026 SAFEVAULT SECURITY SYSTEMS. ALL RIGHTS RESERVED.
      </footer>

      {showWeakPasswordModal && (
        <WeakPasswordModal
          password={form.masterPassword}
          onClose={() => setShowWeakPasswordModal(false)}
          onConfirm={handleWeakPasswordContinue}
        />
      )}

      {showCannotChangeModal && (
        <CannotChangePasswordModal 
          onClose={() => setShowCannotChangeModal(false)} 
          onConfirm={handleCannotChangeConfirm} 
        />
      )}
    </div>
  );
};

export default LoginPage;
