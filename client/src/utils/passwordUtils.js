/**
 * Calculates password strength score and label.
 * Single Responsibility: password analysis only.
 */
export const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Weak', color: '#ef4444' };

  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 10;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  score = Math.min(score, 100);

  let label = 'Weak';
  let color = '#ef4444';
  if (score >= 80) { label = 'Impenetrable'; color = '#22c55e'; }
  else if (score >= 60) { label = 'Strong'; color = '#22c55e'; }
  else if (score >= 40) { label = 'Fair'; color = '#eab308'; }

  return { score, label, color };
};

/**
 * Returns color for a given strength label
 */
export const getStrengthColor = (label) => {
  switch (label) {
    case 'Impenetrable':
    case 'Strong': return '#22c55e';
    case 'Fair': return '#eab308';
    default: return '#ef4444';
  }
};

/**
 * Returns score percentage for a given strength label (used in Security page)
 */
export const getStrengthScore = (label) => {
  switch (label) {
    case 'Impenetrable': return 100;
    case 'Strong': return 75;
    case 'Fair': return 45;
    default: return 20;
  }
};
