import { createContext, useContext, useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

type AuthContextProps = {
  user: any;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get current authenticated user on app load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Optional: Listen for auth events using Hub
    // import { Hub } from 'aws-amplify';
    // Hub.listen('auth', checkUser);
  }, []);

  const signIn = async () => {
    try {
      await Auth.federatedSignIn(); // Opens Cognito Hosted UI
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut({ global: true });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextProps = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
