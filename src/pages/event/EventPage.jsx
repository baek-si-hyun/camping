import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EVENTS, EVENT_CATEGORIES } from '../../constants/event.js';

export default function EventPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 17, seconds: 45 });

  useEffect(() => {
    document.title = '이벤트 - ThankQ Camping';

    // 카운트다운 타이머
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 0;
              minutes = 0;
              seconds = 0;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
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

  const filteredEvents =
    selectedCategory === '전체'
      ? EVENTS
      : EVENTS.filter((event) => event.category === selectedCategory);

  return (
    <div className="min-h-[762px] mx-auto bg-gray-50">
      <style>{`
        :where([class^="ri-"])::before {
          content: "\\f3c2";
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
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
        @keyframes slideIn {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
        .event-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .countdown-item {
          transition: all 0.3s ease;
        }
        .countdown-item:hover {
          transform: scale(1.05);
        }
        .gradient-bg {
          background: linear-gradient(135deg, #FF7A45 0%, #4A90E2 100%);
        }
        .event-badge {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <i className="ri-arrow-left-line text-xl" />
          </button>
          <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">이벤트</h1>
          <button
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={handleShare}
          >
            <i className="ri-share-line text-xl" />
          </button>
        </div>
      </header>

      <main className="pt-16 pb-20">
        <div className="px-4 pt-4 mb-6">
          <div className="relative rounded-xl overflow-hidden gradient-bg">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="ri-gift-line text-lg" />
                </div>
                <span className="text-sm font-medium">특별 혜택</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">여름 캠핑 페스티벌</h2>
              <p className="text-white/90 text-sm mb-4">최대 50% 할인 + 추가 혜택까지!</p>
              <button className="px-6 py-2 bg-white text-primary rounded-lg font-medium cursor-pointer !rounded-button">
                지금 참여하기
              </button>
            </div>
            <div className="absolute top-4 right-4">
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full event-badge">
                D-7
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {EVENT_CATEGORIES.map((category) => (
              <button
                key={category}
                className={`min-w-[80px] px-4 py-2 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">진행중인 이벤트</h3>
            <span className="text-sm text-gray-500">총 {filteredEvents.length}개</span>
          </div>
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="event-card bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer">
                <div className="relative">
                  <img src={event.image} className="w-full h-48 object-cover" alt={event.title} />
                  <div className={`absolute top-3 left-3 ${event.badgeColor} text-white px-2 py-1 rounded text-xs font-medium`}>
                    {event.badge}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {event.deadline}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-lg mb-2">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {event.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 ${event.tagColors[idx]} rounded text-xs`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <i className="ri-time-line text-sm text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {event.daysLeft ? `${event.daysLeft}일 남음` : '상시 진행'}
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium cursor-pointer !rounded-button">
                      참여하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <i className="ri-time-line text-xl text-red-500" />
            <h3 className="text-lg font-medium">마감 임박 이벤트</h3>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <img src="/assets/deadline.png" className="w-12 h-12 rounded-lg object-cover" alt="마감임박"  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop&auto=format'; }} />
              <div className="flex-1">
                <h4 className="font-medium mb-1">여름 마지막 특가</h4>
                <p className="text-sm text-gray-600">글램핑 30% 할인</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">남은 시간</div>
                <div className="text-sm font-bold text-red-500">
                  {String(countdown.hours).padStart(2, '0')}시간 {String(countdown.minutes).padStart(2, '0')}분
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="countdown-item bg-red-50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-red-500">{String(countdown.hours).padStart(2, '0')}</div>
                <div className="text-xs text-gray-500">시간</div>
              </div>
              <div className="countdown-item bg-red-50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-red-500">{String(countdown.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-gray-500">분</div>
              </div>
              <div className="countdown-item bg-red-50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-red-500">{String(countdown.seconds).padStart(2, '0')}</div>
                <div className="text-xs text-gray-500">초</div>
              </div>
              <div className="countdown-item bg-primary/10 rounded-lg p-2 text-center">
                <button className="text-xs font-bold text-primary cursor-pointer">
                  지금<br />참여
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }} />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">진행률 75% (300/400명 참여)</div>
          </div>
        </div>

        <div className="px-4 mb-8">
          <h3 className="text-lg font-medium mb-4">이벤트 혜택</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: 'ri-coupon-line', label: '쿠폰 혜택', desc: '최대 10만원 할인', color: 'bg-primary/10 text-primary' },
              { icon: 'ri-gift-line', label: '무료 증정', desc: '캠핑용품 세트', color: 'bg-green-100 text-green-600' },
              { icon: 'ri-star-line', label: '포인트 적립', desc: '최대 5% 추가적립', color: 'bg-blue-100 text-blue-600' },
              { icon: 'ri-vip-crown-line', label: 'VIP 혜택', desc: '전용 라운지 이용', color: 'bg-purple-100 text-purple-600' }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className={`w-12 h-12 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <i className={`${benefit.icon} text-xl`} />
                </div>
                <h4 className="font-medium mb-1">{benefit.label}</h4>
                <p className="text-xs text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mb-8">
          <h3 className="text-lg font-medium mb-4">종료된 이벤트</h3>
          <div className="space-y-3">
            {[
              { title: '봄맞이 캠핑 축제', period: '2024.05.01 ~ 2024.05.31' },
              { title: '어린이날 가족캠핑', period: '2024.05.01 ~ 2024.05.15' }
            ].map((event, idx) => (
              <div key={idx} className="bg-gray-100 rounded-xl p-4 opacity-60">
                <div className="flex items-center gap-3">
                  <img src="/assets/end.png" className="w-12 h-12 rounded-lg object-cover grayscale mt-3" alt="종료된 이벤트"  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop&auto=format'; }} />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1 text-gray-600">{event.title}</h4>
                    <p className="text-sm text-gray-500">{event.period}</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-200 text-gray-500 rounded text-xs">종료</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <i className="ri-notification-line text-xl text-primary" />
              </div>
              <div>
                <h3 className="font-medium">이벤트 알림 받기</h3>
                <p className="text-sm text-gray-600">새로운 이벤트 소식을 가장 먼저 받아보세요</p>
              </div>
            </div>
            <button className="w-full py-3 bg-primary text-white rounded-lg font-medium cursor-pointer !rounded-button">
              알림 신청하기
            </button>
          </div>
        </div>
      </main>

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
            className="flex flex-col items-center gap-1 group"
            onClick={() => setShowSideMenu(true)}
          >
            <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <i className="ri-menu-fill text-lg group-hover:text-primary transition-colors duration-300" />
            </div>
            <span className="text-[10px] transition-colors duration-300 group-hover:text-primary">전체</span>
          </button>
        </div>
      </nav>

      {showSideMenu && (
        <div
          className="fixed top-0 right-0 w-[280px] h-full bg-white transform transition-transform duration-300 z-50 shadow-lg flex flex-col"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSideMenu(false);
            }
          }}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium">메뉴</h2>
            <button
              className="w-8 h-8 flex items-center justify-center"
              onClick={() => setShowSideMenu(false)}
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
                <i className="ri-gift-line text-xl text-primary" />
                <span>이벤트</span>
              </Link>
              <Link to="/customer_service" className="flex items-center gap-3">
                <i className="ri-customer-service-line text-xl text-gray-600" />
                <span>고객센터</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-20 left-0 right-0 mx-auto w-max bg-black/80 text-white px-4 py-3 rounded-lg z-50 animate-fadeIn">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <i className="ri-information-line text-lg" />
            <span className="text-sm">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
