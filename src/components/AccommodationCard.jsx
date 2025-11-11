import { Link } from 'react-router-dom';
import StarRating from './StarRating.jsx';
import WishlistButton from './WishlistButton.jsx';

export default function AccommodationCard({ 
  item, 
  isWishlisted, 
  onWishlistToggle,
  onCardClick,
  showDiscount = true,
  variant = 'default' // 'default', 'compact', 'featured'
}) {
  const discount = showDiscount && item.originalPrice 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(item);
    }
  };

  const getDetailUrl = () => {
    const params = new URLSearchParams({
      title: item.name || item.title,
      region: item.region,
      price: item.price,
      rating: item.rating || '4.8',
      reviews: item.reviews || '0',
      description: item.description || '',
      distance: item.distance || '',
      facilities: Array.isArray(item.facilities) ? item.facilities.join(',') : item.facilities || '',
      image: item.image || '',
      badge: item.badge || ''
    });
    return `/shop_detail?${params.toString()}`;
  };

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm relative ${
        variant === 'featured' ? 'rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300' : ''
      } ${onCardClick ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={item.image} 
          className={`w-full object-cover ${variant === 'compact' ? 'h-32' : 'h-48'}`} 
          alt={item.name || item.title} 
        />
        {item.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1.5 bg-primary text-white text-xs font-bold tracking-wide rounded-full shadow-md">
              {item.badge}
            </span>
          </div>
        )}
        {onWishlistToggle && (
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton
              isWishlisted={isWishlisted}
              onClick={(e) => {
                e.stopPropagation();
                onWishlistToggle(item.id);
              }}
            />
          </div>
        )}
      </div>
      <div className={variant === 'featured' && item.badge ? 'p-5' : 'p-4'}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className={`${
              variant === 'featured' && item.badge 
                ? 'font-bold text-xl tracking-tight' 
                : 'font-medium text-lg'
            }`}>
              {item.name || item.title}
            </h3>
            <p className={`${
              variant === 'featured' && item.badge 
                ? 'text-sm text-gray-600 mt-1.5' 
                : 'text-sm text-gray-500 mt-1'
            } flex items-center gap-1`}>
              <i className="ri-map-pin-line" />
              {item.region}
            </p>
          </div>
          {item.rating && (
            <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-full">
              <i className="ri-star-fill text-yellow-400" />
              <span className="text-sm font-bold">{item.rating}</span>
              {item.reviews && (
                <span className="text-xs text-gray-500">({item.reviews})</span>
              )}
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        )}
        {item.facilities && Array.isArray(item.facilities) && item.facilities.length > 0 && (
          <div className={`flex flex-wrap gap-2 mb-3`}>
            {item.facilities.map((facility, idx) => (
              <span
                key={idx}
                className={`${
                  variant === 'featured' && item.badge
                    ? 'px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-100'
                    : 'px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full'
                }`}
              >
                {facility}
              </span>
            ))}
          </div>
        )}
        <div className={`flex justify-between items-end ${variant === 'featured' && item.badge ? 'border-t border-gray-50 pt-4' : ''}`}>
          <div>
            {item.originalPrice && showDiscount && (
              <p className="text-xs font-medium text-gray-400 line-through">
                ₩{item.originalPrice.toLocaleString()}
              </p>
            )}
            <p className={`${variant === 'featured' && item.badge ? 'text-xl' : 'text-lg'} font-bold text-primary flex items-center gap-2`}>
              ₩{item.price.toLocaleString()}
              {discount > 0 && (
                <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {discount}% 할인
                </span>
              )}
            </p>
          </div>
          {!onCardClick && (
            <Link
              to={getDetailUrl()}
              className={`${
                variant === 'featured' && item.badge
                  ? 'px-4 py-2 bg-primary text-white text-sm font-bold !rounded-button shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow duration-300'
                  : 'px-3 py-1.5 bg-primary/10 text-primary text-sm !rounded-button'
              }`}
            >
              상세보기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

