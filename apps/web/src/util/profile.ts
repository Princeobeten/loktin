export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface NotificationPreferences {
  emailOnPayment: boolean;
  emailOnDueSoon: boolean;
  emailMonthlySummary: boolean;
}

const PROFILE_STORAGE_KEY = 'lockedin_user_profile';
const NOTIFICATION_PREFS_KEY = 'lockedin_notification_prefs';

// Profile Management
export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
}

export function updateProfile(updates: Partial<UserProfile>): UserProfile | null {
  const current = getProfile();
  if (!current) {
    // If no profile exists, create a new one with the updates
    const newProfile: UserProfile = {
      name: updates.name || '',
      email: updates.email || '',
      avatar: updates.avatar
    };
    saveProfile(newProfile);
    return newProfile;
  }

  const updated = { ...current, ...updates };
  saveProfile(updated);
  return updated;
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
}

// Notification Preferences Management
export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
}

export function getNotificationPreferences(): NotificationPreferences {
  try {
    const stored = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (!stored) {
      // Default preferences
      return {
        emailOnPayment: true,
        emailOnDueSoon: true,
        emailMonthlySummary: false
      };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading notification preferences:', error);
    return {
      emailOnPayment: true,
      emailOnDueSoon: true,
      emailMonthlySummary: false
    };
  }
}

export function updateNotificationPreferences(updates: Partial<NotificationPreferences>): NotificationPreferences {
  const current = getNotificationPreferences();
  const updated = { ...current, ...updates };
  saveNotificationPreferences(updated);
  return updated;
}

export function clearNotificationPreferences(): void {
  localStorage.removeItem(NOTIFICATION_PREFS_KEY);
}
