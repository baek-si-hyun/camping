import { useState } from "react";

export function useWishlist(initialItems = new Set()) {
  const [wishlist, setWishlist] = useState(initialItems);

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const addToWishlist = (id) => {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const isWishlisted = (id) => {
    return wishlist.has(id);
  };

  return {
    wishlist,
    toggleWishlist,
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    setWishlist,
  };
}
