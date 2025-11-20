import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';


export default function SideMenu({ isOpen, onClose, menuButtonId = 'bottomMenuButton' }) {
  const sideMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
        const menuButton = document.getElementById(menuButtonId) || 
                          document.querySelector('button:has(i.ri-menu-fill)');
        if (menuButton && !menuButton.contains(event.target)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, menuButtonId]);

  const menuItems = [
    { path: '/mypage', icon: 'ri-calendar-check-line', label: '예약 내역' },
    { path: '/search', icon: 'ri-search-line', label: '캠핑장 검색' },
    { path: '/shop_list?type=glamping', icon: 'ri-home-smile-line', label: '글램핑' },
    { path: '/shop_list?type=caravan', icon: 'ri-caravan-line', label: '카라반' },
    { path: '/shop_list?type=pension', icon: 'ri-hotel-line', label: '펜션' },
    { path: '/shop_list?type=hotel', icon: 'ri-building-line', label: '호텔' },
    { path: '/equipment', icon: 'ri-tent-line', label: '캠핑 장비 렌탈' },
    { path: '/recomend_course_tmap', icon: 'ri-map-pin-line', label: 'T맵 연동 관광 코스' },
    { path: '/surroundings', icon: 'ri-restaurant-line', label: '주변 맛집' },
    { path: '/event', icon: 'ri-gift-line', label: '이벤트' },
    { path: '/customer_service', icon: 'ri-customer-service-line', label: '고객센터' }
  ];

  return (
    <div
      ref={sideMenuRef}
      className={`fixed top-0 right-0 w-[280px] h-full bg-white transform transition-transform duration-300 z-50 shadow-lg flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">메뉴</h2>
        <button
          className="w-8 h-8 flex items-center justify-center"
          onClick={onClose}
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
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3">
              <i className={`${item.icon} text-xl text-gray-600`} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

