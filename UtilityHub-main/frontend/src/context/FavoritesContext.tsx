import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: string[];
  recentlyUsed: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  addRecent: (toolId: string) => void;
  clearRecent: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recentlyUsed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('recentlyUsed', JSON.stringify(recentlyUsed));
  }, [recentlyUsed]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user && user.token && !user.token.startsWith('mock-')) {
        try {
          const response = await fetch(`${API_URL}/tools/favorites`, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setFavorites(data);
          }
        } catch (err) {
          console.warn("Backend offline. Loading local favorites fallback.");
        }
      }
    };
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (toolId: string) => {
    setFavorites((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );

    if (user && user.token && !user.token.startsWith('mock-')) {
      try {
        await fetch(`${API_URL}/tools/favorites/${toolId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      } catch (err) {
        console.warn("Backend offline. Toggle saved locally only.");
      }
    }
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  const addRecent = (toolId: string) => {
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      return [toolId, ...filtered].slice(0, 12); // Limit to 12 recent items
    });
  };

  const clearRecent = () => {
    setRecentlyUsed([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        recentlyUsed,
        toggleFavorite,
        isFavorite,
        addRecent,
        clearRecent,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
