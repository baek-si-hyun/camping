import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FAQ_ITEMS, QUICK_HELP_ITEMS, FOOTER_LINKS } from '../../constants/customerService.js';

export default function CustomerServicePage() {
  const navigate = useNavigate();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    document.title = '고객센터 - ThankQ Camping';
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
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
        .service-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .service-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .faq-item {
          transition: all 0.3s ease;
        }
        .contact-item {
          transition: all 0.3s ease;
        }
        .contact-item:hover {
          transform: scale(1.02);
        }
        .chat-bubble {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
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
          <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">고객센터</h1>
          <div className="w-8 h-8" />
        </div>
      </header>

      <main className="pt-16 pb-20">
        <div className="px-4 pt-4 mb-6">
          <div className="relative">
            <input
              type="search"
              className="w-full h-12 pl-12 pr-4 text-sm bg-white border border-gray-200 rounded-xl"
              placeholder="궁금한 내용을 검색해보세요"
              disabled
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <i className="ri-search-line text-gray-400" />
            </div>
            <button className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-300 text-gray-500 rounded-lg text-sm" disabled>
              검색
            </button>
          </div>
        </div>

        <div className="px-4 mb-8">
          <h3 className="text-lg font-medium mb-4">빠른 도움말</h3>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_HELP_ITEMS.map((item) => (
              <div key={item.label} className="service-card bg-white rounded-xl p-4 shadow-sm">
                <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <i className={`${item.icon} text-xl`} />
                </div>
                <h4 className="font-medium text-center mb-1">{item.label}</h4>
                <p className="text-xs text-gray-600 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mb-8">
          <h3 className="text-lg font-medium mb-4">연락 방법</h3>
          <div className="space-y-3">
            <div className="contact-item bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <i className="ri-chat-3-line text-xl text-primary chat-bubble" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">실시간 채팅</h4>
                  <p className="text-sm text-gray-600">평일 09:00 - 18:00</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-600">상담 가능</span>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </div>
            <a href="tel:1588-1234" className="contact-item bg-white rounded-xl p-4 shadow-sm block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-phone-line text-xl text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">전화 상담</h4>
                  <p className="text-sm text-primary font-medium">1588-1234</p>
                  <p className="text-xs text-gray-600">평일 09:00 - 18:00</p>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </a>
            <a href="mailto:support@thankqcamping.com" className="contact-item bg-white rounded-xl p-4 shadow-sm block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-mail-line text-xl text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">이메일 문의</h4>
                  <p className="text-sm text-gray-600">support@thankqcamping.com</p>
                  <p className="text-xs text-gray-600">24시간 접수 (답변: 1영업일)</p>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-gray-400" />
              </div>
            </a>
          </div>
        </div>

        <div className="px-4 mb-8">
          <h3 className="text-lg font-medium mb-4">자주 묻는 질문</h3>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => (
              <div
                key={index}
                className={`faq-item bg-white rounded-xl shadow-sm ${openFaqIndex === index ? 'active' : ''}`}
              >
                <div
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleFaq(index)}
                >
                  <h4 className="font-medium text-sm">{faq.question}</h4>
                  <i
                    className={`ri-arrow-down-s-line text-xl text-gray-400 transition-transform ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {openFaqIndex === index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <i className="ri-time-line text-xl text-primary" />
              </div>
              <div>
                <h3 className="font-medium">고객센터 운영시간</h3>
                <p className="text-sm text-gray-600">언제든지 도움을 받으실 수 있습니다</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>전화 상담</span>
                <span className="font-medium">평일 09:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>실시간 채팅</span>
                <span className="font-medium">평일 09:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>이메일 문의</span>
                <span className="font-medium">24시간 접수</span>
              </div>
              <div className="text-xs text-gray-500 mt-3">
                * 주말 및 공휴일에는 전화 상담이 제한될 수 있습니다.
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mb-8">
          <h3 className="text-lg font-medium mb-4">앱 정보</h3>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/i.webp" className="w-12 h-12 rounded-xl" alt="앱 아이콘" />
              <div>
                <h4 className="font-medium">ThankQ Camping</h4>
                <p className="text-sm text-gray-600">버전 2.1.0</p>
              </div>
            </div>
            <div className="space-y-3">
              {FOOTER_LINKS.map((item) => (
                <div key={item} className="service-card flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer">
                  <span className="text-sm">{item}</span>
                  <i className="ri-arrow-right-s-line text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <i className="ri-feedback-line text-xl text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium">앱 개선 제안</h3>
                <p className="text-sm text-gray-600">더 나은 서비스를 위한 의견을 보내주세요</p>
              </div>
            </div>
            <button className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg font-medium !rounded-button" disabled>
              피드백 보내기
            </button>
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
                <i className="ri-customer-service-line text-xl text-primary" />
                <span>고객센터</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
