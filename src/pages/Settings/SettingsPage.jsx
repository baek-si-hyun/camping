import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [toggles, setToggles] = useState({
    push: true,
    email: true,
    sms: false,
    darkMode: false,
    location: true
  });

  useEffect(() => {
    document.title = '설정 - ThankQ Camping';
  }, []);

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSettingClick = (title) => {
    if (title === '로그아웃') {
      if (window.confirm('로그아웃하시겠습니까?')) {
        alert('로그아웃되었습니다.');
        navigate('/login');
      }
    } else if (title === '회원탈퇴') {
      if (window.confirm('정말로 탈퇴하시겠습니까?\n모든 데이터가 삭제됩니다.')) {
        if (window.confirm('탈퇴를 진행하시겠습니까?')) {
          alert('회원탈퇴가 완료되었습니다.');
          navigate('/login');
        }
      }
    }
  };

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
        .setting-item {
          transition: all 0.2s ease;
        }
        .setting-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background-color: #e5e7eb;
          border-radius: 12px;
          transition: background-color 0.3s ease;
          cursor: pointer;
        }
        .toggle-switch.active {
          background-color: #FF7A45;
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background-color: white;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }
        .toggle-switch.active::after {
          transform: translateX(20px);
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="w-8 h-8" />
          <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">설정</h1>
          <Link to="/settings" className="w-8 h-8 flex items-center justify-center">
            <i className="ri-settings-3-line text-xl" />
          </Link>
        </div>
      </header>

      <main className="pt-16 pb-20">
        <div className="px-4 mb-8">
          <h3 className="text-lg font-medium mb-4">계정 설정</h3>
          <div className="space-y-3">
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                    <i className="ri-user-settings-line text-xl text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">개인정보 수정</h4>
                    <p className="text-sm text-gray-500">이름, 전화번호, 이메일 변경</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </div>
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                    <i className="ri-lock-password-line text-xl text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">비밀번호 변경</h4>
                    <p className="text-sm text-gray-500">계정 보안을 위한 비밀번호 변경</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </div>
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                    <i className="ri-bank-card-line text-xl text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">결제 수단 관리</h4>
                    <p className="text-sm text-gray-500">카드, 계좌 등록 및 관리</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mb-8">
          <h3 className="text-lg font-medium mb-4">알림 설정</h3>
          <div className="space-y-3">
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <i className="ri-notification-4-line text-xl text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">푸시 알림</h4>
                    <p className="text-sm text-gray-500">예약, 할인, 이벤트 알림</p>
                  </div>
                </div>
                <div
                  className={`toggle-switch ${toggles.push ? 'active' : ''}`}
                  onClick={() => handleToggle('push')}
                />
              </div>
            </div>
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <i className="ri-mail-line text-xl text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">이메일 알림</h4>
                    <p className="text-sm text-gray-500">예약 확인 및 영수증 발송</p>
                  </div>
                </div>
                <div
                  className={`toggle-switch ${toggles.email ? 'active' : ''}`}
                  onClick={() => handleToggle('email')}
                />
              </div>
            </div>
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    <i className="ri-message-3-line text-xl text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">SMS 알림</h4>
                    <p className="text-sm text-gray-500">예약 확정 및 변경 알림</p>
                  </div>
                </div>
                <div
                  className={`toggle-switch ${toggles.sms ? 'active' : ''}`}
                  onClick={() => handleToggle('sms')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mb-8">
          <h3 className="text-lg font-medium mb-4">앱 설정</h3>
          <div className="space-y-3">
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <i className="ri-palette-line text-xl text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">다크 모드</h4>
                    <p className="text-sm text-gray-500">어두운 테마로 변경</p>
                  </div>
                </div>
                <div
                  className={`toggle-switch ${toggles.darkMode ? 'active' : ''}`}
                  onClick={() => handleToggle('darkMode')}
                />
              </div>
            </div>
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <i className="ri-translate-2 text-xl text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">언어 설정</h4>
                    <p className="text-sm text-gray-500">한국어</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </div>
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                    <i className="ri-map-pin-line text-xl text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">위치 서비스</h4>
                    <p className="text-sm text-gray-500">근처 캠핑장 추천</p>
                  </div>
                </div>
                <div
                  className={`toggle-switch ${toggles.location ? 'active' : ''}`}
                  onClick={() => handleToggle('location')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mb-8">
          <h3 className="text-lg font-medium mb-4">개인정보</h3>
          <div className="space-y-3">
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <i className="ri-file-list-3-line text-xl text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">개인정보 처리방침</h4>
                    <p className="text-sm text-gray-500">개인정보 수집 및 이용 안내</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </div>
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <i className="ri-shield-check-line text-xl text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">이용약관</h4>
                    <p className="text-sm text-gray-500">서비스 이용 약관</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </div>
            <div className="setting-item bg-white rounded-xl p-4 shadow-sm cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <i className="ri-download-line text-xl text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">개인정보 다운로드</h4>
                    <p className="text-sm text-gray-500">내 정보 내보내기</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mb-8">
          <h3 className="text-lg font-medium mb-4">계정 관리</h3>
          <div className="space-y-3">
            <div
              className="setting-item bg-white rounded-xl p-4 shadow-sm cursor-pointer"
              onClick={() => handleSettingClick('로그아웃')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                    <i className="ri-logout-box-r-line text-xl text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">로그아웃</h4>
                    <p className="text-sm text-gray-500">현재 계정에서 로그아웃</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </div>
            <div
              className="setting-item bg-white rounded-xl p-4 shadow-sm cursor-pointer"
              onClick={() => handleSettingClick('회원탈퇴')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <i className="ri-delete-bin-6-line text-xl text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">회원탈퇴</h4>
                    <p className="text-sm text-gray-500">계정 및 모든 데이터 삭제</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/i.webp" className="w-12 h-12 rounded-xl" alt="앱 아이콘" />
              <div>
                <h4 className="font-medium">ThankQ Camping</h4>
                <p className="text-sm text-gray-600">버전 2.1.0</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="setting-item flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer">
                <span className="text-sm">업데이트 확인</span>
                <i className="ri-arrow-right-s-line text-gray-400" />
              </div>
              <div className="setting-item flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer">
                <span className="text-sm">오픈소스 라이선스</span>
                <i className="ri-arrow-right-s-line text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </main>

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
      )}
    </div>
  );
}
