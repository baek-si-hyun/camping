import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ACCOMMODATIONS } from '../../constants/recommendResultList.js';

export default function RecommendResultListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const bottomSheetListRef = useRef(null);
  const infoPopupRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapMarkersRef = useRef([]);
  const userLocationRef = useRef(null);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortType, setSortType] = useState('recommended');
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [priceRange, setPriceRange] = useState(15);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [bottomSheetTransform, setBottomSheetTransform] = useState('translateY(80%)');

  // URL 파라미터에서 설문 데이터 읽기
  const people = searchParams.get('people') || '2인';
  const style = searchParams.get('style') || '글램핑';
  const budget = searchParams.get('budget') || '15';
  const regions = searchParams.get('regions') || '경기도';
  const pet = searchParams.get('pet') || 'false';
  const facilities = searchParams.get('facilities') || '';
  const mbti = searchParams.get('mbti') || '';

  useEffect(() => {
    document.title = '추천 숙소 목록 - ThankQ Camping';
  }, []);

  // 카카오 지도 API 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=7c64a249ef8e3b9b648f20a50c07b249';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          initMap();
        });
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // 사용자 위치 획득
  const getUserLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('브라우저가 위치 정보를 지원하지 않습니다.'));
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  // 위치 기반 접근 여부 판단
  const isLocationBasedAccess = () => {
    return searchParams.get('from') === 'nearby';
  };

  // 사용자 주변 마커 재배치
  const relocateAccommodationsNearUser = (userLat, userLng) => {
    const latRange = 0.02;
    const lngRange = 0.02;
    const used = [];
    ACCOMMODATIONS.forEach((acc, i) => {
      let newLat, newLng, tries = 0, ok = false;
      while (tries < 10 && !ok) {
        tries++;
        newLat = userLat + (Math.random() - 0.5) * latRange;
        newLng = userLng + (Math.random() - 0.5) * lngRange;
        ok = !used.some(p => Math.abs(p.lat - newLat) < 0.005 && Math.abs(p.lng - newLng) < 0.005);
      }
      if (!ok) {
        const angle = (i / ACCOMMODATIONS.length) * Math.PI * 2;
        const d = Math.min(latRange, lngRange) * 0.6;
        newLat = userLat + Math.cos(angle) * d;
        newLng = userLng + Math.sin(angle) * d;
      }
      acc.lat = newLat;
      acc.lng = newLng;
      used.push({ lat: newLat, lng: newLng });
    });
  };

  // 지도 초기화
  const initMap = async () => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) return;

    const defaultCoords = { lat: 37.8315, lng: 127.5109 };
    let centerLat = defaultCoords.lat;
    let centerLng = defaultCoords.lng;
    let level = 5;

    if (isLocationBasedAccess()) {
      try {
        const location = await getUserLocation();
        userLocationRef.current = location;
        centerLat = location.lat;
        centerLng = location.lng;
        level = 4;
      } catch (err) {
        console.warn('위치 정보를 가져올 수 없어 기본 지역으로 설정합니다.', err);
      }
    }

    mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(centerLat, centerLng),
      level
    });

    window.map = mapInstanceRef.current;
    window.mapCenter = new window.kakao.maps.LatLng(centerLat, centerLng);

    if (userLocationRef.current) {
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(userLocationRef.current.lat, userLocationRef.current.lng),
        content: `<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <i class="ri-user-location-fill text-white text-sm"></i>
                </div>`,
        yAnchor: 0.5,
        zIndex: 200
      });
      overlay.setMap(mapInstanceRef.current);
    }

    setTimeout(() => {
      if (userLocationRef.current) {
        relocateAccommodationsNearUser(userLocationRef.current.lat, userLocationRef.current.lng);
      }
      createMarkers();
    }, 800);
  };

  // 마커 생성
  const createMarkers = () => {
    if (!mapInstanceRef.current || !window.kakao || !window.kakao.maps) return;

    // 기존 마커 제거
    mapMarkersRef.current.forEach(m => {
      try {
        m.setMap(null);
      } catch (e) {
        // ignore
      }
    });
    mapMarkersRef.current = [];

    ACCOMMODATIONS.forEach((acc, index) => {
      const markerContent = `
        <div class="relative marker-${index}" data-accommodation-id="${acc.id}">
          <div class="w-[100px] h-[36px] flex items-center justify-center
                      bg-primary text-white rounded-full shadow-lg
                      hover:shadow-xl transition-all duration-300
                      transform hover:scale-110 cursor-pointer marker-clickable">
            <span class="text-sm font-medium">₩${acc.price.toLocaleString()}</span>
          </div>
        </div>
      `;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(acc.lat, acc.lng),
        content: markerContent,
        yAnchor: 0.5,
        zIndex: 100 + index
      });

      overlay.setMap(mapInstanceRef.current);
      mapMarkersRef.current.push(overlay);

      setTimeout(() => {
        const el = document.querySelector(`.marker-${index} .marker-clickable`);
        if (!el) return;
        el.replaceWith(el.cloneNode(true));
        const clickable = document.querySelector(`.marker-${index} .marker-clickable`);
        if (clickable) {
          clickable.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();

            if (showInfoPopup) {
              setShowInfoPopup(false);
            }

            const mapContainer = mapRef.current;
            if (!mapContainer) return;

            const mapRect = mapContainer.getBoundingClientRect();
            const clickPosition = {
              x: event.clientX - mapRect.left,
              y: event.clientY - mapRect.top
            };

            setPopupPosition(clickPosition);
            setSelectedAccommodation(acc);
            setShowInfoPopup(true);
          });
        }
      }, 100);
    });
  };

  // 지도 클릭 시 팝업 닫기
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao) return;

    const handleMapClick = () => {
      setShowInfoPopup(false);
    };

    window.kakao.maps.event.addListener(mapInstanceRef.current, 'click', handleMapClick);

    return () => {
      if (mapInstanceRef.current && window.kakao) {
        window.kakao.maps.event.removeListener(mapInstanceRef.current, 'click', handleMapClick);
      }
    };
  }, [mapInstanceRef.current]);

  // 뷰 모드 변경 시 지도 리사이즈
  useEffect(() => {
    if (viewMode === 'map' && mapInstanceRef.current && window.kakao && window.kakao.maps) {
      setTimeout(() => {
        window.kakao.maps.event.trigger(mapInstanceRef.current, 'resize');
        if (window.mapCenter) {
          mapInstanceRef.current.setCenter(window.mapCenter);
        }
      }, 100);
    }
  }, [viewMode]);

  // 정렬 타입 변경
  const handleSortChange = (type) => {
    setSortType(type);
    setShowSortDropdown(false);
  };

  const sortNames = {
    recommended: '추천순',
    price: '가격순',
    rating: '평점순',
    distance: '거리순'
  };

  // 위시리스트 토글
  const toggleWishlist = (e, accommodationId) => {
    e.preventDefault();
    e.stopPropagation();

    setWishlistItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accommodationId)) {
        newSet.delete(accommodationId);
      } else {
        newSet.add(accommodationId);
      }
      return newSet;
    });
  };

  // 예약하기 버튼 클릭
  const handleReservationClick = (e, accommodation) => {
    e.preventDefault();
    e.stopPropagation();

    const params = new URLSearchParams();
    params.append('title', accommodation.title);
    params.append('region', accommodation.region);
    params.append('price', accommodation.price.toString());
    params.append('rating', accommodation.rating);
    params.append('description', accommodation.description);
    params.append('distance', accommodation.distance);
    params.append('facilities', accommodation.facilities);
    params.append('image', accommodation.image);
    params.append('badge', accommodation.badge || '');

    // 설문 데이터도 함께 전달
    params.append('survey_people', people);
    params.append('survey_style', style);
    params.append('survey_budget', budget);
    params.append('survey_regions', regions);
    params.append('survey_pet', pet);
    params.append('survey_facilities', facilities);
    params.append('survey_mbti', mbti);

    navigate(`/shop_detail?${params.toString()}`);
  };

  // 바텀시트 드래그 초기화
  useEffect(() => {
    if (!bottomSheetRef.current || viewMode !== 'map') return;

    const bottomSheet = bottomSheetRef.current;
    let startY = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
      isDraggingRef.current = true;
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      const delta = e.touches[0].clientY - startY;
      if (delta > 0) {
        setBottomSheetTransform(`translateY(${delta}px)`);
      }
    };

    const handleTouchEnd = (e) => {
      if (!isDraggingRef.current) return;
      const delta = e.changedTouches[0].clientY - startY;
      if (delta > 100) {
        setBottomSheetTransform('translateY(80%)');
      } else {
        setBottomSheetTransform('translateY(0)');
      }
      isDraggingRef.current = false;
    };

    bottomSheet.addEventListener('touchstart', handleTouchStart, { passive: false });
    bottomSheet.addEventListener('touchmove', handleTouchMove, { passive: false });
    bottomSheet.addEventListener('touchend', handleTouchEnd);

    return () => {
      bottomSheet.removeEventListener('touchstart', handleTouchStart);
      bottomSheet.removeEventListener('touchmove', handleTouchMove);
      bottomSheet.removeEventListener('touchend', handleTouchEnd);
    };
  }, [viewMode]);

  // 바텀시트 리스트 렌더링
  const renderBottomSheetList = () => {
    if (!bottomSheetListRef.current) return;

    bottomSheetListRef.current.innerHTML = '';
    ACCOMMODATIONS.forEach(acc => {
      const card = document.createElement('div');
      card.className = 'flex items-center gap-3 cursor-pointer';
      card.innerHTML = `
        <img src="${acc.image}" class="w-16 h-16 rounded-lg object-cover" alt="${acc.title}">
        <div class="flex-1">
          <h3 class="font-medium">${acc.title}</h3>
          <p class="text-sm text-gray-600">${acc.region}</p>
          <div class="flex items-center gap-2 mt-1">
            <div class="flex items-center gap-1">
              <i class="ri-star-fill text-yellow-400 text-xs"></i>
              <span class="text-xs">${acc.rating}</span>
            </div>
            <span class="text-sm font-medium text-primary">${acc.price.toLocaleString()}원</span>
          </div>
        </div>
        <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium cursor-pointer detail-btn"
          data-accommodation-id="${acc.id}">
          상세보기
        </button>
      `;

      const detailBtn = card.querySelector('.detail-btn');
      if (detailBtn) {
        detailBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleReservationClick(e, acc);
        });
      }

      bottomSheetListRef.current.appendChild(card);
    });
  };

  useEffect(() => {
    if (viewMode === 'map' && bottomSheetListRef.current) {
      renderBottomSheetList();
    }
  }, [viewMode]);

  // AI 분석 결과 텍스트
  const petInfo = pet === 'true' ? ', 반려동물 동반' : '';
  const aiResultText = `${people}, ${style}, ${budget}만원 예산${petInfo}으로 6개 숙소를 찾았어요`;

const header = (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white">
    <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center cursor-pointer"
        >
        <i className="ri-arrow-left-line text-xl" />
        </button>
      <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">추천 숙소</h1>
      <div className="w-8 h-8" />
    </div>
  </header>
);

const bottomNav = (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
    <div className="grid grid-cols-6 py-1">
        <Link to="/search_map?from=nearby" className="flex flex-col items-center gap-1 group">
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
          onClick={() => setIsSideMenuOpen(true)}
          className="flex flex-col items-center gap-1 group"
        >
        <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          <i className="ri-menu-fill text-lg group-hover:text-primary transition-colors duration-300" />
        </div>
        <span className="text-[10px] transition-colors duration-300 group-hover:text-primary">전체</span>
      </button>
    </div>
  </nav>
);

const sideMenu = (
    <div
      className={`fixed top-0 right-0 w-[280px] h-full bg-white transform transition-transform duration-300 z-50 shadow-lg flex flex-col ${
        isSideMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-medium">메뉴</h2>
        <button
          onClick={() => setIsSideMenuOpen(false)}
          className="w-8 h-8 flex items-center justify-center"
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
          <Link to="/shop_list?type=glamping" className="flex items-center gap-3">
          <i className="ri-home-smile-line text-xl text-gray-600" />
          <span>글램핑</span>
          </Link>
          <Link to="/shop_list?type=caravan" className="flex items-center gap-3">
          <i className="ri-caravan-line text-xl text-gray-600" />
          <span>카라반</span>
          </Link>
          <Link to="/shop_list?type=pension" className="flex items-center gap-3">
          <i className="ri-hotel-line text-xl text-gray-600" />
          <span>펜션</span>
          </Link>
          <Link to="/shop_list?type=hotel" className="flex items-center gap-3">
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
);

  return (
    <div className="min-h-[762px] mx-auto bg-gray-50">
      {header}
      <div>
      <style>{`
        :where([class^="ri-"])::before {
          content: "\\f3c2";
        }

        .filter-dropdown {
          transform: translateY(-10px);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .filter-dropdown.show {
          transform: translateY(0);
          opacity: 1;
        }

        .accommodation-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .accommodation-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .map-view {
          transition: all 0.3s ease;
        }

        .heart-animation {
          animation: heartPulse 0.3s ease;
        }

        @keyframes heartPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .sort-dropdown {
          display: none;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .sort-dropdown.show {
          display: block;
          max-height: 200px;
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

        #listView,
        #mapView {
          position: absolute;
          top: 200px;
          left: 0;
          right: 0;
          height: calc(100vh - 253px);
          transition: opacity 0.3s ease;
        }

        #listView {
          opacity: ${viewMode === 'list' ? 1 : 0};
          z-index: ${viewMode === 'list' ? 20 : 10};
          pointer-events: ${viewMode === 'list' ? 'auto' : 'none'};
          overflow-y: auto;
        }

        #mapView {
          opacity: ${viewMode === 'map' ? 1 : 0};
          z-index: ${viewMode === 'map' ? 20 : 10};
          pointer-events: ${viewMode === 'map' ? 'auto' : 'none'};
          overflow: hidden;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

      <main className="pt-16 pb-14 relative min-h-screen">
        <div className="px-4 py-4 bg-white border-b h-[137px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <i className="ri-filter-3-line text-sm" />
                <span className="text-sm font-medium">필터</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm font-medium">{sortNames[sortType]}</span>
                  <i className="ri-arrow-down-s-line text-sm" />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border sort-dropdown z-[60] show">
                    <button
                      onClick={() => handleSortChange('recommended')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      추천순
                    </button>
                    <button
                      onClick={() => handleSortChange('price')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      가격순
                    </button>
                    <button
                      onClick={() => handleSortChange('rating')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      평점순
                    </button>
                    <button
                      onClick={() => handleSortChange('distance')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      거리순
                    </button>
                </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100'
                }`}
              >
                <i className="ri-list-check text-sm" />
                <span className="text-sm font-medium">목록</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                  viewMode === 'map' ? 'bg-primary text-white' : 'bg-gray-100'
                }`}
              >
                <i className="ri-map-2-line text-sm" />
                <span className="text-sm font-medium">지도</span>
              </button>
            </div>
          </div>
          <div className="px-4 py-2 bg-primary/5">
            <p className="text-sm text-gray-700">
              <span className="font-medium text-primary">AI 분석 결과:</span> {aiResultText}
            </p>
          </div>
        </div>

        <div id="listView" className="px-4 py-4 space-y-4">
          {ACCOMMODATIONS.map((acc) => (
            <div key={acc.id} className="accommodation-card bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer block">
            <div className="relative">
                <img src={acc.image} className="w-full h-48 object-cover object-top" alt={acc.title} />
                <button
                  onClick={(e) => toggleWishlist(e, acc.id)}
                  className={`absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm wishlist-btn ${
                    wishlistItems.has(acc.id) ? 'active' : ''
                  }`}
                >
                  <i
                    className={`text-lg ${
                      wishlistItems.has(acc.id)
                        ? 'ri-heart-fill text-red-500'
                        : 'ri-heart-line text-gray-600'
                    }`}
                  />
              </button>
                {acc.badge && (
                  <div
                    className={`absolute bottom-3 left-3 text-white px-2 py-1 rounded text-xs font-medium ${
                      acc.badge === 'AI 추천' ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    {acc.badge}
              </div>
                )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{acc.title}</h3>
                <div className="flex items-center gap-1">
                  <i className="ri-star-fill text-yellow-400 text-sm" />
                    <span className="text-sm font-medium">{acc.rating}</span>
                </div>
              </div>
                <p className="text-sm text-gray-600 mb-3">{acc.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <i className="ri-map-pin-line" />
                    <span>{acc.region}</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="ri-car-line" />
                    <span>{acc.distance}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                  {acc.facilities.split(',').map((facility, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded text-xs ${
                        facility === '수영장'
                          ? 'bg-blue-50 text-blue-600'
                          : facility === '바베큐장'
                          ? 'bg-green-50 text-green-600'
                          : facility === '와이파이'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-orange-50 text-orange-600'
                      }`}
                    >
                      {facility}
                    </span>
                  ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                    <span className="text-lg font-bold text-primary">{acc.price.toLocaleString()}원</span>
                  <span className="text-sm text-gray-500">/ 박</span>
                </div>
                  <button
                    onClick={(e) => handleReservationClick(e, acc)}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium cursor-pointer"
                  >
                    예약하기
              </button>
              </div>
            </div>
                </div>
          ))}
          <div className="text-center py-8">
            <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg cursor-pointer">
              더 많은 숙소 보기
            </button>
          </div>
        </div>

        <div id="mapView" className={viewMode === 'map' ? 'show' : ''}>
          <div className="relative h-full">
            <div ref={mapRef} id="map" className="w-full h-full bg-gray-100" />
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="ri-map-pin-2-line text-primary" />
                  <span>경기도 일대 6개 숙소</span>
                </div>
              </div>
            </div>
            <div
              ref={bottomSheetRef}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 shadow-lg transition-transform duration-300 z-50"
              style={{ transform: bottomSheetTransform }}
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <div ref={bottomSheetListRef} className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }} />
              </div>
            {showInfoPopup && selectedAccommodation && (
              <div
                ref={infoPopupRef}
                className="absolute w-[280px] h-[200px] bg-white rounded-xl shadow-2xl z-50 border border-gray-100"
                style={{
                  left: `${popupPosition.x}px`,
                  top: `${popupPosition.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
              <div className="relative h-[80px]">
                  <img
                    src={selectedAccommodation.image}
                    className="w-full h-full object-cover rounded-t-xl"
                    alt={selectedAccommodation.title}
                  />
                  <button
                    onClick={() => setShowInfoPopup(false)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white cursor-pointer transition-colors"
                  >
                  <i className="ri-close-line text-sm" />
                </button>
              </div>
              <div className="p-3 h-[120px] flex flex-col justify-between">
                <div>
                    <h3 className="font-medium text-sm mb-1 truncate">{selectedAccommodation.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <i className="ri-star-fill text-yellow-400 text-xs" />
                      <span className="text-xs">{selectedAccommodation.rating}</span>
                    <span className="text-gray-400 text-xs">·</span>
                      <span className="text-gray-400 text-xs truncate">{selectedAccommodation.reviews}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                      <p className="font-medium text-primary text-sm">{selectedAccommodation.price.toLocaleString()}원</p>
                    <p className="text-xs text-gray-500">1박 기준</p>
                  </div>
                    <button
                      onClick={(e) => handleReservationClick(e, selectedAccommodation)}
                      className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs cursor-pointer transition-colors"
                    >
                      자세히 보기
                    </button>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </main>

      {showFilterModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">필터</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 flex items-center justify-center cursor-pointer"
              >
              <i className="ri-close-line text-xl" />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">가격대</h3>
              <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>5만원</span>
                  <span>{priceRange}만원</span>
                <span>50만원</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">숙소 유형</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">글램핑</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">캠핑</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">카라반</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">펜션</span>
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">편의시설</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">수영장</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">바베큐장</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">와이파이</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm">주차장</span>
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">평점</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="rating" className="w-4 h-4 text-primary" />
                  <span className="text-sm">4.5점 이상</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="rating" className="w-4 h-4 text-primary" />
                  <span className="text-sm">4.0점 이상</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="rating" className="w-4 h-4 text-primary" />
                  <span className="text-sm">3.5점 이상</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setPriceRange(15);
                  setShowFilterModal(false);
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-lg cursor-pointer"
              >
              초기화
            </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-3 bg-primary text-white rounded-lg cursor-pointer"
              >
              적용하기
            </button>
          </div>
        </div>
      </div>
      )}

      {!isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSideMenuOpen(false)}
          style={{ display: 'none' }}
        />
      )}
      </div>
      {bottomNav}
      {sideMenu}
    </div>
  );
}
