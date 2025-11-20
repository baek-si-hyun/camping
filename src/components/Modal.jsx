import { useEffect } from 'react';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  className = '',
  closeOnBackdrop = true 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={`bg-white rounded-lg w-[90%] max-w-md ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium">{title}</h3>
            <button
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
              onClick={onClose}
            >
              <i className="ri-close-line text-xl" />
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
        {footer && <div className="p-4 border-t">{footer}</div>}
      </div>
    </div>
  );
}

