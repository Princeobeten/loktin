import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '../hooks/useToast';
import { getProfile, updateProfile, getNotificationPreferences, updateNotificationPreferences, type UserProfile, type NotificationPreferences } from '../util/profile';
import { disconnectWallet } from '../util/wallet';

export default function Profile() {
  const { address } = useWallet();
  const toast = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(getNotificationPreferences());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', avatar: '' });

  useEffect(() => {
    const loadedProfile = getProfile();
    setProfile(loadedProfile);
    if (loadedProfile) {
      setEditForm({
        name: loadedProfile.name,
        email: loadedProfile.email,
        avatar: loadedProfile.avatar || ''
      });
    }
  }, []);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    if (profile) {
      setEditForm({
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar || ''
      });
    }
  };

  const handleSaveProfile = () => {
    if (!editForm.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!editForm.email.trim()) {
      toast.error('Email is required');
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const updated = updateProfile({
      name: editForm.name,
      email: editForm.email,
      avatar: editForm.avatar || undefined
    });
    setProfile(updated);
    setIsEditingProfile(false);
    toast.success('Profile updated successfully');
  };

  const handleNotificationToggle = (key: keyof NotificationPreferences) => {
    const updated = updateNotificationPreferences({ [key]: !notificationPrefs[key] });
    setNotificationPrefs(updated);
    toast.success('Notification preferences updated');
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      toast.success('Wallet disconnected successfully');
    } catch (error) {
      toast.error('Failed to disconnect wallet');
      console.error('Disconnect error:', error);
    }
  };

  return (
    <div className="container" style={{ padding: '24px 16px 100px 16px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Profile</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        Manage your account settings and preferences.
      </p>

      {!address ? (
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '48px 24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔌</div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
            Connect your wallet to view your profile
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Wallet Info Card */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-primary)' }}>
              Wallet Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  Connected Address
                </label>
                <div style={{
                  padding: '12px',
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: 'var(--color-primary)',
                  wordBreak: 'break-all'
                }}>
                  {address}
                </div>
              </div>
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(0, 217, 179, 0.05)',
                border: '1px solid rgba(0, 217, 179, 0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ fontSize: '18px' }}>✓</div>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  Wallet connected to Stellar Testnet
                </span>
              </div>
              <button
                onClick={handleDisconnect}
                style={{
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ef4444',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'var(--transition-base)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
              >
                Disconnect Wallet
              </button>
            </div>
          </div>

          {/* Personal Information Card */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Personal Information
              </h2>
              {!isEditingProfile && (
                <button
                  onClick={handleEditProfile}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--color-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'var(--transition-base)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Avatar Preview */}
              {(isEditingProfile ? editForm.avatar : profile?.avatar) && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <img
                    src={isEditingProfile ? editForm.avatar : profile?.avatar}
                    alt="Avatar"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--color-border)'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Name Field */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  Name {isEditingProfile && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                      transition: 'var(--transition-base)'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                  />
                ) : (
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)'
                  }}>
                    {profile?.name || 'Not set'}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  Email {isEditingProfile && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                {isEditingProfile ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="Enter your email"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                      transition: 'var(--transition-base)'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                  />
                ) : (
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)'
                  }}>
                    {profile?.email || 'Not set'}
                  </div>
                )}
              </div>

              {/* Avatar URL Field */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  Avatar URL <span style={{ fontSize: '12px', fontWeight: 400 }}>(optional)</span>
                </label>
                {isEditingProfile ? (
                  <input
                    type="url"
                    value={editForm.avatar}
                    onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                      transition: 'var(--transition-base)'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                  />
                ) : (
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                    wordBreak: 'break-all'
                  }}>
                    {profile?.avatar || 'Not set'}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditingProfile && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={handleSaveProfile}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: 'var(--color-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'var(--transition-base)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'var(--transition-base)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notification Preferences Card */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-primary)' }}>
              Notification Preferences
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Email on Payment */}
              <div style={{
                padding: '16px',
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Payment Notifications
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Get notified when a payment is made
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.emailOnPayment}
                    onChange={() => handleNotificationToggle('emailOnPayment')}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: notificationPrefs.emailOnPayment ? 'var(--color-primary)' : 'var(--color-border)',
                    transition: 'var(--transition-base)',
                    borderRadius: '24px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: notificationPrefs.emailOnPayment ? '27px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: 'var(--transition-base)',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>

              {/* Email on Due Soon */}
              <div style={{
                padding: '16px',
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Due Date Reminders
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Get notified when a bill is due soon
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.emailOnDueSoon}
                    onChange={() => handleNotificationToggle('emailOnDueSoon')}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: notificationPrefs.emailOnDueSoon ? 'var(--color-primary)' : 'var(--color-border)',
                    transition: 'var(--transition-base)',
                    borderRadius: '24px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: notificationPrefs.emailOnDueSoon ? '27px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: 'var(--transition-base)',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>

              {/* Email Monthly Summary */}
              <div style={{
                padding: '16px',
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                    Monthly Summary
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Receive a monthly summary of your bills
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.emailMonthlySummary}
                    onChange={() => handleNotificationToggle('emailMonthlySummary')}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: notificationPrefs.emailMonthlySummary ? 'var(--color-primary)' : 'var(--color-border)',
                    transition: 'var(--transition-base)',
                    borderRadius: '24px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: notificationPrefs.emailMonthlySummary ? '27px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: 'var(--transition-base)',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* About Card */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-primary)' }}>
              About
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Version</span>
                <span style={{ fontSize: '14px', color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>1.0.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Network</span>
                <span style={{ fontSize: '14px', color: 'var(--color-primary)' }}>Testnet</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Contract</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontFamily: 'monospace' }}>LockedIn v1</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
