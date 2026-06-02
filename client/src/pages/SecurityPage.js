import React, { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import SiteFavicon from '../components/common/SiteFavicon';
import { useVault } from '../context/VaultContext';
import { getStrengthColor, getStrengthScore } from '../utils/passwordUtils';
import './SecurityPage.css';

/**
 * SecurityPage - displays password strength analysis
 * Single Responsibility: security reporting view
 */
const SecurityPage = () => {
  const { getSecurityAnalysis } = useVault();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSecurityAnalysis();
        setAnalysis(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [getSecurityAnalysis]);

  const circumference = 2 * Math.PI * 80; 
  const strokeDashoffset = analysis
    ? circumference - (analysis.overallScore / 100) * circumference
    : circumference;

  return (
    <div className="security-layout">
      <Sidebar />
      <div className="security-main">
        <div className="security-body">
          {isLoading ? (
            <div className="security-loading">Loading security analysis...</div>
          ) : analysis ? (
            <>
              {/* Score + Summary */}
              <div className="security-overview">
                <div className="security-score-ring">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <circle
                      cx="100" cy="100" r="80"
                      fill="none"
                      stroke="url(#scoreGrad)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 100 100)"
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4f73ff" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="security-score-center">
                    <span className="security-score-label">Security Score</span>
                    <span className="security-score-value">{analysis.overallScore}%</span>
                  </div>
                </div>

                <div className="security-summary">
                  <div className="security-summary-row">
                    <span className="security-summary-label" style={{ color: '#22c55e' }}>Strong</span>
                    <div className="security-summary-bar">
                      <div className="security-summary-fill" style={{
                        width: `${(analysis.strong / (analysis.strong + analysis.weak + analysis.risk || 1)) * 100}%`,
                        background: '#22c55e',
                      }} />
                    </div>
                    <span className="security-summary-count">{analysis.strong} {analysis.strong === 1 ? 'entry' : 'entries'}</span>
                  </div>
                  <div className="security-summary-row">
                    <span className="security-summary-label" style={{ color: '#eab308' }}>Medium</span>
                    <div className="security-summary-bar">
                      <div className="security-summary-fill" style={{
                        width: `${(analysis.weak / (analysis.strong + analysis.weak + analysis.risk || 1)) * 100}%`,
                        background: '#eab308',
                      }} />
                    </div>
                    <span className="security-summary-count">{analysis.weak} {analysis.weak === 1 ? 'entry' : 'entries'}</span>
                  </div>
                  <div className="security-summary-row">
                    <span className="security-summary-label" style={{ color: '#ef4444' }}>Weak</span>
                    <div className="security-summary-bar">
                      <div className="security-summary-fill" style={{
                        width: `${(analysis.risk / (analysis.strong + analysis.weak + analysis.risk || 1)) * 100}%`,
                        background: '#ef4444',
                      }} />
                    </div>
                    <span className="security-summary-count">{analysis.risk} {analysis.risk === 1 ? 'entry' : 'entries'}</span>
                  </div>
                </div>
              </div>

              {/* Entry list + sidebar */}
              <div className="security-content">
                <div className="security-entries">
                  {analysis.entries.map(entry => (
                    <div
                      key={entry._id}
                      className="security-entry-row"
                    >
                      <SiteFavicon siteName={entry.siteName} size={36} />
                      <div className="security-entry-info">
                        <span className="security-entry-name">{entry.siteName}</span>
                        <span className="security-entry-user">{entry.username}</span>
                      </div>
                      <div className="security-entry-bar-wrap">
                        <div className="security-entry-bar">
                          <div
                            className="security-entry-bar-fill"
                            style={{
                              width: `${getStrengthScore(entry.passwordStrength)}%`,
                              background: getStrengthColor(entry.passwordStrength),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="security-loading">No data available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
