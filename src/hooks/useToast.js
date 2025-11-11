import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState({ message: null, duration: 3000 });

  const showToast = useCallback((message, duration = 3000) => {
    setToast({ message, duration });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ message: null, duration: 3000 });
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
