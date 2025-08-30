
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { User, AuthChangeEvent, Session, SupabaseClient } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children, session }: { children: ReactNode; session: Session | null }) => {
  const supabase = createBrowserClient();
  const [user, setUser] = useState<User | null>(session?.user ?? null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = async (userToCheck: User | null, client: SupabaseClient) => {
    if (!userToCheck) {
      setIsAdmin(false);
      return false;
    }
    const { data: profile } = await client
      .from('profiles')
      .select('role')
      .eq('id', userToCheck.id)
      .single();
      
    const isAdminUser = profile?.role === 'admin';
    setIsAdmin(isAdminUser);
    return isAdminUser;
  };
  
  useEffect(() => {
    // We run this only on the client, after the initial server render
    // to check the admin role for the initial user.
    checkAdminRole(session?.user ?? null, supabase).finally(() => setLoading(false));

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        const currentUser = newSession?.user ?? null;
        setUser(currentUser);
        await checkAdminRole(currentUser, supabase);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }

  const value = useMemo(() => ({
    user,
    isAdmin,
    loading,
    signOut
  }), [user, isAdmin, loading, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
