import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function MypagePage() {
  const navigate = useNavigate();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  useEffect(() => {
    document.title = '마이페이지 - ThankQ Camping';
  }, []);

  const closeCalendar = () => {
    setShowCalendarModal(false);
  };

  const addToCalendar = () => {
    if (window.confirm('iOS 캘린더에 예약 일정을 추가하시겠습니까?')) {
      alert('캘린더 앱과 연동이 필요합니다.');
    }
  };

  return (
    <div className="min-h-[762px] mx-auto bg-white">
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
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="w-8 h-8" />
          <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">마이페이지</h1>
          <Link to="/settings" className="w-8 h-8 flex items-center justify-center">
            <i className="ri-settings-3-line text-xl" />
          </Link>
        </div>
      </header>

      <main className="pt-[52px] pb-20">
        <div className="px-4 py-8 bg-gradient-to-b from-primary/10 to-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center shadow-2xl">
              <i className="ri-user-smile-fill text-4xl text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">박지민 님</h2>
              <p className="text-sm font-medium text-primary/80">VIP 회원</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-[20px] p-5 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <i className="ri-coins-fill text-2xl text-primary" />
                <span className="text-base font-bold">포인트</span>
              </div>
              <p className="text-2xl font-extrabold">3,500 P</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <i className="ri-coupon-3-fill text-xl text-primary" />
                <span className="text-sm">쿠폰</span>
              </div>
              <p className="text-lg font-medium">2장</p>
            </div>
          </div>
        </div>
        <div className="px-4 space-y-5">
          <button
            className="w-full flex items-center justify-between p-5 bg-white rounded-[24px] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            onClick={() => setShowCalendarModal(true)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                <i className="ri-calendar-2-fill text-xl text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1 text-start">예약 내역</h3>
                <p className="text-sm text-gray-500">진행중인 예약 2건</p>
              </div>
            </div>
            <i className="ri-arrow-right-s-line text-xl text-gray-400" />
          </button>
          <Link to="/wishlist" className="w-full flex items-center justify-between p-5 bg-white rounded-[24px] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                <i className="ri-heart-3-fill text-xl text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1 text-start">찜한 숙소</h3>
                <p className="text-sm text-gray-500">2개의 숙소</p>
              </div>
            </div>
            <i className="ri-arrow-right-s-line text-xl text-gray-400" />
          </Link>
          <button className="w-full flex items-center justify-between p-5 bg-white rounded-[24px] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                <i className="ri-star-fill text-xl text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1 text-start">리뷰 관리</h3>
                <p className="text-sm text-gray-500">작성 가능한 리뷰 1건</p>
              </div>
            </div>
            <i className="ri-arrow-right-s-line text-xl text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-5 bg-white rounded-[24px] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                <i className="ri-message-3-fill text-xl text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1 text-start">1:1 문의내역</h3>
                <p className="text-sm text-gray-500">답변 대기 1건</p>
              </div>
            </div>
            <i className="ri-arrow-right-s-line text-xl text-gray-400" />
          </button>
        </div>
        <div className="mt-10 px-4">
          <h3 className="text-xl font-bold mb-6">설정</h3>
          <div className="space-y-5">
            <button className="w-full flex items-center justify-between p-5 bg-white rounded-[24px] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <i className="ri-notification-4-fill text-xl text-gray-500" />
                </div>
                <span className="font-medium text-start">알림 설정</span>
              </div>
              <i className="ri-arrow-right-s-line text-xl text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-5 bg-white rounded-[24px] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[16px] bg-gray-100 flex items-center justify-center">
                  <i className="ri-user-settings-line text-xl text-gray-500" />
                </div>
                <span className="font-medium text-start">개인정보 수정</span>
              </div>
              <i className="ri-arrow-right-s-line text-xl text-gray-400" />
            </button>
            <Link to="/customer_service" className="w-full flex items-center justify-between p-5 bg-white rounded-[24px] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[16px] bg-gray-100 flex items-center justify-center">
                  <i className="ri-customer-service-2-line text-xl text-gray-500" />
                </div>
                <span className="font-medium text-start">고객센터</span>
              </div>
              <i className="ri-arrow-right-s-line text-xl text-gray-400" />
            </Link>
          </div>
        </div>
        <div className="mt-8 px-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>앱 버전</span>
            <span>2.0.1</span>
          </div>
          <div className="space-y-4">
            <button className="w-full py-3 text-gray-600">로그아웃</button>
            <button className="w-full py-3 text-gray-400">회원탈퇴</button>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-6 py-1">
          <Link to="/search_map" className="flex flex-col items-center gap-1 group">
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
              <i className="ri-user-3-fill text-lg text-primary transition-colors duration-300" />
            </div>
            <span className="text-[10px] text-primary transition-colors duration-300">마이</span>
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
                <i className="ri-calendar-check-line text-xl text-primary" />
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
      )}

      {showCalendarModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeCalendar();
            }
          }}
        >
          <div className="bg-white rounded-[28px] p-6 w-[340px] mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">예약 일정</h3>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                onClick={closeCalendar}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="mb-4">
              <div className="bg-primary/5 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-calendar-2-fill text-primary" />
                  <span className="font-medium">현재 예약</span>
                </div>
                <p className="text-sm text-gray-600">2025년 7월 15일 - 7월 17일</p>
                <p className="text-sm text-gray-500 mt-1">서울 신라호텔</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-calendar-2-fill text-gray-400" />
                  <span className="font-medium">다음 예약</span>
                </div>
                <p className="text-sm text-gray-600">2025년 8월 1일 - 8월 3일</p>
                <p className="text-sm text-gray-500 mt-1">제주 롯데호텔</p>
              </div>
            </div>
            <button
              className="w-full py-3 bg-primary text-white rounded-lg flex items-center justify-center gap-2"
              onClick={addToCalendar}
            >
              <i className="ri-calendar-2-fill" />
              <span>캘린더에 추가</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
