import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PRODUCTS, CATEGORIES, SORT_OPTIONS } from '../../constants/equipment.js';

export default function EquipmentPage() {
  const navigate = useNavigate();

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortType, setSortType] = useState('popular');
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [showCartModal, setShowCartModal] = useState(false);
  const [showPaymentCompleteModal, setShowPaymentCompleteModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    document.title = '캠핑 장비 렌탈 - ThankQ Camping';
  }, []);

  // 필터링 및 정렬된 상품 목록
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = PRODUCTS;

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      if (sortType === 'price') {
        return a.price - b.price;
      } else if (sortType === 'latest') {
        return b.id - a.id;
      } else {
        // popular (기본값: id 순)
        return a.id - b.id;
      }
    });

    return sorted;
  }, [selectedCategory, sortType]);

  // 장바구니 통계
  const cartStats = useMemo(() => {
    const cartItems = Object.entries(cart).filter(([_, qty]) => qty > 0);
    const cartCount = cartItems.length;
    const totalPrice = cartItems.reduce((sum, [productId, qty]) => {
      const product = PRODUCTS.find(p => p.id === Number(productId));
      return sum + (product ? product.price * qty : 0);
    }, 0);

    return { cartCount, totalPrice };
  }, [cart]);

  // 장바구니 모달 통계
  const cartModalStats = useMemo(() => {
    const cartItems = Object.entries(cart).filter(([_, qty]) => qty > 0);
    let subtotal = 0;
    let deposit = 0;

    cartItems.forEach(([productId, qty]) => {
      const product = PRODUCTS.find(p => p.id === Number(productId));
      if (product) {
        subtotal += product.price * qty;
        deposit += product.deposit * qty;
      }
    });

    return { subtotal, deposit, total: subtotal + deposit, items: cartItems };
  }, [cart]);

  // 수량 조절
  const handleQuantityChange = (productId, action) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (!newCart[productId]) {
        newCart[productId] = 0;
      }

      if (action === 'increase') {
        newCart[productId] = (newCart[productId] || 0) + 1;
      } else if (action === 'decrease' && newCart[productId] > 0) {
        newCart[productId] = newCart[productId] - 1;
        if (newCart[productId] === 0) {
          delete newCart[productId];
        }
      }

      return newCart;
    });
  };

  // 전화번호 포맷팅
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '').slice(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  // 유효성 검사
  const validateAddress = (address) => {
    if (!address || address.trim().length === 0) return false;
    const koreanNumberRegex = /^[가-힣0-9\s]+$/;
    return koreanNumberRegex.test(address.trim());
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) return false;
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
  };

  const validateDates = (start, end) => {
    if (!start || !end || start.trim() === '' || end.trim() === '') return false;
    return new Date(start) <= new Date(end);
  };

  // 토스트 메시지 표시
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 결제하기
  const handlePayment = () => {
    if (!deliveryAddress || !validateAddress(deliveryAddress)) {
      showToast('올바른 배송주소를 입력하세요');
      return;
    }

    if (!phoneNumber || !validatePhone(phoneNumber)) {
      showToast('올바른 연락처를 입력하세요');
      return;
    }

    if (!startDate || !endDate || !validateDates(startDate, endDate)) {
      showToast('올바른 대여기간을 선택하세요');
      return;
    }

    setShowPaymentCompleteModal(true);
  };

  // 결제 완료 확인
  const handleConfirmPayment = () => {
    setShowPaymentCompleteModal(false);
    setShowCartModal(false);
    setDeliveryAddress('');
    setPhoneNumber('');
    setStartDate('');
    setEndDate('');
    setCart({});
  };

  const header = (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center cursor-pointer"
        >
          <i className="ri-arrow-left-line text-xl" />
        </button>
        <h1 className="text-lg font-medium">캠핑 장비 렌탈</h1>
        <button
          onClick={() => cartStats.cartCount > 0 && setShowCartModal(true)}
          className="relative cursor-pointer"
        >
          <i className="ri-shopping-cart-line text-xl" />
          {cartStats.cartCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center cart-badge">
              {cartStats.cartCount}
            </div>
          )}
        </button>
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
    <div className="w-[375px] min-h-[762px] mx-auto bg-gray-50 pb-[120px]">
      {header}
      <div>
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

        .category-scroll::-webkit-scrollbar {
          display: none;
        }

        .category-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .product-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .quantity-btn {
          transition: all 0.2s ease;
        }

        .quantity-btn:hover {
          background-color: rgba(255, 122, 69, 0.1);
        }

        .cart-badge {
          animation: bounce 0.5s ease-in-out;
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

        .filter-active {
          background: linear-gradient(135deg, #FF7A45 0%, #FF9A6B 100%);
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

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>

      <main className="pt-[78px] pb-20">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <i className="ri-tent-line text-xl text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-lg">캠핑 장비 대여</h2>
              <p className="text-sm text-gray-600">필요한 장비만 골라서 편리하게</p>
            </div>
          </div>
          <div className="bg-white/70 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="ri-truck-line text-primary" />
              <span className="text-sm font-medium">당일 배송 가능</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <i className="ri-shield-check-line text-green-600" />
              <span>보증금 5만원</span>
            </div>
          </div>
        </div>
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <i className="ri-filter-3-line text-gray-600" />
              <span className="text-sm font-medium">정렬</span>
            </div>
            <div className="flex gap-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortType(option.id)}
                  className={`px-3 py-1 text-xs rounded-full cursor-pointer ${
                    sortType === option.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
          <div className="category-scroll flex gap-3 overflow-x-auto pb-2 mb-6">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium category-btn cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filteredAndSortedProducts.map((product) => {
              const quantity = cart[product.id] || 0;
              return (
                <div
                  key={product.id}
                  className="product-card bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
                  style={{
                    display: selectedCategory === 'all' || product.category === selectedCategory ? 'block' : 'none'
                  }}
                >
                  <div className="relative">
                    <img src={product.image} className="w-full h-32 object-cover object-top" alt={product.name} />
                    {product.badge && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-primary font-bold text-sm">{product.price.toLocaleString()}원/일</span>
                      <span className="text-xs text-gray-500">보증금 {product.deposit.toLocaleString()}원</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <i className="ri-star-fill text-yellow-400 text-xs" />
                        <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(product.id, 'decrease');
                          }}
                          className={`quantity-btn w-6 h-6 rounded-full border flex items-center justify-center text-xs cursor-pointer ${
                            quantity > 0
                              ? 'border-primary text-primary'
                              : 'border-gray-300 text-gray-400'
                          }`}
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">{quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(product.id, 'increase');
                          }}
                          className="quantity-btn w-6 h-6 rounded-full border border-primary text-primary flex items-center justify-center text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-white rounded-xl p-4 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <i className="ri-information-line text-primary text-xl" />
              <h3 className="font-medium">대여 안내</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <i className="ri-check-line text-green-600 mt-0.5" />
                <div>
                  <span className="font-medium">최소 대여 기간:</span> 1일 (당일 반납 가능)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <i className="ri-check-line text-green-600 mt-0.5" />
                <div>
                  <span className="font-medium">배송 지역:</span> 서울, 경기 전 지역 당일 배송
                </div>
              </div>
              <div className="flex items-start gap-2">
                <i className="ri-check-line text-green-600 mt-0.5" />
                <div>
                  <span className="font-medium">보증금 정책:</span> 장비 반납 후 3일 내 환불
                </div>
              </div>
              <div className="flex items-start gap-2">
                <i className="ri-check-line text-green-600 mt-0.5" />
                <div>
                  <span className="font-medium">파손 시:</span> 보증금 내에서 수리비 차감
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 장바구니 바 */}
      <div className="fixed bottom-[52px] left-0 right-0 bg-white border-t px-4 py-3 z-40">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            선택된 상품 <span className="font-medium text-primary">{cartStats.cartCount}</span>개
          </div>
          <div className="text-lg font-bold text-primary">{cartStats.totalPrice.toLocaleString()}원</div>
        </div>
        <button
          onClick={() => cartStats.cartCount > 0 && setShowCartModal(true)}
          disabled={cartStats.cartCount === 0}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          장바구니 보기 및 예약하기
        </button>
      </div>

      {/* 장바구니 모달 */}
      {showCartModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowCartModal(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[81vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium text-lg">장바구니</h3>
              <button
                onClick={() => setShowCartModal(false)}
                className="w-8 h-8 flex items-center justify-center cursor-pointer"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4 mb-6">
                {cartModalStats.items.map(([productId, qty]) => {
                  const product = PRODUCTS.find(p => p.id === Number(productId));
                  if (!product) return null;
                  const itemTotal = product.price * qty;
                  return (
                    <div key={productId} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-xs text-gray-600">
                          {product.price.toLocaleString()}원/일 × {qty}개
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{itemTotal.toLocaleString()}원</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">대여료 합계</span>
                  <span className="font-medium">{cartModalStats.subtotal.toLocaleString()}원</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">보증금 합계</span>
                  <span className="font-medium">{cartModalStats.deposit.toLocaleString()}원</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="font-medium">총 결제 금액</span>
                  <span className="font-bold text-lg text-primary">{cartModalStats.total.toLocaleString()}원</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">배송 주소</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="배송받을 주소를 입력해주세요"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">연락처</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="휴대폰 번호를 입력해주세요"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">대여 기간</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handlePayment}
                className="w-full bg-primary text-white py-4 rounded-lg font-medium mt-6 cursor-pointer"
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 결제 완료 모달 */}
      {showPaymentCompleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[320px] p-6 animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ri-check-line text-3xl text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-center mb-2">결제가 완료되었습니다</h3>
            <p className="text-gray-600 text-center mb-6">장비 대여가 성공적으로 예약되었습니다.</p>
            <button
              onClick={handleConfirmPayment}
              className="w-full py-3 bg-primary text-white text-center font-medium rounded-lg"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 토스트 메시지 */}
      {toastMessage && (
        <div className="fixed top-20 left-0 right-0 mx-auto w-max bg-black/80 text-white px-4 py-3 rounded-lg z-50 animate-fadeIn">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <i className="ri-information-line text-lg" />
            <span className="text-sm">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 사이드 메뉴 외부 클릭 시 닫기 */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSideMenuOpen(false)}
        />
      )}
      </div>
      {bottomNav}
      {sideMenu}
    </div>
  );
}
