import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROOMS, INITIAL_REVIEWS, MORE_REVIEWS, QUERIES } from '../../constants/shopDetail.js';

export default function ShopDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mapRef = useRef(null);
  const mediaSliderRef = useRef(null);
  
  const [currentTab, setCurrentTab] = useState('basic-info');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showMoreReviews, setShowMoreReviews] = useState(true);
  const [mediaItems, setMediaItems] = useState([]);

  const title = searchParams.get('title') || '숙소명이 없습니다';
  const region = searchParams.get('region') || '';
  const price = searchParams.get('price') ? `₩${Number(searchParams.get('price')).toLocaleString()}~` : '';
  const rating = searchParams.get('rating') || '4.8';
  const description = searchParams.get('description') || '';
  const distance = searchParams.get('distance') || '';
  const facilities = searchParams.get('facilities') || '';
  const image = searchParams.get('image') || '';
  const badge = searchParams.get('badge') || '';

  useEffect(() => {
    document.title = '숙소 상세 정보';

    // 미디어 아이템 초기화
    const fallbackImgs = QUERIES.map(({ seq, text }) =>
      `https://readdy.ai/api/search-image?query=${encodeURIComponent(text)}&width=800&height=600&seq=${seq}&orientation=landscape`
    );

    let images = image
      ? [image, ...fallbackImgs.slice(0, 6)]
      : fallbackImgs.slice(0, 7);

    const videoUrl = './assets/camping_video.mp4';
    images[1] = videoUrl;

    if (image) {
      images[5] = './assets/detail_img1.png';
      images[6] = './assets/detail_img2.png';
    } else {
      images[5] = './assets/detail_img1.png';
      images[6] = './assets/detail_img2.png';
    }

    setMediaItems(images);
  }, [image]);

  useEffect(() => {
    // 카카오 지도 API 로드
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=7c64a249ef8e3b9b648f20a50c07b249&libraries=services';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          if (!mapRef.current) return;

          const defaultLat = 37.5665;
          const defaultLng = 126.9780;

          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
            level: 3,
            draggable: false,
            zoomable: false,
            scrollwheel: false
          });

          if (region) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(region, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                map.setCenter(coords);
                new window.kakao.maps.Marker({ position: coords, map });

                const infowindow = new window.kakao.maps.InfoWindow({
                  content: `<div style="padding:5px;font-size:12px;">${region}</div>`
                });
                window.kakao.maps.event.addListener(map, 'click', () => infowindow.open(map));
              } else {
                new window.kakao.maps.Marker({ position: new window.kakao.maps.LatLng(defaultLat, defaultLng), map });
              }
            });
          } else {
            new window.kakao.maps.Marker({ position: new window.kakao.maps.LatLng(defaultLat, defaultLng), map });
          }
        });
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [region]);

  useEffect(() => {
    if (mediaSliderRef.current) {
      mediaSliderRef.current.style.transform = `translateX(-${currentMediaIndex * 100}%)`;
    }
  }, [currentMediaIndex]);

  const formatDate = (date) => {
    if (!date) return '날짜 선택';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
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

  const renderCalendar = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startIdx = firstDay.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    // 이전 달 빈 칸
    for (let i = 0; i < startIdx; i++) {
      days.push({ day: new Date(year, month, 1 - startIdx + i).getDate(), disabled: true });
    }

    // 현재 달 날짜
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const isDisabled = date < today;
      const isSelectedStart = checkInDate && date.getTime() === checkInDate.getTime();
      const isSelectedEnd = checkOutDate && date.getTime() === checkOutDate.getTime();
      const isInRange = checkInDate && checkOutDate &&
        date > checkInDate && date < checkOutDate;

      days.push({
        day: i,
        disabled: isDisabled,
        selected: isSelectedStart || isSelectedEnd,
        inRange: isInRange
      });
    }

    // 다음 달 빈 칸
    const endIdx = lastDay.getDay();
    for (let i = 1; i < 7 - endIdx; i++) {
      days.push({ day: i, disabled: true });
    }

    return days;
  };

  const handleReservation = () => {
    if (!checkInDate || !checkOutDate) {
      showToast('날짜를 선택해주세요.');
      return;
    }
    if (!selectedRoom) {
      showToast('객실을 선택해주세요.');
      return;
    }
    setShowReservationModal(true);
  };

  const handleConfirmReservation = () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) return;

    const params = new URLSearchParams({
      checkIn: formatDate(checkInDate),
      checkOut: formatDate(checkOutDate),
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      roomPrice: selectedRoom.price.toString(),
      roomCapacity: selectedRoom.capacity,
      roomArea: selectedRoom.area,
      roomImg: selectedRoom.image
    });

    navigate(`/reservation?${params.toString()}`);
  };

  const showToast = (message) => {
    const existingToast = document.querySelector('.toast-popup');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-popup fixed top-20 left-0 right-0 mx-auto w-max bg-black/80 text-white px-4 py-3 rounded-lg z-50';
    toast.innerHTML = `
      <div class="flex items-center gap-2 whitespace-nowrap">
        <i class="ri-information-line text-lg"></i>
        <span class="text-sm">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => {
          if (toast.parentElement) {
            toast.remove();
          }
        }, 300);
      }
    }, 3000);
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      showToast('링크가 복사되었습니다!');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('링크가 복사되었습니다!');
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="ri-star-fill ri-xs" />);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-line ri-xs" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line ri-xs" />);
    }
    return stars;
  };

  const nights = checkInDate && checkOutDate
    ? Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    : 0;

  const calendarDays = renderCalendar();
  const facilitiesArray = facilities ? facilities.split(',') : [];

  return (
    <div className="bg-white text-gray-800">
      <style>{`
        :where([class^="ri-"])::before {
          content: "\\f3c2";
        }
        body {
          font-family: 'Noto Sans KR', sans-serif;
        }
        .video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
        }
        .video-container video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumbnail-slider {
          scrollbar-width: none;
        }
        .thumbnail-slider::-webkit-scrollbar {
          display: none;
        }
        #media-slider {
          display: flex;
          transition: transform 0.3s ease;
        }
        #media-slider>div {
          flex-shrink: 0;
          width: 100%;
          height: 100%;
        }
        #media-slider img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .tab-content {
          display: none;
        }
        .tab-content.active {
          display: block;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
        .calendar-day {
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .calendar-day.selected {
          background-color: #4F46E5;
          color: white;
        }
        .calendar-day.in-range {
          background-color: rgba(79, 70, 229, 0.1);
        }
        .calendar-day.disabled {
          color: #D1D5DB;
          pointer-events: none;
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
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
      `}</style>

      <nav className="fixed w-full top-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center cursor-pointer"
            onClick={() => {
              if ((checkInDate || checkOutDate || selectedRoom)) {
                if (window.confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
                  navigate(-1);
                }
              } else {
                navigate(-1);
              }
            }}
          >
            <i className="ri-arrow-left-line ri-lg" />
          </button>
        </div>
        <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">숙소 상세</h1>
        <div className="flex items-center">
          <button className="w-10 h-10 flex items-center justify-center cursor-pointer" onClick={handleShare}>
            <i className="ri-share-line ri-lg" />
          </button>
        </div>
      </nav>

      <main className="pt-16">
        <section className="relative h-[300px] overflow-hidden">
          <div ref={mediaSliderRef} id="media-slider" className="flex w-full h-full transition-transform duration-300">
            {mediaItems.map((url, idx) => (
              <div key={idx} className="flex-shrink-0 w-full h-full relative">
                {idx === 1 ? (
                  <>
                    <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
                      <source src={url} type="video/mp4" />
                    </video>
                    <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                      동영상
                    </div>
                  </>
                ) : (
                  <img src={url} alt={`슬라이드 ${idx + 1}`} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
            {currentMediaIndex + 1}/{mediaItems.length}
          </div>
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center"
            onClick={() => setCurrentMediaIndex(Math.max(0, currentMediaIndex - 1))}
          >
            <i className="ri-arrow-left-s-line" />
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center"
            onClick={() => setCurrentMediaIndex(Math.min(mediaItems.length - 1, currentMediaIndex + 1))}
          >
            <i className="ri-arrow-right-s-line" />
          </button>
        </section>

        <section className="thumbnail-slider flex overflow-x-auto py-3 px-4 gap-2">
          {mediaItems.map((url, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden cursor-pointer"
              onClick={() => setCurrentMediaIndex(idx)}
            >
              {idx === 1 ? (
                <video className="w-full h-full object-cover" muted loop playsInline>
                  <source src={url} type="video/mp4" />
                </video>
              ) : (
                <img src={url} alt={`썸네일 ${idx + 1}`} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </section>

        <section className="px-4 py-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center mt-2">
            <div className="flex items-center text-yellow-500">
              <i className="ri-star-fill ri-sm" />
              <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-sm text-gray-600">리뷰 128개</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-sm text-gray-600">{region}</span>
          </div>
          {badge && (
            <div className="mt-2">
              <div className="bg-primary text-white px-2 py-1 rounded text-xs font-medium inline-block">
                {badge}
              </div>
            </div>
          )}
          {description && <p className="mt-2 text-gray-600">{description}</p>}
          {distance && (
            <div className="mt-2 text-sm text-gray-500">
              <i className="ri-car-line" />
              <span className="ml-1">{distance}</span>
            </div>
          )}
          {facilitiesArray.length > 0 && (
            <div className="mt-3">
              {facilitiesArray.map((facility, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs mr-2">
                  {facility}
                </span>
              ))}
            </div>
          )}
          {price && (
            <div className="mt-3">
              <span className="text-xl font-bold text-primary">{price}</span>
            </div>
          )}
        </section>

        <section className="border-t border-b border-gray-200">
          <div className="thumbnail-slider flex overflow-x-auto">
            {[
              { id: 'basic-info', label: '기본정보' },
              { id: 'policy', label: '운영정책' },
              { id: 'facilities', label: '시설환경' },
              { id: 'layout', label: '배치도' },
              { id: 'reservation-info', label: '예약안내' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-button flex-shrink-0 px-4 py-3 font-medium ${
                  currentTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500'
                }`}
                onClick={() => setCurrentTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 py-5">
          <div id="basic-info" className={`tab-content ${currentTab === 'basic-info' ? 'active' : ''}`}>
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-medium mb-3">숙소 소개</h3>
                <p className="text-gray-600 leading-relaxed">
                  자연 속에서 편안함을 느낄 수 있는 포레스트 글램핑 리조트에 오신 것을 환영합니다. 홍천의 아름다운 산속에 위치한 저희 글램핑장은 도심에서 벗어나 자연과 함께하는 특별한 경험을 제공합니다.
                  최신 시설과 편안한 인테리어로 캠핑의 불편함 없이 자연을 만끽하실 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">위치 정보</h3>
                <div ref={mapRef} id="map" className="rounded-lg overflow-hidden h-48 w-full" />
                <p className="mt-2 text-gray-600" id="address-display">{region || '위치 정보 없음'}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">주변 명소</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>홍천강 (차량 10분 거리)</li>
                  <li>수타사 (차량 15분 거리)</li>
                  <li>용소계곡 (차량 20분 거리)</li>
                  <li>팔봉산 (차량 25분 거리)</li>
                </ul>
              </div>
            </div>
          </div>

          <div id="policy" className={`tab-content ${currentTab === 'policy' ? 'active' : ''}`}>
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-medium mb-3">입/퇴실 안내</h3>
                <div className="flex justify-between text-gray-600">
                  <div>
                    <p className="font-medium">입실</p>
                    <p>15:00 ~ 21:00</p>
                  </div>
                  <div>
                    <p className="font-medium">퇴실</p>
                    <p>~ 11:00</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">이용 규칙</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>반려동물 동반 불가</li>
                  <li>22시 이후 소음 주의</li>
                  <li>객실 내 흡연 금지 (지정된 흡연 구역 이용)</li>
                  <li>바비큐 이용은 지정된 장소에서만 가능</li>
                  <li>화재 위험이 있는 행위 금지</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">환불 정책</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="text-gray-600 space-y-2">
                    <li>이용 7일 전 취소: 100% 환불</li>
                    <li>이용 6~4일 전 취소: 70% 환불</li>
                    <li>이용 3~2일 전 취소: 50% 환불</li>
                    <li>이용 1일 전 취소: 30% 환불</li>
                    <li>이용 당일 취소: 환불 불가</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div id="facilities" className={`tab-content ${currentTab === 'facilities' ? 'active' : ''}`}>
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-medium mb-3">객실 시설</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: 'ri-wifi-line', label: '무료 와이파이' },
                    { icon: 'ri-tv-line', label: '스마트 TV' },
                    { icon: 'ri-fridge-line', label: '미니 냉장고' },
                    { icon: 'ri-air-conditioner-line', label: '에어컨' },
                    { icon: 'ri-shower-line', label: '샤워 시설' },
                    { icon: 'ri-cup-line', label: '커피 머신' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center text-primary">
                        <i className={`${item.icon} ri-lg`} />
                      </div>
                      <span className="ml-2 text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">공용 시설</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: 'ri-fire-line', label: '바비큐 시설' },
                    { icon: 'ri-parking-box-line', label: '무료 주차장' },
                    { icon: 'ri-store-2-line', label: '편의점' },
                    { icon: 'ri-restaurant-line', label: '식당' },
                    { icon: 'ri-footprint-line', label: '산책로' },
                    { icon: 'ri-water-flash-line', label: '계곡' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center text-primary">
                        <i className={`${item.icon} ri-lg`} />
                      </div>
                      <span className="ml-2 text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div id="layout" className={`tab-content ${currentTab === 'layout' ? 'active' : ''}`}>
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-medium mb-3">글램핑장 배치도</h3>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=detailed%20campsite%20map%20layout%20with%20glamping%20tents%2C%20facilities%2C%20and%20natural%20features%2C%20top-down%20view%2C%20blueprint%20style&width=375&height=300&seq=10&orientation=landscape"
                    alt="글램핑장 배치도"
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { color: 'bg-primary', label: 'A구역 (프리미엄 텐트)' },
                    { color: 'bg-secondary', label: 'B구역 (스탠다드 텐트)' },
                    { color: 'bg-green-500', label: 'C구역 (패밀리 텐트)' },
                    { color: 'bg-gray-400', label: '공용 시설 (바비큐, 화장실, 샤워실)' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className={`w-4 h-4 ${item.color} rounded-full`} />
                      <span className="ml-2 text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div id="reservation-info" className={`tab-content ${currentTab === 'reservation-info' ? 'active' : ''}`}>
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-medium mb-3">예약 방법</h3>
                <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                  <li>원하시는 날짜를 선택해주세요.</li>
                  <li>객실 타입을 선택해주세요.</li>
                  <li>인원 수와 추가 옵션을 선택해주세요.</li>
                  <li>예약자 정보를 입력해주세요.</li>
                  <li>결제를 완료하시면 예약이 확정됩니다.</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">예약 시 주의사항</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>성수기(7-8월, 공휴일)에는 최소 2박 이상 예약 가능합니다.</li>
                  <li>기준 인원 초과 시 1인당 20,000원의 추가 요금이 발생합니다.</li>
                  <li>바비큐 이용은 별도 예약이 필요합니다. (1인당 15,000원)</li>
                  <li>체크인 시 신분증을 반드시 지참해주세요.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-5 border-t border-gray-200">
          <h2 className="text-xl font-bold mb-4">날짜 선택</h2>
          <div className="flex justify-between mb-4">
            <div className="w-[48%] p-3 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-500">체크인</p>
              <p className="text-lg font-medium">{formatDate(checkInDate)}</p>
            </div>
            <div className="w-[48%] p-3 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-500">체크아웃</p>
              <p className="text-lg font-medium">{formatDate(checkOutDate)}</p>
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
              {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                <div
                  key={day}
                  className={`text-sm font-medium ${
                    idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-500'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="calendar-grid">
              {calendarDays.map((dayData, index) => (
                <div
                  key={index}
                  className={`calendar-day cursor-pointer ${
                    dayData.disabled
                      ? 'disabled'
                      : dayData.selected
                      ? 'selected'
                      : dayData.inRange
                      ? 'in-range'
                      : ''
                  }`}
                  onClick={() => !dayData.disabled && handleDateClick(dayData.day)}
                >
                  {dayData.day}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-5 border-t border-gray-200">
          <h2 className="text-xl font-bold mb-4">객실 선택</h2>
          <div className="space-y-4">
            {ROOMS.map((room) => (
              <div key={room.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{room.name}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <i className="ri-user-line ri-sm" />
                    <span className="ml-1">{room.capacity}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <i className="ri-home-line ri-sm" />
                    <span className="ml-1">{room.area}</span>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">₩{room.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">1박 기준</p>
                    </div>
                    <button
                      className={`room-select-btn px-4 py-2 rounded-button font-medium cursor-pointer ${
                        selectedRoom?.id === room.id
                          ? 'bg-primary text-white'
                          : 'bg-white text-primary border border-primary'
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      {selectedRoom?.id === room.id ? '선택됨' : '선택'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-5 border-t border-gray-200 pb-32">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">방문 후기</h2>
            <a href="#" className="text-primary text-sm font-medium cursor-pointer">전체보기</a>
          </div>
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-500">
              <i className="ri-star-fill ri-lg" />
            </div>
            <span className="ml-1 text-xl font-bold">4.8</span>
            <span className="ml-2 text-gray-500">(128개 리뷰)</span>
          </div>
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <i className="ri-user-fill ri-lg text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{review.user}</p>
                      <div className="flex items-center text-yellow-500">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                <p className="text-gray-600">{review.text}</p>
              </div>
            ))}
          </div>
          {showMoreReviews && (
            <button
              className="w-full mt-6 mb-6 py-4 text-primary border-2 border-primary rounded-button font-medium cursor-pointer bg-white relative z-10 hover:bg-primary hover:text-white transition-all duration-200"
              onClick={() => {
                setReviews([...reviews, ...MORE_REVIEWS]);
                setShowMoreReviews(false);
              }}
            >
              리뷰 더보기
            </button>
          )}
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center">
          <button
            className={`w-12 h-12 bg-white flex items-center justify-center wishlist-btn ${
              isFavorite ? 'active' : ''
            }`}
            onClick={() => {
              setIsFavorite(!isFavorite);
              showToast(isFavorite ? '찜 목록에서 삭제되었습니다.' : '찜 목록에 추가되었습니다.');
            }}
          >
            <i className={`${isFavorite ? 'ri-heart-fill ri-xl text-red-500' : 'ri-heart-line ri-xl'}`} />
          </button>
          <button className="w-12 h-12 flex items-center justify-center cursor-pointer" onClick={handleShare}>
            <i className="ri-share-line ri-xl" />
          </button>
        </div>
        <button
          id="reservation-btn"
          className="bg-primary text-white px-8 py-3 rounded-button font-medium cursor-pointer"
          onClick={handleReservation}
        >
          예약하기
        </button>
      </div>

      {showReservationModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowReservationModal(false)}
        >
          <div
            className="bg-white rounded-lg w-[90%] max-w-md p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">예약 확인</h3>
              <button
                className="w-8 h-8 flex items-center justify-center cursor-pointer"
                onClick={() => setShowReservationModal(false)}
              >
                <i className="ri-close-line ri-lg" />
              </button>
            </div>
            <div className="py-3">
              <div className="mb-4">
                <p className="text-gray-600">선택하신 날짜</p>
                <p className="font-medium">
                  {formatDate(checkInDate)} ~ {formatDate(checkOutDate)} ({nights}박)
                </p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">선택하신 객실</p>
                <p className="font-medium">{selectedRoom?.name || '객실을 선택해주세요'}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <button
                className="w-full bg-primary text-white py-3 rounded-button font-medium cursor-pointer"
                onClick={handleConfirmReservation}
              >
                예약 진행하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
