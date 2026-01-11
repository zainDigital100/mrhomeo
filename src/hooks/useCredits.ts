import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setCredits(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no credits record exists, create one
        if (error.code === 'PGRST116') {
          const { data: newData, error: insertError } = await supabase
            .from('user_credits')
            .insert({ user_id: user.id, credits: 10 })
            .select('credits')
            .single();

          if (!insertError && newData) {
            setCredits(newData.credits);
          }
        }
      } else if (data) {
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
    if (!user || credits === null || credits <= 0) {
      return false;
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
