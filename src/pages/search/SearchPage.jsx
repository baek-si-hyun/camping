import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CAMPING_TYPES, TYPE_DISPLAY_NAMES } from '../../constants/search.js';

export default function SearchPage() {
  const navigate = useNavigate();
  const locationSearchRef = useRef(null);
  const priceRangeRef = useRef(null);
  
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(10000);
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [selectedType, setSelectedType] = useState('normal');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [selectedDateText, setSelectedDateText] = useState('체크인 - 체크아웃 날짜를 선택하세요');
  const [wishlistItems, setWishlistItems] = useState(new Set());

  useEffect(() => {
    document.title = '숙소검색';
  }, []);

  useEffect(() => {
    if (priceRangeRef.current) {
      updateSliderBackground(priceRangeRef.current);
    }
  }, [price]);

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

  const updateSliderBackground = (slider) => {
    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    const val = parseInt(slider.value);
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.backgroundSize = `${percentage}% 100%`;
  };

  const handlePriceChange = (e) => {
    setPrice(parseInt(e.target.value));
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
    
    // 이전 달 빈 칸
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, disabled: true });
    }

    // 현재 달 날짜
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

  const handleSearch = () => {
    if (!location && selectedType === 'normal') {
      alert('지역을 입력하거나 캠핑 타입을 선택해주세요.');
      return;
    }

    const queryParts = [];
    if (location) {
      queryParts.push(location);
    }
    if (selectedType && selectedType !== 'normal') {
      queryParts.push(TYPE_DISPLAY_NAMES[selectedType]);
    }

    const queryText = queryParts.join(' ').trim();
    const payload = {
      query: queryText || undefined,
      location: location || undefined,
      type: selectedType,
      maxPrice: price,
      adults: adultCount,
      children: childCount
    };

    if (checkInDate && checkOutDate) {
      payload.checkin = formatCalendarDate(checkInDate);
      payload.checkout = formatCalendarDate(checkOutDate);
      payload.nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    }

    navigate('/search_result', { state: payload });
  };

  const toggleWishlist = (id) => {
    setWishlistItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const calendarDays = renderCalendar();
  const nights = checkInDate && checkOutDate 
    ? Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="bg-[#F8F7FF] min-h-[762px]">
      <style>{`
        :where([class^="ri-"])::before {
          content: "\\f3c2";
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="range"] {
          -webkit-appearance: none;
          height: 8px;
          background: #E5E7EB;
          border-radius: 9999px;
          background-image: linear-gradient(#7C3AED, #7C3AED);
          background-size: 0% 100%;
          background-repeat: no-repeat;
          transition: background-size 0.3s ease;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #7C3AED;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(124, 58, 237, 0.4);
        }
        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #7C3AED;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(124, 58, 237, 0.4);
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
            <button className="text-primary font-medium relative after:absolute after:bottom-[-14px] after:left-0 after:w-full after:h-[2px] after:bg-primary">
              숙소검색
            </button>
            <Link to="/search_map" className="text-gray-400 hover:text-gray-600">
              지도검색
            </Link>
          </div>
          <Link to="/" className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full">
            <i className="ri-home-5-line text-xl" />
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-20 px-4">
        <div className="space-y-5 pb-7">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <img
                src="https://readdy.ai/api/search-image?query=3D%20icon%20of%20a%20magnifying%20glass%2C%20modern%20design%2C%20soft%20gradients%2C%20centered%20composition%2C%20isolated%20on%20transparent%20background%2C%20smooth%20shading&width=32&height=32&seq=1&orientation=squarish"
                className="w-6 h-6"
                alt="search"
              />
            </div>
            <input
              ref={locationSearchRef}
              type="text"
              placeholder="지역을 입력하세요"
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-white shadow-sm focus:shadow-md transition-shadow duration-300 focus:outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4 price-slider-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://readdy.ai/api/search-image?query=3D%20icon%20of%20a%20price%20tag%2C%20modern%20design%2C%20soft%20gradients%2C%20centered%20composition%2C%20isolated%20on%20transparent%20background%2C%20smooth%20shading&width=32&height=32&seq=2&orientation=squarish"
                  className="w-6 h-6"
                  alt="price"
                />
                <span className="font-medium">가격 범위</span>
              </div>
              <div className="text-sm text-primary">₩{price.toLocaleString()}</div>
            </div>
            <div className="relative pt-1">
              <input
                ref={priceRangeRef}
                type="range"
                min={10000}
                max={1000000}
                step={10000}
                value={price}
                onChange={handlePriceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

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

          <div className="bg-white rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">타사 대비 평균</span>
              <span className="text-primary font-medium">15% 저렴</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">야놀자</span>
                <span className="text-sm">₩150,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">여기어때</span>
                <span className="text-sm">₩145,000</span>
              </div>
              <div className="flex justify-between items-center text-primary font-medium">
                <span>우리 플랫폼</span>
                <span>₩127,500</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <button
          className="w-full h-14 bg-primary text-white font-medium rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow duration-300"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>

      {/* 캘린더 모달 */}
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
    </div>
  );
}
