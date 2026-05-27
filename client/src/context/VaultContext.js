import React, { createContext, useContext, useState, useCallback } from 'react';
import { vaultService } from '../services/api';

const VaultContext = createContext(null);

export const VaultProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await vaultService.getEntries();
      setEntries(res.data.entries);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch entries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revealEntry = useCallback(async (id) => {
    const res = await vaultService.revealEntry(id);
    return res.data.entry;
  }, []);

  const createEntry = useCallback(async (data) => {
    const res = await vaultService.createEntry(data);
    setEntries(prev => [res.data.entry, ...prev]);
    return res.data.entry;
  }, []);

  const updateEntry = useCallback(async (id, data) => {
    const res = await vaultService.updateEntry(id, data);
    setEntries(prev => prev.map(e => e._id === id ? res.data.entry : e));
    if (selectedEntry?._id === id) setSelectedEntry(res.data.entry);
    return res.data.entry;
  }, [selectedEntry]);

  const deleteEntry = useCallback(async (id) => {
    await vaultService.deleteEntry(id);
    setEntries(prev => prev.filter(e => e._id !== id));
    if (selectedEntry?._id === id) setSelectedEntry(null);
  }, [selectedEntry]);

  const getSecurityAnalysis = useCallback(async () => {
    const res = await vaultService.getSecurityAnalysis();
    return res.data.analysis;
  }, []);

  return (
    <VaultContext.Provider value={{
      entries,
      selectedEntry,
      isLoading,
      error,
      setSelectedEntry,
      fetchEntries,
      revealEntry,
      createEntry,
      updateEntry,
      deleteEntry,
      getSecurityAnalysis,
    }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) throw new Error('useVault must be used within VaultProvider');
  return context;
};
