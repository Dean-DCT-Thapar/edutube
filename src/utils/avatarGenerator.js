export const AVATAR_STORAGE_KEY = 'studentAvatarVariant';
export const AVATAR_UPDATED_EVENT = 'studentAvatarUpdated';

export const AVATAR_PRESETS = [
  { id: 'sunset', label: 'Sunset', cssGradient: 'linear-gradient(135deg, #fb923c 0%, #f43f5e 100%)' },
  { id: 'ocean', label: 'Ocean', cssGradient: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)' },
  { id: 'forest', label: 'Forest', cssGradient: 'linear-gradient(135deg, #10b981 0%, #15803d 100%)' },
  { id: 'violet', label: 'Violet', cssGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7e22ce 100%)' },
  { id: 'lava', label: 'Lava', cssGradient: 'linear-gradient(135deg, #ef4444 0%, #ea580c 100%)' },
  { id: 'sky', label: 'Sky', cssGradient: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)' },
  { id: 'mint', label: 'Mint', cssGradient: 'linear-gradient(135deg, #2dd4bf 0%, #059669 100%)' },
  { id: 'slate', label: 'Slate', cssGradient: 'linear-gradient(135deg, #64748b 0%, #374151 100%)' }
];

const hashString = (input = '') => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const getInitials = (name = '', email = '') => {
  const normalizedName = (name || '').trim();
  if (normalizedName) {
    const words = normalizedName.split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase();
  }
  const mailPrefix = (email || '').split('@')[0];
  return mailPrefix.slice(0, 2).toUpperCase() || 'U';
};

export const getDefaultAvatarVariant = (seed = '') => {
  const idx = hashString(seed || 'student') % AVATAR_PRESETS.length;
  return AVATAR_PRESETS[idx].id;
};

export const getAvatarPreset = (variantId) => {
  return AVATAR_PRESETS.find((preset) => preset.id === variantId) || AVATAR_PRESETS[0];
};

export const getAvatarStyle = (variantId) => {
  const preset = getAvatarPreset(variantId);
  return { backgroundImage: preset.cssGradient };
};

export const isValidAvatarVariant = (variantId) => {
  return AVATAR_PRESETS.some((preset) => preset.id === variantId);
};

export const getStoredAvatarVariant = () => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
  if (!stored) return null;
  return AVATAR_PRESETS.some((preset) => preset.id === stored) ? stored : null;
};

export const saveAvatarVariant = (variantId) => {
  if (typeof window === 'undefined') return;
  if (!variantId) {
    localStorage.removeItem(AVATAR_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AVATAR_UPDATED_EVENT, { detail: null }));
    return;
  }
  if (!isValidAvatarVariant(variantId)) return;
  localStorage.setItem(AVATAR_STORAGE_KEY, variantId);
  window.dispatchEvent(new CustomEvent(AVATAR_UPDATED_EVENT, { detail: variantId }));
};

export const resolveAvatarVariant = ({ id, name, email } = {}) => {
  const stored = getStoredAvatarVariant();
  if (stored) return stored;
  return getDefaultAvatarVariant(`${id || ''}:${name || ''}:${email || ''}`);
};

