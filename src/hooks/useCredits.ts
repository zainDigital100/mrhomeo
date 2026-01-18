import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ANONYMOUS_CREDITS_KEY = 'mr_homeo_anonymous_credits';
const ANONYMOUS_MAX_CREDITS = 5;
const SIGNED_IN_CREDITS = 20;

const getAnonymousCredits = (): number => {
  const stored = localStorage.getItem(ANONYMOUS_CREDITS_KEY);
  if (stored === null) {
    localStorage.setItem(ANONYMOUS_CREDITS_KEY, String(ANONYMOUS_MAX_CREDITS));
    return ANONYMOUS_MAX_CREDITS;
  }
  return parseInt(stored, 10);
};

const setAnonymousCredits = (credits: number): void => {
  localStorage.setItem(ANONYMOUS_CREDITS_KEY, String(Math.max(0, credits)));
};

export const useCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user) {
      // Anonymous user - use localStorage
      setCredits(getAnonymousCredits());
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching credits:', error);
        setIsLoading(false);
        return;
      }

      if (!data) {
        // No credits record exists, create one with 30 credits
        const { data: newData, error: insertError } = await supabase
          .from('user_credits')
          .insert({ user_id: user.id, credits: SIGNED_IN_CREDITS })
          .select('credits')
          .single();

        if (!insertError && newData) {
          setCredits(newData.credits);
        }
      } else {
        setCredits(data.credits);
      }
    } catch (err) {
      console.error('Error fetching credits:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const deductCredit = useCallback(async (): Promise<boolean> => {
    if (credits === null || credits <= 0) {
      return false;
    }

    if (!user) {
      // Anonymous user - use localStorage
      const newCredits = credits - 1;
      setAnonymousCredits(newCredits);
      setCredits(newCredits);
      return true;
    }

    try {
      const { error } = await supabase
        .from('user_credits')
        .update({ credits: credits - 1 })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deducting credit:', error);
        return false;
      }

      setCredits(prev => (prev !== null ? prev - 1 : null));
      return true;
    } catch (err) {
      console.error('Error deducting credit:', err);
      return false;
    }
  }, [user, credits]);

  const addCredits = useCallback(async (amount: number): Promise<boolean> => {
    if (!user || credits === null) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_credits')
        .update({ credits: credits + amount })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error adding credits:', error);
        return false;
      }

      setCredits(prev => (prev !== null ? prev + amount : null));
      return true;
    } catch (err) {
      console.error('Error adding credits:', err);
      return false;
    }
  }, [user, credits]);

  return {
    credits,
    isLoading,
    deductCredit,
    addCredits,
    refetch: fetchCredits,
    hasCredits: credits !== null && credits > 0
  };
};
