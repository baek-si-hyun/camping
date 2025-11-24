import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { CAMPING_TYPES, SEASONAL_CAMPSITES, POPULAR_CAMPSITES, ACCORDION_ITEMS } from '../../constants/shopList.js';
import { useWishlist } from '../../hooks/useWishlist.js';
import StarRating from '../../components/StarRating.jsx';
import WishlistButton from '../../components/WishlistButton.jsx';
import BottomNav from '../../components/BottomNav.jsx';
import SideMenu from '../../components/SideMenu.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import CommonStyles from '../../components/CommonStyles.jsx';

export default function ShopListPage() {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const [selectedType, setSelectedType] = useState(() => {
    const typeParam = locationState?.type;
    return typeParam || 'normal';
  });
  const [sortType, setSortType] = useState('distance');
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  const [openAccordions, setOpenAccordions] = useState(new Set());
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const filterContainerRef = useRef(null);

  useEffect(() => {
    document.title = '캠핑의 모든 것';
  }, []);

  useEffect(() => {
    if (locationState?.type) {
      setSelectedType(locationState.type);
    }
  }, [locationState?.type]);

  const toggleAccordion = (id) => {
    const newSet = new Set(openAccordions);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setOpenAccordions(newSet);
  };

  const handleSeasonalCardClick = (campsite) => {
    navigate('/shop_detail', {
      state: {
        id: campsite.id,
        title: campsite.title,
        region: campsite.region,
        image: campsite.image,
        price: campsite.price,
        rating: campsite.rating,
        description: campsite.description,
        distance: campsite.distance,
        facilities: campsite.facilities,
        badge: campsite.badge
      }
    });
  };

  const handleDetailLinkClick = (campsite) => {
    navigate('/shop_detail', {
      state: {
        id: campsite.id,
        title: campsite.title,
        region: campsite.region,
        image: campsite.image,
        price: campsite.price
      }
    });
  };

  const sortedCampsites = [...POPULAR_CAMPSITES].sort((a, b) => {
    if (sortType === 'distance') {
      return a.distance - b.distance;
    } else {
      return b.rating - a.rating;
    }
  });


  return (
    <div className="min-h-[762px] mx-auto bg-white">
      <CommonStyles />
      <style>{`
        .tab-active {
          color: #FF7A45;
          border-bottom: 2px solid #FF7A45;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out, opacity 0.3s ease-out, padding-bottom 0.3s ease-out;
          opacity: 0;
          padding-bottom: 0;
        }
        .accordion-content.active {
          opacity: 1;
          padding-bottom: 1.5rem;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .hover-bounce:hover {
          animation: bounce 0.8s infinite;
        }
        .scroll-smooth {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .scroll-smooth::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <PageHeader 
        title="캠핑의 모든 것"
        rightLink="/search"
        rightIcon="ri-search-line"
      />

      <main className="pt-16 pb-20">
        <div className="px-4 py-3 overflow-x-auto scroll-smooth">
          <div ref={filterContainerRef} className="flex gap-3 min-w-max pb-2">
            {CAMPING_TYPES.map((type) => (
              <button
                key={type.type}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedType === type.type
                    ? 'bg-white shadow-sm hover:shadow-md transform hover:scale-105'
                    : 'bg-gray-50'
                }`}
                data-type={type.type}
                onClick={() => setSelectedType(type.type)}
              >
                <div
                  className={`flex items-center justify-center rounded-xl transition-transform duration-300 hover:rotate-6 ${
                    selectedType === type.type
                      ? 'w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5'
                      : 'w-10 h-10'
                  }`}
                >
                  <i
                    className={`${type.icon} text-xl ${
                      selectedType === type.type ? 'text-primary/80' : 'text-gray-500'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs whitespace-nowrap ${
                    selectedType === type.type ? 'font-medium' : ''
                  }`}
                >
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">계절별 추천</h2>
            <Link to="/recommend_result_list" className="text-sm text-primary cursor-pointer">
              더보기
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {SEASONAL_CAMPSITES.map((campsite) => (
              <div
                key={campsite.id}
                className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
                onClick={() => handleSeasonalCardClick(campsite)}
              >
                <div className="relative">
                  <img src={campsite.image} className="w-full h-36 object-cover" alt={campsite.title} />
                  <span className={`absolute top-2 left-2 ${campsite.seasonColor} text-white text-xs px-3 py-1 rounded-full`}>
                    {campsite.season}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{campsite.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{campsite.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className="ri-map-pin-line" />
                    <span>{campsite.region}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">인기 캠핑장</h2>
            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
              <button
                className={`px-3 py-1 text-xs rounded-full cursor-pointer ${
                  sortType === 'distance'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500'
                }`}
                onClick={() => setSortType('distance')}
              >
                거리순
              </button>
              <button
                className={`px-3 py-1 text-xs rounded-full cursor-pointer ${
                  sortType === 'rating'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500'
                }`}
                onClick={() => setSortType('rating')}
              >
                평점순
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {sortedCampsites.map((campsite) => (
              <div key={campsite.id} className="bg-white rounded-xl overflow-hidden shadow-sm relative">
                <img src={campsite.image} className="w-full h-48 object-cover" alt={campsite.title} />
                <div className="absolute top-3 right-3">
                  <WishlistButton
                    isWishlisted={isWishlisted(campsite.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(campsite.id);
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{campsite.title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <StarRating rating={campsite.rating} size="sm" />
                        <span className="text-xs text-gray-500">({campsite.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{campsite.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <i className="ri-map-pin-line" />
                    <span>
                      {campsite.region} ({campsite.distance}km)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-medium">₩{campsite.price.toLocaleString()}~</span>
                    <button
                      className="detail-link px-4 py-2 bg-primary text-white !rounded-button text-sm cursor-pointer"
                      onClick={() => handleDetailLinkClick(campsite)}
                    >
                      예약하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-4 bg-gray-50">
          <h2 className="text-lg font-medium mb-4">캠핑 필수 아이템</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: '방수 텐트', desc: '2-4인용', image: 'https://readdy.ai/api/search-image?query=Modern%20camping%20tent%2C%20lightweight%20and%20waterproof%2C%20product%20photography%20on%20white%20background&width=200&height=200&seq=108&orientation=squarish' },
              { name: '동계용 침낭', desc: '방한 기능', image: 'https://readdy.ai/api/search-image?query=Camping%20sleeping%20bag%2C%20warm%20and%20comfortable%2C%20product%20photography%20on%20white%20background&width=200&height=200&seq=109&orientation=squarish' },
              { name: '캠핑 버너', desc: '휴대용', image: 'https://readdy.ai/api/search-image?query=Portable%20camping%20stove%2C%20compact%20and%20efficient%2C%20product%20photography%20on%20white%20background&width=200&height=200&seq=110&orientation=squarish' },
              { name: '접이식 의자', desc: '경량 소재', image: 'https://readdy.ai/api/search-image?query=Camping%20chair%2C%20foldable%20and%20comfortable%2C%20product%20photography%20on%20white%20background&width=200&height=200&seq=111&orientation=squarish' },
              { name: 'LED 랜턴', desc: '충전식', image: 'https://readdy.ai/api/search-image?query=Camping%20lantern%2C%20LED%20and%20rechargeable%2C%20product%20photography%20on%20white%20background&width=200&height=200&seq=112&orientation=squarish' },
              { name: '취사 도구', desc: '세트', image: 'https://readdy.ai/api/search-image?query=Camping%20cookware%20set%2C%20compact%20and%20durable%2C%20product%20photography%20on%20white%20background&width=200&height=200&seq=113&orientation=squarish' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <img src={item.image} className="w-full h-24 object-cover" alt={item.name} />
                <div className="p-2">
                  <h4 className="text-xs font-medium">{item.name}</h4>
                  <p className="text-[10px] text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link
              to="/equipment"
              className="block w-full py-3 bg-white border border-gray-200 text-sm !rounded-button cursor-pointer text-center"
            >
              더 많은 아이템 보기
            </Link>
          </div>
        </div>

        <div className="px-4 py-4">
          <h2 className="text-lg font-medium mb-4">캠핑 가이드</h2>
          <div className="space-y-0.5">
            {ACCORDION_ITEMS.map((item) => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  className="w-full flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleAccordion(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <i className={`${item.icon} text-primary`} />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <i
                    className={`${
                      openAccordions.has(item.id) ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
                    } text-gray-400`}
                  />
                </button>
                <div
                  className={`accordion-content px-4 pb-4 ${
                    openAccordions.has(item.id) ? 'active' : ''
                  }`}
                  style={{
                    maxHeight: openAccordions.has(item.id) ? '1000px' : '0'
                  }}
                >
                  <div className="pl-3 text-sm text-gray-600 space-y-2 mb-4">
                    {item.content.map((line, lineIdx) => (
                      <p key={lineIdx}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav 
        activePath="/shop_list" 
        onMenuClick={() => setIsSideMenuOpen(true)}
      />
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)}
      />
    </div>
  );
}
