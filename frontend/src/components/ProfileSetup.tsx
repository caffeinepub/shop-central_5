import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { PENDING_PHONE_KEY } from './AuthGuard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Phone } from 'lucide-react';

export default function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Pre-populate phone from sessionStorage when modal appears
  useEffect(() => {
    if (showProfileSetup) {
      const pendingPhone = sessionStorage.getItem(PENDING_PHONE_KEY);
      if (pendingPhone) {
        setPhone(pendingPhone);
      }
    }
  }, [showProfileSetup]);

  const validatePhone = (value: string): boolean => {
    const cleaned = value.replace(/\s+/g, '');
    if (!cleaned) {
      setPhoneError('Phone number is required');
      return false;
    }
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleaned)) {
      setPhoneError('Enter a valid 10-digit phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const cleanedPhone = phone.replace(/\s+/g, '');
    if (!validatePhone(cleanedPhone)) return;

    await saveProfile.mutateAsync({
      name: name.trim(),
      phoneNumber: cleanedPhone,
    });

    // Clear the pending phone from sessionStorage
    sessionStorage.removeItem(PENDING_PHONE_KEY);
  };

  if (!showProfileSetup) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-medium max-w-md w-full p-6 space-y-5 border border-border">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground font-heading">Complete Your Profile</h2>
          <p className="text-muted-foreground text-sm">Just a few details to get you started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Your Name
            </Label>
            <Input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              autoFocus
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-phone" className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              Phone Number
            </Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 bg-muted border border-input rounded-lg text-sm text-muted-foreground font-medium shrink-0">
                🇮🇳 +91
              </div>
              <Input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError('');
                }}
                placeholder="9876543210"
                maxLength={13}
                className={phoneError ? 'border-destructive' : ''}
              />
            </div>
            {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={saveProfile.isPending || !name.trim()}
          >
            {saveProfile.isPending ? 'Saving...' : 'Start Shopping'}
          </Button>
        </form>
      </div>
    </div>
  );
}
