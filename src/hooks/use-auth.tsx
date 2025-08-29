
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const checkAdminRole = async (user: User | null) => {
    if (!user) {
        setIsAdmin(false);
        return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    setIsAdmin(profile?.role === 'admin');
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setLoading(true);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        await checkAdminRole(currentUser);
        setLoading(false);
      }
    );

    // Initial check in case onAuthStateChange doesn't fire on initial load
    const initialCheck = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
             const currentUser = session?.user ?? null;
             setUser(currentUser);
             await checkAdminRole(currentUser);
        }
        setLoading(false);
    };
    initialCheck();


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);


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
