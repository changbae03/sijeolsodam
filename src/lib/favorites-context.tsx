'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-context';

interface FavoritesContextValue {
  favoriteIds: Set<string>;
  toggleFavorite: (recipeId: string) => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      setFavoriteIds(new Set(data.recipeIds || []));
    } catch {
      setFavoriteIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 비동기 fetch 콜백 내부에서 setState하는 안전한 패턴
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = async (recipeId: string) => {
    if (!user) return;
    const isFav = favoriteIds.has(recipeId);
    const method = isFav ? 'DELETE' : 'POST';

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(recipeId);
      else next.add(recipeId);
      return next;
    });

    try {
      await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      });
    } catch {
      // 실패 시 롤백
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) next.add(recipeId);
        else next.delete(recipeId);
        return next;
      });
    }
  };

  const isFavorite = (recipeId: string) => favoriteIds.has(recipeId);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
