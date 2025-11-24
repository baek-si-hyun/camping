import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CAMPING_TYPES, TYPE_DISPLAY_NAMES } from '../../constants/search.js';
import Toast from '../../components/Toast.jsx';

export default function SearchMapPage() {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapMarkersRef = useRef([]);
  const userLocationRef = useRef(null);
  const infoPopupRef = useRef(null);

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [selectedDateText, setSelectedDateText] = useState('체크인 - 체크아웃 날짜를 선택하세요');
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [selectedType, setSelectedType] = useState('normal');
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    document.title = '지도검색';
    
    // 카카오 지도 API 로드
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

  const formatCalendarDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${month < 10 ? '0' + month : month}.${day < 10 ? '0' + day : day}`;
  };

  const formatCalendarDateRange = (checkin, checkout) => {
    if (!checkin || !checkout) return '체크인 - 체크아웃 날짜를 선택하세요';
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    const options = { month: '2-digit', day: '2-digit', weekday: 'short' };
    const checkinStr = checkin.toLocaleDateString('ko-KR', options);
    const checkoutStr = checkout.toLocaleDateString('ko-KR', options);
    return `${checkinStr} - ${checkoutStr}, ${nights}박${nights + 1}일`;
  };

  const handleDateClick = (day) => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const clickedDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate < today) return;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(clickedDate);
      setCheckOutDate(null);
    } else {
      if (clickedDate < checkInDate) {
        setCheckOutDate(checkInDate);
        setCheckInDate(clickedDate);
      } else {
        setCheckOutDate(clickedDate);
      }
    }
  };

  const handleConfirmCalendar = () => {
    if (checkInDate && checkOutDate) {
      if (checkOutDate <= checkInDate) {
        alert('체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.');
        return;
      }
      setSelectedDateText(formatCalendarDateRange(checkInDate, checkOutDate));
      setShowCalendarModal(false);
    } else {
      alert('체크인과 체크아웃 날짜를 모두 선택해주세요.');
    }
  };

  const renderCalendar = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, disabled: true });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const isDisabled = currentDate < today;
      const isSelectedStart = checkInDate && currentDate.getTime() === checkInDate.getTime();
      const isSelectedEnd = checkOutDate && currentDate.getTime() === checkOutDate.getTime();
      const isInRange = checkInDate && checkOutDate && 
        currentDate > checkInDate && currentDate < checkOutDate;

      days.push({
        day: i,
        disabled: isDisabled,
        selected: isSelectedStart || isSelectedEnd,
        inRange: isInRange
      });
    }

    return days;
  };

  const nights = checkInDate && checkOutDate 
    ? Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    : 0;

  const isLocationBasedAccess = () => {
    return locationState?.from === 'nearby' || locationState?.fromNearby;
  };

  const initMap = async () => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) return;

    let centerLat = 37.8315;
    let centerLng = 127.5109;
    let mapLevel = 5;

    if (isLocationBasedAccess()) {
      try {
        const location = await getUserLocation();
        userLocationRef.current = location;
        centerLat = location.lat;
        centerLng = location.lng;
        mapLevel = 4;
        showToast('현재 위치 기반으로 주변 숙소를 찾고 있습니다.');
      } catch (error) {
        showToast('위치 정보를 가져올 수 없어 기본 지역(가평)으로 설정합니다.', 'warning');
      }
    }

    const options = {
      center: new window.kakao.maps.LatLng(centerLat, centerLng),
      level: mapLevel
    };

    mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);

    if (userLocationRef.current) {
      addUserLocationMarker(userLocationRef.current.lat, userLocationRef.current.lng);
    }

    setupMapControls();
    
    setTimeout(() => {
      if (userLocationRef.current) {
        relocateAccommodationsNearUser(userLocationRef.current.lat, userLocationRef.current.lng);
      }
      createMarkers();
    }, 800);
  };

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation을 지원하지 않는 브라우저입니다.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 정보 접근이 거부되었습니다.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 정보 요청이 시간 초과되었습니다.';
              break;
            default:
              errorMessage = '알 수 없는 오류가 발생했습니다.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  };

  const accommodations = [
    {
      id: 1,
      title: '숲속 글램핑 리조트',
      type: 'glamping',
      region: '경기도 가평군 청평면 대성리',
      lat: 37.8315 + (Math.random() - 0.5) * 0.02,
      lng: 127.5109 + (Math.random() - 0.5) * 0.02,
      price: '₩130,000',
      rating: '4.8',
      reviews: '리뷰 128개',
      image: 'https://readdy.ai/api/search-image?query=Luxury%20glamping%20tent%20in%20forest%20setting%2C%20cozy%20interior%20with%20comfortable%20bed%2C%20warm%20lighting%2C%20natural%20wood%20elements%2C%20high-quality%20professional%20photography%2C%20no%20people%2C%20serene%20atmosphere&width=600&height=400&seq=101&orientation=landscape'
    },
    {
      id: 2,
      title: '마운틴 뷰 카라반',
      type: 'caravan',
      region: '경기도 양평군 양서면 용담리',
      lat: 37.8315 + (Math.random() - 0.5) * 0.02,
      lng: 127.5109 + (Math.random() - 0.5) * 0.02,
      price: '₩145,000',
      rating: '4.6',
      reviews: '리뷰 95개',
      image: 'https://readdy.ai/api/search-image?query=Modern%20caravan%20camping%20site%20with%20outdoor%20deck%2C%20mountain%20view%2C%20sunset%20lighting%2C%20professional%20photography%2C%20no%20people%2C%20luxury%20camping%20experience&width=600&height=400&seq=102&orientation=landscape'
    },
    {
      id: 3,
      title: '한옥 스타일 펜션',
      type: 'pension',
      region: '경기도 포천시 영중면 영평리',
      lat: 37.8315 + (Math.random() - 0.5) * 0.02,
      lng: 127.5109 + (Math.random() - 0.5) * 0.02,
      price: '₩120,000',
      rating: '4.7',
      reviews: '리뷰 156개',
      image: 'https://readdy.ai/api/search-image?query=Traditional%20Korean%20pension%20house%20with%20wooden%20architecture%2C%20beautiful%20garden%2C%20peaceful%20surroundings%2C%20professional%20photography%2C%20no%20people%2C%20vacation%20rental&width=600&height=400&seq=103&orientation=landscape'
    },
    {
      id: 4,
      title: '레이크 오토캠핑장',
      type: 'autoCamping',
      region: '경기도 용인시 처인구 백암면 백암리',
      lat: 37.8315 + (Math.random() - 0.5) * 0.02,
      lng: 127.5109 + (Math.random() - 0.5) * 0.02,
      price: '₩160,000',
      rating: '4.9',
      reviews: '리뷰 210개',
      image: 'https://readdy.ai/api/search-image?query=Luxury%20glamping%20tent%20with%20modern%20interior%20design%2C%20premium%20camping%20experience&width=560&height=300&seq=1&orientation=landscape'
    }
  ];

  const relocateAccommodationsNearUser = (userLat, userLng) => {
    if (!mapInstanceRef.current) return;
    
    let latRange = 0.02;
    let lngRange = 0.02;
    
    try {
      const bounds = mapInstanceRef.current.getBounds();
      latRange = (bounds.getNorthEast().getLat() - bounds.getSouthWest().getLat()) * 0.4;
      lngRange = (bounds.getNorthEast().getLng() - bounds.getSouthWest().getLng()) * 0.4;
    } catch (error) {
      // 기본값 사용
    }

    const minDistance = Math.min(latRange, lngRange) * 0.2;
    const usedPositions = [];

    accommodations.forEach((accommodation, index) => {
      let newLat, newLng, attempts = 0;
      let validPosition = false;

      while (!validPosition && attempts < 30) {
        const randomLatOffset = (Math.random() - 0.5) * latRange * 2;
        const randomLngOffset = (Math.random() - 0.5) * lngRange * 2;

        newLat = userLat + randomLatOffset;
        newLng = userLng + randomLngOffset;

        const tooClose = usedPositions.some(pos => {
          const distance = Math.sqrt(
            Math.pow(newLat - pos.lat, 2) + Math.pow(newLng - pos.lng, 2)
          );
          return distance < minDistance;
        });

        if (!tooClose) {
          validPosition = true;
        }
        attempts++;
      }

      if (!validPosition) {
        const angle = (index * Math.PI * 2) / accommodations.length;
        const distance = Math.min(latRange, lngRange) * 0.6;
        newLat = userLat + Math.cos(angle) * distance;
        newLng = userLng + Math.sin(angle) * distance;
      }

      accommodation.lat = newLat;
      accommodation.lng = newLng;
      usedPositions.push({ lat: newLat, lng: newLng });
    });
  };

  const clearAllMarkers = () => {
    mapMarkersRef.current.forEach((marker) => {
      try {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      } catch (error) {
        // ignore
      }
    });
    mapMarkersRef.current = [];
  };

  const createMarkers = () => {
    if (!mapInstanceRef.current || !window.kakao || !window.kakao.maps) return;

    clearAllMarkers();

    accommodations.forEach((accommodation, index) => {
      try {
        const markerContent = `
          <div class="relative marker-${index}" data-accommodation-id="${accommodation.id}">
            <div class="w-[90px] h-[36px] flex items-center justify-center bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 cursor-pointer marker-clickable">
              <span class="text-sm font-medium">${accommodation.price}</span>
            </div>
          </div>
        `;

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(accommodation.lat, accommodation.lng),
          content: markerContent,
          yAnchor: 0.5,
          zIndex: 100 + index
        });

        customOverlay.setMap(mapInstanceRef.current);
        mapMarkersRef.current.push(customOverlay);

        setTimeout(() => {
          const markerElement = document.querySelector(`.marker-${index}`);
          if (markerElement) {
            markerElement.addEventListener('click', (event) => {
              event.stopPropagation();
              event.preventDefault();

              const mapContainer = mapRef.current;
              const mapRect = mapContainer.getBoundingClientRect();
              const clickPosition = {
                x: event.clientX - mapRect.left,
                y: event.clientY - mapRect.top
              };

              setSelectedAccommodation(accommodation);
              setPopupPosition(clickPosition);
              setShowInfoPopup(true);
            });
          }
        }, 100);
      } catch (error) {
        // ignore
      }
    });
  };

  const addUserLocationMarker = (lat, lng) => {
    if (!mapInstanceRef.current || !window.kakao || !window.kakao.maps) return;

    const userMarkerContent = `
      <div class="relative">
        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <i class="ri-user-location-line text-white text-lg"></i>
        </div>
        <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
      </div>
    `;

    const userMarker = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(lat, lng),
      content: userMarkerContent,
      yAnchor: 0.5,
      zIndex: 10
    });

    userMarker.setMap(mapInstanceRef.current);
  };

  const setupMapControls = () => {
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const currentLocationBtn = document.getElementById('currentLocation');
    const closePopup = document.getElementById('closePopup');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        if (mapInstanceRef.current) {
          const level = mapInstanceRef.current.getLevel();
          if (level > 1) {
            mapInstanceRef.current.setLevel(level - 1);
            showToast('지도가 확대되었습니다.');
          } else {
            showToast('최대 확대 수준입니다.', 'warning');
          }
        }
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        if (mapInstanceRef.current) {
          const level = mapInstanceRef.current.getLevel();
          if (level < 14) {
            mapInstanceRef.current.setLevel(level + 1);
            showToast('지도가 축소되었습니다.');
          } else {
            showToast('최대 축소 수준입니다.', 'warning');
          }
        }
      });
    }

    if (currentLocationBtn) {
      currentLocationBtn.addEventListener('click', async () => {
        try {
          if (userLocationRef.current) {
            const moveLatLng = new window.kakao.maps.LatLng(
              userLocationRef.current.lat,
              userLocationRef.current.lng
            );
            mapInstanceRef.current.setCenter(moveLatLng);
            mapInstanceRef.current.setLevel(4);
            showToast('현재 위치로 이동했습니다.');
          } else {
            showToast('현재 위치를 가져오는 중입니다...', 'info');
            const location = await getUserLocation();
            userLocationRef.current = location;
            const moveLatLng = new window.kakao.maps.LatLng(location.lat, location.lng);
            mapInstanceRef.current.setCenter(moveLatLng);
            mapInstanceRef.current.setLevel(4);
            addUserLocationMarker(location.lat, location.lng);
            relocateAccommodationsNearUser(location.lat, location.lng);
            clearAllMarkers();
            createMarkers();
            showToast('현재 위치로 이동하고 주변 숙소를 업데이트했습니다.');
          }
        } catch (error) {
          const moveLatLng = new window.kakao.maps.LatLng(37.8315, 127.5109);
          mapInstanceRef.current.setCenter(moveLatLng);
          mapInstanceRef.current.setLevel(5);
          showToast('위치 정보를 가져올 수 없어 기본 위치로 이동했습니다.', 'warning');
        }
      });
    }

    if (closePopup) {
      closePopup.addEventListener('click', () => {
        setShowInfoPopup(false);
      });
    }

    if (mapInstanceRef.current) {
      window.kakao.maps.event.addListener(mapInstanceRef.current, 'click', () => {
        setShowInfoPopup(false);
      });
    }
  };

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
  };

  const handleSearch = () => {
    const totalPeople = adultCount + childCount;
    
    if (totalPeople === 0) {
      showToast('인원을 선택해주세요.', 'warning');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      showToast('체크인과 체크아웃 날짜를 선택해주세요.', 'warning');
      return;
    }

    const selectedTypeName = TYPE_DISPLAY_NAMES[selectedType] || '글램핑';
    navigate('/search_result', {
      state: {
        query: `가평 ${selectedTypeName}`,
        location: '가평',
        type: selectedTypeName,
        checkin: formatCalendarDate(checkInDate),
        checkout: formatCalendarDate(checkOutDate),
        nights,
        maxPrice: 300000,
        adults: adultCount,
        children: childCount
      }
    });
  };

  const handlePopupDetail = () => {
    if (!selectedAccommodation) return;
    
    navigate('/shop_detail', {
      state: {
        title: selectedAccommodation.title,
        price: Number(selectedAccommodation.price.replace(/[₩,]/g, '')),
        rating: selectedAccommodation.rating,
        image: selectedAccommodation.image,
        type: selectedAccommodation.type,
        region: selectedAccommodation.region
      }
    });
  };

  const calendarDays = renderCalendar();

  return (
    <div className="bg-[#F8F7FF] min-h-[762px]">
      <style>{`
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
        .calendar-day {
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin: 1px;
          transition: all 0.2s;
        }
        .calendar-day:hover:not(.disabled) {
          background-color: rgba(124, 58, 237, 0.1);
        }
        .calendar-day.selected {
          background-color: #7C3AED;
          color: white;
        }
        .calendar-day.in-range {
          background-color: rgba(124, 58, 237, 0.1);
        }
        .calendar-day.disabled {
          color: #D1D5DB;
          pointer-events: none;
          cursor: not-allowed;
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
          <div className="flex-1 flex justify-center gap-6">
            <Link to="/search" className="text-gray-400 hover:text-gray-600">
              숙소검색
            </Link>
            <button className="text-primary font-medium relative after:absolute after:bottom-[-14px] after:left-0 after:w-full after:h-[2px] after:bg-primary">
              지도검색
            </button>
          </div>
          <Link to="/" className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full">
            <i className="ri-home-5-line text-xl" />
          </Link>
        </div>
      </nav>

      {showCalendarModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCalendarModal(false);
            }
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">날짜 선택</h3>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                onClick={() => setShowCalendarModal(false)}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="flex justify-between mb-4">
              <div className="w-[48%] p-3 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500">체크인</p>
                <p className="text-lg font-medium">{checkInDate ? formatCalendarDate(checkInDate) : '날짜 선택'}</p>
              </div>
              <div className="w-[48%] p-3 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500">체크아웃</p>
                <p className="text-lg font-medium">{checkOutDate ? formatCalendarDate(checkOutDate) : '날짜 선택'}</p>
              </div>
            </div>
            <div className="mb-4 text-center">
              <p className="text-gray-500">{nights}박</p>
            </div>
            <div className="calendar-container mb-5">
              <div className="flex justify-between items-center mb-4">
                <button
                  className="w-10 h-10 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    const newDate = new Date(currentCalendarDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentCalendarDate(newDate);
                  }}
                >
                  <i className="ri-arrow-left-s-line ri-lg" />
                </button>
                <h3 className="text-lg font-medium">
                  {currentCalendarDate.getFullYear()}년 {currentCalendarDate.getMonth() + 1}월
                </h3>
                <button
                  className="w-10 h-10 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    const newDate = new Date(currentCalendarDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentCalendarDate(newDate);
                  }}
                >
                  <i className="ri-arrow-right-s-line ri-lg" />
                </button>
              </div>
              <div className="calendar-weekdays grid grid-cols-7 text-center mb-2">
                <div className="text-sm text-red-500 font-medium">일</div>
                <div className="text-sm text-gray-500 font-medium">월</div>
                <div className="text-sm text-gray-500 font-medium">화</div>
                <div className="text-sm text-gray-500 font-medium">수</div>
                <div className="text-sm text-gray-500 font-medium">목</div>
                <div className="text-sm text-gray-500 font-medium">금</div>
                <div className="text-sm text-blue-500 font-medium">토</div>
              </div>
              <div className="calendar-grid">
                {calendarDays.map((dayData, index) => (
                  <div
                    key={index}
                    className={`calendar-day ${
                      dayData.disabled
                        ? 'disabled'
                        : dayData.selected
                        ? 'selected'
                        : dayData.inRange
                        ? 'in-range'
                        : ''
                    }`}
                    onClick={() => !dayData.disabled && dayData.day && handleDateClick(dayData.day)}
                  >
                    {dayData.day}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
              onClick={handleConfirmCalendar}
            >
              날짜 선택 완료
            </button>
          </div>
        </div>
      )}

      <main className="pt-20 px-4 pb-20">
        <div className="space-y-4 pb-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <img
                  src="https://readdy.ai/api/search-image?query=3D%20icon%20of%20a%20calendar%2C%20modern%20design%2C%20soft%20gradients%2C%20centered%20composition%2C%20isolated%20on%20transparent%20background%2C%20smooth%20shading&width=32&height=32&seq=3&orientation=squarish"
                  className="w-6 h-6"
                  alt="calendar"
                />
              </div>
              <button
                type="button"
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 focus:outline-none text-left flex items-center justify-between"
                onClick={() => setShowCalendarModal(true)}
              >
                <span>{selectedDateText}</span>
                <i className="ri-arrow-down-s-line text-gray-400" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
              <div className="flex gap-3 min-w-max pb-2">
                {CAMPING_TYPES.map((campingType) => (
                  <button
                    key={campingType.type}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                      selectedType === campingType.type
                        ? 'bg-primary/10 shadow-md'
                        : 'bg-white shadow-sm hover:shadow-md'
                    }`}
                    onClick={() => setSelectedType(campingType.type)}
                  >
                    <div
                      className={`flex items-center justify-center rounded-xl ${
                        selectedType === campingType.type
                          ? 'w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5'
                          : 'w-10 h-10'
                      }`}
                    >
                      <i
                        className={`${campingType.icon} text-xl ${
                          selectedType === campingType.type ? 'text-primary' : 'text-gray-500'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs whitespace-nowrap ${
                        selectedType === campingType.type ? 'text-primary font-medium' : ''
                      }`}
                    >
                      {campingType.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://readdy.ai/api/search-image?query=3D%20icon%20of%20a%20person%2C%20modern%20design%2C%20soft%20gradients%2C%20centered%20composition%2C%20isolated%20on%20transparent%20background%2C%20smooth%20shading&width=32&height=32&seq=4&orientation=squarish"
                  className="w-6 h-6"
                  alt="user"
                />
                <span className="font-medium">인원 선택</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">성인</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
                    >
                      <i className="ri-subtract-line text-sm" />
                    </button>
                    <span className="w-8 text-center font-medium">{adultCount}</span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      onClick={() => setAdultCount(adultCount + 1)}
                    >
                      <i className="ri-add-line text-sm" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">소인</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      onClick={() => setChildCount(Math.max(0, childCount - 1))}
                    >
                      <i className="ri-subtract-line text-sm" />
                    </button>
                    <span className="w-8 text-center font-medium">{childCount}</span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      onClick={() => setChildCount(childCount + 1)}
                    >
                      <i className="ri-add-line text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] overflow-hidden rounded-xl shadow-sm">
            <div ref={mapRef} id="map" className="w-full h-full rounded-xl" />
            {showInfoPopup && selectedAccommodation && (
              <div
                ref={infoPopupRef}
                className="absolute w-[280px] h-[200px] bg-white rounded-xl shadow-2xl z-50 border border-gray-100"
                style={{
                  left: `${popupPosition.x + 15}px`,
                  top: `${popupPosition.y - 100}px`
                }}
              >
                <div className="relative h-[80px]">
                  <img
                    src={selectedAccommodation.image}
                    className="w-full h-full object-cover rounded-t-xl"
                    alt="숙소 이미지"
                  />
                  <button
                    id="closePopup"
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white cursor-pointer transition-colors"
                    onClick={() => setShowInfoPopup(false)}
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
                      <p className="font-medium text-primary text-sm">{selectedAccommodation.price}</p>
                      <p className="text-xs text-gray-500">1박 기준</p>
                    </div>
                    <button
                      className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs cursor-pointer transition-colors"
                      onClick={handlePopupDetail}
                    >
                      자세히 보기
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <button id="zoomIn" className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50">
                <i className="ri-add-line text-xl" />
              </button>
              <button id="zoomOut" className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50">
                <i className="ri-subtract-line text-xl" />
              </button>
              <button id="currentLocation" className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50">
                <i className="ri-map-pin-user-line text-xl text-primary" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-10">
        <button
          id="searchButton"
          className="w-full h-14 bg-primary text-white font-medium rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow duration-300"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>

      <Toast
        message={toastMessage?.message}
        type={toastMessage?.type}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
