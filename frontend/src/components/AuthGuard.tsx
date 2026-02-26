import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Phone, Loader2, ShoppingBag } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthGuardProps {
  children: ReactNode;
}

export const PENDING_PHONE_KEY = 'shop_central_pending_phone';

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, login, loginStatus, isInitializing } = useInternetIdentity();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const isLoggingIn = loginStatus === 'logging-in';

  const validatePhone = (value: string): boolean => {
    const cleaned = value.replace(/\s+/g, '');
    if (!cleaned) {
      setPhoneError('Phone number is required');
      return false;
    }
    // Accept 10-digit Indian numbers or with +91 prefix
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
    const cleaned = phone.replace(/\s+/g, '');
    if (!validatePhone(cleaned)) return;

    // Store phone number temporarily so ProfileSetup can use it
    sessionStorage.setItem(PENDING_PHONE_KEY, cleaned);

    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      sessionStorage.removeItem(PENDING_PHONE_KEY);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-sm w-full space-y-8">
          {/* Logo / Branding */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <img
                src="/assets/generated/logo.dim_200x80.png"
                alt="Shop Central"
                className="h-14 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-foreground font-heading">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Enter your phone number to continue shopping</p>
          </div>

          {/* Phone Login Card */}
          <div className="bg-card border border-border rounded-2xl shadow-medium p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <span>Login with Phone Number</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-muted border border-input rounded-lg text-sm text-muted-foreground font-medium shrink-0">
                    🇮🇳 +91
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="9876543210"
                    maxLength={13}
                    className={phoneError ? 'border-destructive focus-visible:ring-destructive' : ''}
                    disabled={isLoggingIn}
                    autoFocus
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-destructive">{phoneError}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                size="lg"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Continue Shopping
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              Your phone number is used to identify your account and orders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
