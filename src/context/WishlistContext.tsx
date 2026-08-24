import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistItem {
  userId: string;
  itemId: string;
  itemType: 'parlor' | 'service' | 'package' | 'beautician';
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isWishlisted: (itemId: string) => boolean;
  toggleWishlist: (itemId: string, itemType: 'parlor' | 'service' | 'package' | 'beautician') => Promise<void>;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    { userId: 'usr-1', itemId: 'parlor-1', itemType: 'parlor' },
    { userId: 'usr-1', itemId: 'srv-5', itemType: 'service' },
    { userId: 'usr-1', itemId: 'pkg-1', itemType: 'package' },
    { userId: 'usr-1', itemId: 'beau-1', itemType: 'beautician' },
  ]);

  useEffect(() => {
    if (user) {
      api.getWishlist(user.id)
        .then(res => {
          if (res.wishlist) setWishlist(res.wishlist as WishlistItem[]);
        })
        .catch(err => console.log('Wishlist load fallback'));
    }
  }, [user]);

  const isWishlisted = (itemId: string) => {
    return wishlist.some(w => w.itemId === itemId);
  };

  const toggleWishlist = async (itemId: string, itemType: 'parlor' | 'service' | 'package' | 'beautician') => {
    const userId = user?.id || 'usr-1';
    // Optimistic update
    const exists = wishlist.some(w => w.itemId === itemId);
    if (exists) {
      setWishlist(prev => prev.filter(w => w.itemId !== itemId));
    } else {
      setWishlist(prev => [...prev, { userId, itemId, itemType }]);
    }

    try {
      await api.toggleWishlist(itemId, itemType, userId);
    } catch (err) {
      console.warn('Wishlist toggle API failed, local state preserved');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
        count: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
