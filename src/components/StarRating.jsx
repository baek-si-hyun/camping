
export default function StarRating({ rating = 0, size = 'sm', showEmpty = true }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const iconSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <i key={i} className={`ri-star-fill ${iconSize}`} />
      ))}
      {hasHalfStar && (
        <i key="half" className={`ri-star-half-fill ${iconSize}`} />
      )}
      {showEmpty && [...Array(emptyStars)].map((_, i) => (
        <i key={`empty-${i}`} className={`ri-star-line ${iconSize}`} />
      ))}
    </div>
  );
}

