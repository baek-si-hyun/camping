import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ACCOMMODATIONS } from '../../constants/searchResult.js';

export default function SearchResultPage() {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const [sortType, setSortType] = useState('추천순');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [filterTags, setFilterTags] = useState([]);
  const [filterState, setFilterState] = useState({
    minPrice: 100000,
    maxPrice: 350000,
    facilities: [],
    rating: '전체'
  });
  const [searchState, setSearchState] = useState(() => ({
    query: locationState?.query || '가평 글램핑',
    checkin: locationState?.checkin || null,
    checkout: locationState?.checkout || null,
    nights: locationState?.nights ?? null,
    maxPrice: locationState?.maxPrice ?? null,
    adults: locationState?.adults ?? null,
    children: locationState?.children ?? null,
    type: locationState?.type,
    location: locationState?.location
  }));

  useEffect(() => {
    if (locationState) {
      setSearchState((prev) => ({
        ...prev,
        ...locationState
      }));
    }
  }, [locationState]);

  const query = searchState.query || '가평 글램핑';
  const checkin = searchState.checkin;
  const checkout = searchState.checkout;
  const nights = searchState.nights;
  const maxPrice = searchState.maxPrice;
  const adults = searchState.adults;
  const children = searchState.children;

  useEffect(() => {
    document.title = '숙소 검색 결과';
    
    // URL 파라미터에서 필터 태그 생성
    const tags = [];
    if (checkin && checkout) {
      tags.push({
        type: 'date',
        text: nights ? `${checkin}~${checkout} (${nights}박)` : `${checkin}~${checkout}`,
        value: 'date'
      });
    }
    if (adults || children) {
      const totalPeople = (parseInt(adults) || 0) + (parseInt(children) || 0);
      if (totalPeople > 0) {
        tags.push({
          type: 'people',
          text: `${totalPeople}명`,
          value: 'people'
        });
      }
    }
    if (maxPrice && parseInt(maxPrice) < 1000000) {
      tags.push({
        type: 'price',
        text: `최대 ₩${parseInt(maxPrice).toLocaleString()}`,
        value: 'price'
      });
    }
    if (query) {
      const searchTerms = query.trim().split(/\s+/);
      searchTerms.forEach((term) => {
        if (term.length > 0) {
          tags.push({
            type: 'search',
            text: term,
            value: term
          });
        }
      });
    }
    setFilterTags(tags);
  }, [checkin, checkout, nights, adults, children, maxPrice, query]);

  const sortedAccommodations = useMemo(() => {
    const sorted = [...ACCOMMODATIONS];
    
    switch (sortType) {
      case '추천순':
        return sorted.sort((a, b) => {
          const scoreA = a.rating * Math.log(a.reviews + 1);
          const scoreB = b.rating * Math.log(b.reviews + 1);
          return scoreB - scoreA;
        });
      case '가격 낮은순':
        return sorted.sort((a, b) => a.price - b.price);
      case '가격 높은순':
        return sorted.sort((a, b) => b.price - a.price);
      case '네이버 리뷰순':
        return sorted.sort((a, b) => b.reviews - a.reviews);
      case '신규 입점순':
        return sorted.sort((a, b) => a.newest - b.newest);
      default:
        return sorted;
    }
  }, [sortType]);

  const toggleWishlist = (id) => {
    setWishlistItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const removeFilterTag = (tag) => {
    setSearchState((prev) => {
      const updated = { ...prev };

      if (tag.type === 'date') {
        updated.checkin = null;
        updated.checkout = null;
        updated.nights = null;
      } else if (tag.type === 'people') {
        updated.adults = null;
        updated.children = null;
      } else if (tag.type === 'price') {
        updated.maxPrice = null;
      } else if (tag.type === 'search') {
        const remainingTerms = filterTags
          .filter((t) => t.type === 'search' && t.value !== tag.value)
          .map((t) => t.value);
        updated.query = remainingTerms.join(' ');
      }

      return updated;
    });
  };

  const handleApplyFilters = () => {
    // 필터 적용 로직
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFilterState({
      minPrice: 100000,
      maxPrice: 350000,
      facilities: [],
      rating: '전체'
    });
  };

  const getDiscountPercent = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="bg-[#F8F7FF] min-h-[762px]">
      <style>{`
        :where([class^="ri-"])::before {
          content: "\\f3c2";
        }
        .wishlist-btn {
          transition: all 0.3s ease;
        }
        .wishlist-btn:hover {
          transform: scale(1.1);
        }
        .wishlist-btn.active {
          color: #ef4444 !important;
          transform: scale(1.2);
        }
        .wishlist-btn i {
          transition: all 0.2s ease;
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        button i[class*="ri-heart"] {
          transition: all 0.2s ease;
        }
        button:has(i[class*="ri-heart"]) {
          transition: transform 0.15s ease;
        }
        button:has(i[class*="ri-heart"]):hover {
          transform: scale(1.05);
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="flex items-center px-4 h-16">
          <button
            className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full"
            onClick={() => navigate(-1)}
          >
            <i className="ri-arrow-left-s-line text-xl" />
          </button>
          <div className="flex-1 flex justify-center">
            <h1 className="text-lg font-medium">{query}</h1>
          </div>
          <Link to="/" className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full">
            <i className="ri-home-5-line text-xl" />
          </Link>
        </div>
      </nav>

      <div className="fixed top-16 left-0 right-0 bg-white z-40 shadow-sm">
        <div className="overflow-x-auto py-3 px-4">
          <div className="flex gap-2 whitespace-nowrap">
            {filterTags.map((tag, index) => (
              <button
                key={index}
                className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-1"
                onClick={() => removeFilterTag(tag)}
              >
                {tag.type === 'date' && <i className="ri-calendar-line ri-sm" />}
                {tag.type === 'people' && <i className="ri-user-line ri-sm" />}
                {tag.type === 'price' && <i className="ri-price-tag-line ri-sm" />}
                {tag.text}
                <i className="ri-close-line ri-sm" />
              </button>
            ))}
            <button
              className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-full flex items-center gap-1"
              onClick={() => setShowFilterModal(true)}
            >
              필터 수정
              <i className="ri-filter-3-line ri-sm" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed top-[112px] left-0 right-0 bg-white z-40 border-t border-gray-100">
        <div className="overflow-x-auto">
          <div className="flex py-2 px-4">
            {['추천순', '가격 낮은순', '가격 높은순', '네이버 리뷰순', '신규 입점순'].map((sort) => (
              <button
                key={sort}
                className={`px-3 py-2 text-sm whitespace-nowrap ${
                  sortType === sort
                    ? 'text-primary font-medium border-b-2 border-primary'
                    : 'text-gray-500'
                }`}
                onClick={() => setSortType(sort)}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="pt-[164px] pb-20 px-4">
        <div className="space-y-5 py-5">
          {sortedAccommodations.map((item) => {
            const discount = getDiscountPercent(item.originalPrice, item.price);
            const isWishlisted = wishlistItems.has(item.id);
            
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                  item.badge ? 'rounded-2xl' : 'rounded-xl'
                }`}
              >
                <div className="relative">
                  {item.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1.5 bg-primary text-white text-xs font-bold tracking-wide rounded-full shadow-md">
                        {item.badge}
                      </span>
                    </div>
                  )}
                  <button
                    className={`absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm wishlist-btn ${
                      isWishlisted ? 'active' : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }}
                  >
                    <i
                      className={`${
                        isWishlisted ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-gray-600'
                      }`}
                    />
                  </button>
                  <img src={item.image} className="w-full h-48 object-cover" alt={item.name} />
                </div>
                <div className={item.badge ? 'p-5' : 'p-4'}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`${item.badge ? 'font-bold text-xl tracking-tight' : 'font-medium text-lg'}`}>
                        {item.name}
                      </h3>
                      <p className={`${item.badge ? 'text-sm text-gray-600 mt-1.5' : 'text-sm text-gray-500 mt-1'} flex items-center gap-1`}>
                        <i className="ri-map-pin-line" />
                        {item.region}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-full">
                      <i className="ri-star-fill text-yellow-400" />
                      <span className="text-sm font-bold">{item.rating}</span>
                      <span className="text-xs text-gray-500">({item.reviews})</span>
                    </div>
                  </div>
                  <div className={`flex flex-wrap gap-2 mt-${item.badge ? '3' : '2'}`}>
                    {item.facilities.map((facility, idx) => (
                      <span
                        key={idx}
                        className={`${
                          item.badge
                            ? 'px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-100'
                            : 'px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full'
                        }`}
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                  <div className={`mt-${item.badge ? '4' : '3'} flex justify-between items-end ${item.badge ? 'border-t border-gray-50 pt-4' : ''}`}>
                    <div>
                      <p className="text-xs font-medium text-gray-400 line-through">₩{item.originalPrice.toLocaleString()}</p>
                      <p className={`${item.badge ? 'text-xl' : 'text-lg'} font-bold text-primary flex items-center gap-2`}>
                        ₩{item.price.toLocaleString()}
                        {discount > 0 && (
                          <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">
                            {discount}% 할인
                          </span>
                        )}
                      </p>
                    </div>
                    <Link
                      to="/shop_detail"
                      state={{
                        title: item.name,
                        region: item.region,
                        price: item.price,
                        rating: item.rating,
                        reviews: item.reviews,
                        description: item.description,
                        distance: item.distance,
                        facilities: item.facilities.join(','),
                        image: item.image,
                        badge: item.badge
                      }}
                      className={`${
                        item.badge
                          ? 'px-4 py-2 bg-primary text-white text-sm font-bold rounded-full !rounded-button shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow duration-300'
                          : 'px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full !rounded-button'
                      }`}
                    >
                      상세보기
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex justify-between items-center z-20">
        <div className="text-sm font-medium">총 {sortedAccommodations.length}개의 숙소</div>
        <Link
          to="/search_map"
          state={searchState}
          className="px-4 py-2 bg-primary text-white rounded-full !rounded-button flex items-center gap-1 shadow-md shadow-primary/20"
        >
          <i className="ri-map-pin-line" />
          지도로 보기
        </Link>
      </div>

      {/* 필터 모달 */}
      {showFilterModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFilterModal(false);
            }
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80%] overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">상세 필터</h3>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  onClick={() => setShowFilterModal(false)}
                >
                  <i className="ri-close-line text-xl" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h4 className="text-base font-medium mb-3">가격 범위</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">최소 가격</span>
                  <span className="text-sm font-medium">₩{filterState.minPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={500000}
                  value={filterState.minPrice}
                  step={10000}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  onChange={(e) => setFilterState({ ...filterState, minPrice: parseInt(e.target.value) })}
                />
                <div className="flex justify-between items-center mt-4 mb-2">
                  <span className="text-sm text-gray-500">최대 가격</span>
                  <span className="text-sm font-medium">₩{filterState.maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={500000}
                  value={filterState.maxPrice}
                  step={10000}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  onChange={(e) => setFilterState({ ...filterState, maxPrice: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <h4 className="text-base font-medium mb-3">시설</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['바베큐', '수영장', '계곡물놀이', '애견동반', '온수욕조', '불멍'].map((facility) => (
                    <label key={facility} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-primary"
                        checked={filterState.facilities.includes(facility)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterState({
                              ...filterState,
                              facilities: [...filterState.facilities, facility]
                            });
                          } else {
                            setFilterState({
                              ...filterState,
                              facilities: filterState.facilities.filter(f => f !== facility)
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-base font-medium mb-3">최소 평점</h4>
                <div className="flex gap-2">
                  {['전체', '4.0 이상', '4.5 이상'].map((rating) => (
                    <button
                      key={rating}
                      className={`flex-1 py-2 border rounded-lg text-sm ${
                        filterState.rating === rating
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setFilterState({ ...filterState, rating })}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg !rounded-button"
                  onClick={handleResetFilters}
                >
                  초기화
                </button>
                <button
                  className="flex-1 py-3 bg-primary text-white rounded-lg !rounded-button"
                  onClick={handleApplyFilters}
                >
                  적용하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
