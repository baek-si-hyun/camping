import { useEffect, useState } from 'react';

export default function Toast({ message, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-20 left-0 right-0 mx-auto w-max bg-black/80 text-white px-4 py-3 rounded-lg z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <i className="ri-information-line text-lg" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}

