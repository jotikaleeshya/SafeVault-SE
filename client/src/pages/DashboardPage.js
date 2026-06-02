import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ViewPasswordModal from '../components/modals/ViewPasswordModal';
import AddEntryModal from '../components/modals/AddEntryModal';
import EditEntryModal from '../components/modals/EditEntryModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import SuccessModal from '../components/modals/SuccessModal';
import SiteFavicon from '../components/common/SiteFavicon';
import { useVault } from '../context/VaultContext';
import { getStrengthColor, getStrengthScore } from '../utils/passwordUtils';
import './DashboardPage.css';

/**
 * DashboardPage - main vault view
 * Orchestrates: entry list, detail panel, and modal flows
 */
const DashboardPage = () => {
  const location = useLocation();
  const {
    entries,
    selectedEntry,
    isLoading,
    fetchEntries,
    setSelectedEntry,
    revealEntry,
  } = useVault();

  const [searchQuery, setSearchQuery] = useState('');
  const [revealedEntry, setRevealedEntry] = useState(null);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Modal states
  const [modal, setModal] = useState(null);
  // modal types: 'view-gate' | 'add' | 'edit' | 'delete' | 'success-save' | 'success-delete'

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Support opening add modal from sidebar
  useEffect(() => {
    if (location.state?.openAddModal) {
      setModal('add');
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const filteredEntries = entries.filter(e =>
    e.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectEntry = useCallback(async (entry) => {
  // Kalau klik entry yang sama, tidak perlu apa-apa
  if (selectedEntry?._id === entry._id && revealedEntry) return;

  setSelectedEntry(entry);
  setVisiblePassword(false);
  setCopiedField(null);

  if (isUnlocked) {
    try {
      const full = await revealEntry(entry._id);
      setRevealedEntry(full);
    } catch {
      setModal('view-gate');
    }
  } else {
    setRevealedEntry(null);
    setModal('view-gate');
  }
}, [setSelectedEntry, revealEntry, isUnlocked, selectedEntry, revealedEntry]);

  const handleMasterVerified = useCallback(async () => {
    if (!selectedEntry) return;
    try {
      const full = await revealEntry(selectedEntry._id);
      setRevealedEntry(full);
      setIsUnlocked(true); // unlock untuk sesi ini
      setModal(null);
    } catch {
      setModal(null);
    }
  }, [selectedEntry, revealEntry]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const closeModal = () => setModal(null);

  const handleAddSuccess = () => setModal('success-save');
  const handleEditSuccess = (updatedEntry) => {
    if (updatedEntry) {
      setRevealedEntry(prev => ({ ...prev, ...updatedEntry, password: prev.password }));
    }
    setModal('success-save');
  };
  const handleDeleteSuccess = () => {
    setRevealedEntry(null);
    setModal('success-delete');
  };
  const handleSuccessClose = () => {
    setModal(null);
    fetchEntries();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar onSearch={setSearchQuery} searchValue={searchQuery} />

        <div className={`dashboard-body ${revealedEntry ? 'dashboard-body--with-detail' : ''}`}>
          {/* Entry list */}
          <div className="dashboard-list-panel">
            <div className="dashboard-list-header">
              <span className="dashboard-list-title">RECENT ITEMS</span>
              <span className="dashboard-list-count">{entries.length} Entries</span>
            </div>

            {isLoading ? (
              <div className="dashboard-empty">Loading...</div>
            ) : filteredEntries.length === 0 ? (
              <div className="dashboard-empty">
                {searchQuery ? 'No results found.' : 'No entries yet. Add one!'}
              </div>
            ) : (
              <div className="dashboard-list">
                {filteredEntries.map(entry => (
                  <button
                    key={entry._id}
                    className={`dashboard-entry-row ${selectedEntry?._id === entry._id ? 'active' : ''}`}
                    onClick={() => handleSelectEntry(entry)}
                  >
                    <SiteFavicon siteName={entry.siteName} siteURL={entry.siteURL} size={40} />
                    <div className="dashboard-entry-info">
                      <span className="dashboard-entry-name">{entry.siteName}</span>
                      <span className="dashboard-entry-user">
                        {entry.username}
                        <span className="dashboard-entry-dots"> · ··········</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {revealedEntry && (
            <div className="dashboard-detail-panel">
              <div className="detail-header">
                <SiteFavicon siteName={revealedEntry.siteName} siteURL={revealedEntry.siteURL} size={60} />
                <div className="detail-header-info">
                  <h2 className="detail-site-name">{revealedEntry.siteName}</h2>
                  {revealedEntry.siteURL && (
                    <a href={`https://${revealedEntry.siteURL}`} target="_blank" rel="noreferrer" className="detail-site-url">
                      {revealedEntry.siteURL}
                    </a>
                  )}
                </div>
                <div className="detail-header-actions">
                  <button
                    className="detail-action-btn"
                    onClick={() => setModal('edit')}
                    title="Edit"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    className="detail-action-btn detail-action-btn--delete"
                    onClick={() => setModal('delete')}
                    title="Delete"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="detail-section">
                <label className="detail-label">USERNAME/EMAIL</label>
                <div className="detail-field-row">
                  <span className="detail-field-value">{revealedEntry.username}</span>
                  <button
                    className={`detail-copy-btn ${copiedField === 'username' ? 'copied' : ''}`}
                    onClick={() => handleCopy(revealedEntry.username, 'username')}
                    title="Copy"
                  >
                    {copiedField === 'username' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="detail-section">
                <label className="detail-label">PASSWORD</label>
                <div className="detail-field-row">
                  <span className="detail-field-value" style={{ letterSpacing: visiblePassword ? 'normal' : '2px' }}>
                    {visiblePassword ? revealedEntry.password : '••••••••'}
                  </span>
                  <div className="detail-field-actions">
                    <button
                      className="detail-copy-btn"
                      onClick={() => setVisiblePassword(v => !v)}
                      title={visiblePassword ? 'Hide' : 'Show'}
                    >
                      {visiblePassword ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                    <button
                      className={`detail-copy-btn ${copiedField === 'password' ? 'copied' : ''}`}
                      onClick={() => handleCopy(revealedEntry.password, 'password')}
                      title="Copy"
                    >
                      {copiedField === 'password' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="detail-meta-row">
                <div className="detail-meta-card">
                  <span className="detail-meta-label">STRENGTH</span>
                  <div className="detail-strength-bar">
                    <div
                      className="detail-strength-fill"
                      style={{
                        width: `${getStrengthScore(revealedEntry.passwordStrength)}%`,
                        background: getStrengthColor(revealedEntry.passwordStrength),
                      }}
                    />
                  </div>
                  <span className="detail-strength-label" style={{ color: getStrengthColor(revealedEntry.passwordStrength) }}>
                    {revealedEntry.passwordStrength}
                  </span>
                </div>
                <div className="detail-meta-card">
                  <span className="detail-meta-label">LAST MODIFIED</span>
                  <span className="detail-meta-value">
                    {new Date(revealedEntry.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {revealedEntry.notes && (
                <div className="detail-section">
                  <label className="detail-label">NOTES</label>
                  <div className="detail-notes">{revealedEntry.notes}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal === 'view-gate' && (
        <ViewPasswordModal
          onClose={closeModal}
          onVerified={handleMasterVerified}
        />
      )}
      {modal === 'add' && (
        <AddEntryModal
          onClose={closeModal}
          onSuccess={handleAddSuccess}
        />
      )}
      {modal === 'edit' && revealedEntry && (
        <EditEntryModal
          entry={revealedEntry}
          onClose={closeModal}
          onSuccess={handleEditSuccess}
        />
      )}
      {modal === 'delete' && revealedEntry && (
        <DeleteConfirmModal
          entryId={revealedEntry._id}
          onClose={closeModal}
          onSuccess={handleDeleteSuccess}
        />
      )}
      {(modal === 'success-save' || modal === 'success-delete') && (
        <SuccessModal
          type={modal === 'success-save' ? 'saved' : 'deleted'}
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
};

export default DashboardPage;
