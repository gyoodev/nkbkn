
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const checkAdminRole = async (user: User | null, client: SupabaseClient) => {
    if (!user) {
        setIsAdmin(false);
        return false;
    }
    const { data: profile } = await client
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    const isAdminUser = profile?.role === 'admin';
    setIsAdmin(isAdminUser);
    return isAdminUser;
  };

  useEffect(() => {
    async function getActiveSession() {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await checkAdminRole(currentUser, supabase);
      setLoading(false);
    }
    
    getActiveSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        await checkAdminRole(currentUser, supabase);
        // The loading state is only for the initial check, not subsequent changes
        if (loading) {
            setLoading(false);
        }
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
