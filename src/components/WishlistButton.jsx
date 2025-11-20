
export default function WishlistButton({ 
  isWishlisted = false, 
  onClick, 
  className = '',
  size = 'md'
}) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <button
      className={`${sizeClasses[size]} bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm wishlist-btn ${
        isWishlisted ? 'active' : ''
      } ${className}`}
      onClick={onClick}
    >
      <i
        className={`${
          isWishlisted ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-gray-600'
        } ${iconSizes[size]}`}
      />
    </button>
  );
}

