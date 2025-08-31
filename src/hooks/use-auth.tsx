
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children, session, initialIsAdmin }: { children: ReactNode; session: Session | null; initialIsAdmin: boolean }) => {
  const supabase = createBrowserClient();
  const [user, setUser] = useState<User | null>(session?.user ?? null);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(session?.user ?? null);
    setIsAdmin(initialIsAdmin);
    setLoading(false);
  }, [session, initialIsAdmin]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        setUser(newSession?.user ?? null);
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
             const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', newSession?.user?.id || '')
              .single();
            setIsAdmin(profile?.role === 'admin');
        } else if (event === 'SIGNED_OUT') {
            setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(() => ({
    user,
    isAdmin,
    loading,
    signOut
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [user, isAdmin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
