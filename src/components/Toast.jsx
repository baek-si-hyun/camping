import { useEffect, useState } from 'react';

export default function Toast({ message, duration = 3000, type = 'info', onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const variant = {
    info: {
      container: 'bg-black/80 text-white',
      icon: 'ri-information-line'
    },
    success: {
      container: 'bg-green-600 text-white',
      icon: 'ri-check-line'
    },
    warning: {
      container: 'bg-amber-500 text-white',
      icon: 'ri-alert-line'
    },
    error: {
      container: 'bg-red-600 text-white',
      icon: 'ri-error-warning-line'
    }
  }[type] || {
    container: 'bg-black/80 text-white',
    icon: 'ri-information-line'
  };

  useEffect(() => {
    if (!message) return;

    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-20 left-0 right-0 mx-auto w-max px-4 py-3 rounded-lg z-50 transition-all duration-300 ${
        variant.container
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <i className={`${variant.icon} text-lg`} />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}
