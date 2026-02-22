import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LogIn } from 'lucide-react';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, login, loginStatus, isInitializing } = useInternetIdentity();

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
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-bold text-foreground">Welcome to Shop Central</h1>
            <p className="text-muted-foreground">Please log in to start shopping</p>
          </div>
          <button
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
          >
            <LogIn className="h-5 w-5" />
            <span>{loginStatus === 'logging-in' ? 'Logging in...' : 'Login to Continue'}</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

