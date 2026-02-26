import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';

export default function LoginButton() {
  const { clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    sessionStorage.removeItem('shop_central_pending_phone');
  };

  if (!isAuthenticated) {
    // Login is handled by AuthGuard; show nothing or a minimal indicator
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Show phone number if available */}
      {userProfile?.phoneNumber && (
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-full">
          <Phone className="w-3 h-3" />
          <span>{userProfile.phoneNumber.replace(/^(\+91)?(\d{3})(\d{3})(\d{4})$/, '+91 $2-$3-$4')}</span>
        </div>
      )}
      <Button
        onClick={handleLogout}
        disabled={isLoggingIn}
        variant="outline"
        size="sm"
        className="gap-1.5"
      >
        {isLoggingIn ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </>
        )}
      </Button>
    </div>
  );
}
