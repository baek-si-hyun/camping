import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RESTAURANTS } from '../../constants/surroundings.js';

export default function SurroundingsPage() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterState, setFilterState] = useState({
    sort: 'rating',
    price: [],
    category: []
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [focusedRestaurant, setFocusedRestaurant] = useState(null);
  const sideMenuRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    document.title = '주변 맛집 - ThankQ Camping';
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=7c64a249ef8e3b9b648f20a50c07b249';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          if (!mapRef.current) return;

          mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(37.8315, 127.5109),
            level: 4
          });

          const bounds = mapInstanceRef.current.getBounds();
          const sw = bounds.getSouthWest();
          const ne = bounds.getNorthEast();

          RESTAURANTS.forEach((restaurant) => {
            const lat = sw.getLat() + Math.random() * (ne.getLat() - sw.getLat());
            const lng = sw.getLng() + Math.random() * (ne.getLng() - sw.getLng());

            let colorClass = 'bg-primary';
            if (restaurant.status === '예약마감') colorClass = 'bg-red-500';
            else if (restaurant.status === '웨이팅 중') colorClass = 'bg-yellow-500';
            else if (restaurant.status === '바로입장') colorClass = 'bg-green-500';

            const markerContent = `
              <div data-marker-for="${restaurant.id}"
                   class="map-marker w-8 h-8 ${colorClass} rounded-full flex items-center justify-center"
                   style="animation-delay:0.5s; cursor:pointer;">
                <i class="ri-restaurant-fill text-white text-sm"></i>
              </div>
            `;

            const overlay = new window.kakao.maps.CustomOverlay({
              position: new window.kakao.maps.LatLng(lat, lng),
              content: markerContent,
              yAnchor: 0.5
            });

            overlay.setMap(mapInstanceRef.current);
            markersRef.current[restaurant.id] = overlay;

            setTimeout(() => {
              const el = document.querySelector(`[data-marker-for="${restaurant.id}"]`);
              if (el) {
                el.addEventListener('click', (e) => {
                  e.stopPropagation();
                  setFocusedRestaurant(restaurant.id);
                  const cardEl = document.querySelector(`[data-restaurant="${restaurant.id}"]`);
                  if (cardEl) {
                    const { top, bottom } = cardEl.getBoundingClientRect();
                    const vh = window.innerHeight;
                    if (top < 0 || bottom > vh) {
                      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }
                });
              }
            }, 100);
          });
        });
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
        const menuButton = document.getElementById('bottomMenuButton');
        if (menuButton && !menuButton.contains(event.target)) {
          setIsSideMenuOpen(false);
        }
      }
    };

    if (isSideMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSideMenuOpen]);

  const handleSortChange = (sort) => {
    setFilterState(prev => ({ ...prev, sort }));
  };

  const handlePriceToggle = (price) => {
    setFilterState(prev => ({
      ...prev,
      price: prev.price.includes(price)
        ? prev.price.filter(p => p !== price)
        : [...prev.price, price]
    }));
  };

  const handleCategoryToggle = (category) => {
    setFilterState(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const handleResetFilter = () => {
    setFilterState({
      sort: 'rating',
      price: [],
      category: []
    });
  };

  const getFilteredRestaurants = () => {
    let filtered = [...RESTAURANTS];

    // 가격 필터
    if (filterState.price.length > 0) {
      filtered = filtered.filter(r => {
        return filterState.price.some(p => r.price.includes(`${p}만원대`));
      });
    }

    // 카테고리 필터
    if (filterState.category.length > 0) {
      filtered = filtered.filter(r => {
        return filterState.category.includes(r.category);
      });
    }

    // 정렬
    filtered.sort((a, b) => {
      if (filterState.sort === 'distance') {
        return a.distance - b.distance;
      } else if (filterState.sort === 'rating') {
        return b.rating - a.rating;
      } else if (filterState.sort === 'waiting') {
        return a.waiting - b.waiting;
      }
      return 0;
    });

    return filtered;
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleReservation = () => {
    if (!selectedTime) {
      alert('예약 시간을 선택해주세요.');
      return;
    }
    setShowRestaurantModal(false);
    setShowReservationModal(true);
  };

  const handleWaiting = () => {
    setShowRestaurantModal(false);
    setShowWaitingModal(true);
  };

  const handleCloseModal = () => {
    setShowRestaurantModal(false);
    setShowReservationModal(false);
    setShowWaitingModal(false);
    setSelectedTime(null);
    document.body.style.overflow = '';
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const currentLevel = mapInstanceRef.current.getLevel();
      mapInstanceRef.current.setLevel(currentLevel - 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const currentLevel = mapInstanceRef.current.getLevel();
      mapInstanceRef.current.setLevel(currentLevel + 1);
    }
  };

  const filteredRestaurants = getFilteredRestaurants();

  return (
    <div className="min-h-[762px] bg-gray-50">
      <style>{`
        :where([class^="ri-"])::before {
          content: "\\f3c2";
        }
        .search-input::-webkit-search-cancel-button {
          display: none;
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .restaurant-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .restaurant-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .map-marker {
          animation: bounce 2s infinite;
        }
        .restaurant-card.focused {
          box-shadow: 0 0 0 2px rgba(255, 122, 69, 0.6), 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        .waiting-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .filter-slide {
          transform: translateY(-100%);
          transition: transform 0.3s ease;
        }
        .filter-slide.active {
          transform: translateY(0);
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <i className="ri-arrow-left-line text-xl" />
          </button>
          <h1 className="text-lg font-medium">주변 맛집</h1>
          <button
            id="filterBtn"
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <i className="ri-equalizer-line text-xl" />
          </button>
        </div>
      </header>

      <div
        id="filterPanel"
        className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-lg filter-slide ${
          showFilterPanel ? 'active' : ''
        }`}
        style={{ top: '56px' }}
      >
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">필터</h2>
            <button
              id="closeFilter"
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
              onClick={() => setShowFilterPanel(false)}
            >
              <i className="ri-close-line text-xl" />
            </button>
          </div>
        </div>
        <div className="px-4 py-4 space-y-4">
          <div>
            <h3 className="font-medium mb-3">정렬 기준</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { sort: 'distance', label: '거리순' },
                { sort: 'rating', label: '평점순' },
                { sort: 'waiting', label: '웨이팅순' }
              ].map((item) => (
                <button
                  key={item.sort}
                  className={`sort-btn p-2 text-sm border-2 !rounded-button text-center cursor-pointer transition-all ${
                    filterState.sort === item.sort
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleSortChange(item.sort)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3">가격대</h3>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((price) => (
                <button
                  key={price}
                  className={`price-btn p-2 text-sm border-2 !rounded-button text-center cursor-pointer transition-all ${
                    filterState.price.includes(price)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handlePriceToggle(price)}
                >
                  {price === 4 ? '4만원+' : `${price}만원대`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3">음식 종류</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { category: 'korean', label: '한식' },
                { category: 'western', label: '양식' },
                { category: 'chinese', label: '중식' },
                { category: 'japanese', label: '일식' },
                { category: 'cafe', label: '카페' },
                { category: 'bbq', label: '고기' }
              ].map((item) => (
                <button
                  key={item.category}
                  className={`category-btn p-2 text-sm border-2 !rounded-button text-center cursor-pointer transition-all ${
                    filterState.category.includes(item.category)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleCategoryToggle(item.category)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              id="resetFilter"
              className="flex-1 py-3 border-2 border-gray-200 !rounded-button text-center cursor-pointer"
              onClick={handleResetFilter}
            >
              초기화
            </button>
            <button
              id="applyFilter"
              className="flex-1 py-3 bg-primary text-white !rounded-button text-center cursor-pointer"
              onClick={() => setShowFilterPanel(false)}
            >
              적용하기
            </button>
          </div>
        </div>
      </div>

      <main className="pt-14 pb-4">
        <div className="relative h-64 bg-cover bg-center">
          <div ref={mapRef} id="map" className="absolute inset-0" />
          <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg z-10">
            <div className="flex items-center gap-2">
              <i className="ri-map-pin-fill text-primary" />
              <span className="text-sm font-medium">가평 프리미엄 글램핑</span>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <button
              id="zoomInBtn"
              className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleZoomIn}
            >
              <i className="ri-add-line text-xl" />
            </button>
            <button
              id="zoomOutBtn"
              className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleZoomOut}
            >
              <i className="ri-subtract-line text-xl" />
            </button>
          </div>
        </div>
        <div className="py-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">주변 맛집 {filteredRestaurants.length}곳</h2>
            <div className="flex items-center gap-2">
              <button
                id="notificationBtn"
                className="px-3 py-1 bg-secondary/10 text-secondary text-sm !rounded-button cursor-pointer"
                onClick={() => setShowNotificationModal(true)}
              >
                <i className="ri-notification-line text-sm mr-1" />
                웨이팅 알림
              </button>
            </div>
          </div>
          {filteredRestaurants.length === 0 ? (
            <div id="emptyState" className="text-center py-12">
              <i className="ri-restaurant-line text-4xl text-gray-400 mb-2" />
              <p className="text-gray-500">조건에 맞는 맛집이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4 pb-10">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className={`restaurant-card bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer ${
                    focusedRestaurant === restaurant.id ? 'focused' : ''
                  }`}
                  data-restaurant={restaurant.id}
                  onClick={() => handleRestaurantClick(restaurant)}
                >
                  <div className="flex h-[136px]">
                    <div className="w-24 h-full flex-shrink-0 overflow-hidden">
                      <img
                        src={restaurant.image}
                        className="h-full w-auto object-cover object-center"
                        alt={restaurant.name}
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-base">{restaurant.name}</h3>
                        <div className="flex items-center gap-1">
                          <i className="ri-star-fill text-yellow-400 text-sm" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {restaurant.category === 'korean' && '전통 한정식 • '}
                        {restaurant.category === 'western' && '이탈리안 • '}
                        {restaurant.category === 'chinese' && '중식 • '}
                        {restaurant.category === 'japanese' && '일식 • '}
                        {restaurant.category === 'cafe' && '카페 • '}
                        {restaurant.category === 'bbq' && '한우 전문점 • '}
                        {restaurant.price}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <i className="ri-map-pin-line text-xs" />
                          <span>캠핑장에서 {restaurant.distance}km</span>
                        </div>
                        <div className={`flex items-center gap-1 ${restaurant.statusColor}`}>
                          <div className={`w-2 h-2 ${restaurant.statusBg} rounded-full waiting-pulse`} />
                          <span className="text-xs">{restaurant.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">웨이팅</span>
                          <span
                            className={`font-medium ${
                              restaurant.waiting === 0
                                ? 'text-green-500'
                                : restaurant.waiting > 10
                                ? 'text-orange-500'
                                : 'text-orange-500'
                            }`}
                          >
                            {restaurant.waiting === 0 ? '없음' : `${restaurant.waiting}분`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ri-time-line text-gray-400" />
                          <span className="text-gray-500">{restaurant.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      {restaurant.features.map((feature, idx) => (
                        <span key={idx}>{feature}</span>
                      ))}
                    </div>
                    <button
                      className={`px-4 py-2 ${restaurant.actionColor} text-white text-xs !rounded-button cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (restaurant.action === '예약하기') {
                          handleRestaurantClick(restaurant);
                        } else if (restaurant.action === '웨이팅 신청') {
                          handleRestaurantClick(restaurant);
                        }
                      }}
                    >
                      {restaurant.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showRestaurantModal && selectedRestaurant && (
        <div
          id="restaurantModal"
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl w-[90%] max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 id="modalTitle" className="text-lg font-medium">
                {selectedRestaurant.name}
              </h3>
              <button
                id="closeModal"
                className="w-8 h-8 flex items-center justify-center cursor-pointer"
                onClick={handleCloseModal}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">예약 가능 시간</h4>
                <div className="grid grid-cols-4 gap-2">
                  {['12:00', '13:00', '14:00', '15:00', '18:00', '19:00', '20:00'].map((time) => (
                    <button
                      key={time}
                      className={`p-2 text-sm border-2 rounded-lg cursor-pointer ${
                        selectedTime === time
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                {selectedRestaurant.action === '예약하기' && (
                  <button
                    id="reserveBtn"
                    className="flex-1 py-3 bg-primary text-white !rounded-button cursor-pointer"
                    onClick={handleReservation}
                  >
                    예약하기
                  </button>
                )}
                {selectedRestaurant.action === '웨이팅 신청' && (
                  <button
                    id="waitingBtn"
                    className="flex-1 py-3 bg-yellow-500 text-white !rounded-button cursor-pointer"
                    onClick={handleWaiting}
                  >
                    웨이팅 신청
                  </button>
                )}
                {selectedRestaurant.action === '바로입장' && (
                  <button
                    className="flex-1 py-3 bg-green-500 text-white !rounded-button cursor-pointer"
                    onClick={handleCloseModal}
                  >
                    확인
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showReservationModal && (
        <div
          id="reservationCompleteModal"
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div className="bg-white rounded-xl w-[320px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-2xl text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">예약되었습니다</h3>
              <p className="text-sm text-gray-600 mb-6">카카오톡으로 예약 확정 알림을 보내드렸습니다.</p>
              <button
                id="confirmReservationBtn"
                className="w-full py-3 bg-primary text-white rounded-lg font-medium cursor-pointer !rounded-button"
                onClick={handleCloseModal}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {showWaitingModal && (
        <div
          id="waitingCompleteModal"
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div className="bg-white rounded-xl w-[320px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-time-line text-2xl text-yellow-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">웨이팅이 신청되었습니다</h3>
              <p className="text-sm text-gray-600 mb-6">순서가 되면 알림을 보내드리겠습니다.</p>
              <button
                id="confirmWaitingBtn"
                className="w-full py-3 bg-primary text-white rounded-lg font-medium cursor-pointer !rounded-button"
                onClick={handleCloseModal}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotificationModal && (
        <div
          id="notificationModal"
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowNotificationModal(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">웨이팅 알림 설정</h3>
                <button
                  id="closeNotificationModal"
                  className="w-8 h-8 flex items-center justify-center cursor-pointer"
                  onClick={() => setShowNotificationModal(false)}
                >
                  <i className="ri-close-line text-xl" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {[
                  { name: '가평 한정식', waiting: 5 },
                  { name: '피자마루', waiting: 15 },
                  { name: '치킨마을', waiting: 20 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <i className="ri-restaurant-line text-primary" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">현재 웨이팅: {item.waiting}분</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={idx === 0} />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>
                ))}
              </div>
              <div className="bg-secondary/10 rounded-lg p-3 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-information-line text-secondary" />
                  <span className="text-sm font-medium text-secondary">알림 설정</span>
                </div>
                <p className="text-xs text-gray-600">
                  웨이팅 시간이 5분 이하로 줄어들면 카카오톡으로 알림을 보내드립니다.
                </p>
              </div>
              <button
                className="w-full py-3 bg-primary text-white !rounded-button cursor-pointer mt-4"
                onClick={() => setShowNotificationModal(false)}
              >
                알림 설정 완료
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-6 py-1">
          <Link to="/search_map" state={{ from: 'nearby' }} className="flex flex-col items-center gap-1 group">
          <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
            <i className="ri-map-pin-2-fill text-lg group-hover:text-primary transition-colors duration-300" />
          </div>
            <span className="text-[10px] transition-colors duration-300 group-hover:text-primary">내주변</span>
          </Link>
          <Link to="/" className="flex flex-col items-center gap-1 group">
            <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <i className="ri-home-5-fill text-lg group-hover:text-primary transition-colors duration-300" />
            </div>
            <span className="text-[10px] transition-colors duration-300 group-hover:text-primary">홈</span>
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center gap-1 group">
            <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <i className="ri-heart-3-fill text-lg group-hover:text-primary transition-colors duration-300" />
            </div>
            <span className="text-[10px] transition-colors duration-300 group-hover:text-primary">찜</span>
          </Link>
          <Link to="/mypage" className="flex flex-col items-center gap-1 group">
            <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <i className="ri-user-3-fill text-lg group-hover:text-primary transition-colors duration-300" />
            </div>
            <span className="text-[10px] transition-colors duration-300 group-hover:text-primary">마이</span>
          </Link>
          <button className="flex flex-col items-center gap-1 group">
            <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <i className="ri-wallet-3-fill text-lg group-hover:text-primary transition-colors duration-300" />
            </div>
            <span className="text-[10px] transition-colors duration-300 group-hover:text-primary">페이</span>
          </button>
          <button
            id="bottomMenuButton"
            className="flex flex-col items-center gap-1 group"
            onClick={() => setIsSideMenuOpen(true)}
          >
            <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <i className="ri-menu-fill text-lg group-hover:text-primary transition-colors duration-300" />
            </div>
            <span className="text-[10px] transition-colors duration-300 group-hover:text-primary">전체</span>
          </button>
        </div>
      </nav>

      <div
        ref={sideMenuRef}
        className={`fixed top-0 right-0 w-[280px] h-full bg-white transform transition-transform duration-300 z-50 shadow-lg flex flex-col ${
          isSideMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">메뉴</h2>
          <button
            id="closeMenu"
            className="w-8 h-8 flex items-center justify-center"
            onClick={() => setIsSideMenuOpen(false)}
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b">
            <Link to="/login" className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-xl">
              <i className="ri-user-add-line text-xl text-primary" />
              <span>로그인/회원가입</span>
            </Link>
          </div>
          <div className="p-4 space-y-4">
            <Link to="/mypage" className="flex items-center gap-3">
              <i className="ri-calendar-check-line text-xl text-gray-600" />
              <span>예약 내역</span>
            </Link>
            <Link to="/search" className="flex items-center gap-3">
              <i className="ri-search-line text-xl text-gray-600" />
              <span>캠핑장 검색</span>
            </Link>
            <Link to="/shop_list" state={{ type: 'glamping' }} className="flex items-center gap-3">
              <i className="ri-home-smile-line text-xl text-gray-600" />
              <span>글램핑</span>
            </Link>
            <Link to="/shop_list" state={{ type: 'caravan' }} className="flex items-center gap-3">
              <i className="ri-caravan-line text-xl text-gray-600" />
              <span>카라반</span>
            </Link>
            <Link to="/shop_list" state={{ type: 'pension' }} className="flex items-center gap-3">
              <i className="ri-hotel-line text-xl text-gray-600" />
              <span>펜션</span>
            </Link>
            <Link to="/shop_list" state={{ type: 'hotel' }} className="flex items-center gap-3">
              <i className="ri-building-line text-xl text-gray-600" />
              <span>호텔</span>
            </Link>
            <Link to="/equipment" className="flex items-center gap-3">
              <i className="ri-tent-line text-xl text-gray-600" />
              <span>캠핑 장비 렌탈</span>
            </Link>
            <Link to="/recomend_course_tmap" className="flex items-center gap-3">
              <i className="ri-map-pin-line text-xl text-gray-600" />
              <span>T맵 연동 관광 코스</span>
            </Link>
            <Link to="/surroundings" className="flex items-center gap-3">
              <i className="ri-restaurant-line text-xl text-gray-600" />
              <span>주변 맛집</span>
            </Link>
            <Link to="/event" className="flex items-center gap-3">
              <i className="ri-gift-line text-xl text-gray-600" />
              <span>이벤트</span>
            </Link>
            <Link to="/customer_service" className="flex items-center gap-3">
              <i className="ri-customer-service-line text-xl text-gray-600" />
              <span>고객센터</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
