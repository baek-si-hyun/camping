import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROOM_TYPES, ROOM_FEATURES } from '../../constants/reservation.js';

export default function ReservationPage() {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const parseDateString = (value) => {
    if (!value) return null;
    const [y, m, d] = value.split('.').map((v) => parseInt(v, 10));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };
  
  const [checkInDate, setCheckInDate] = useState(() => {
    const parsed = parseDateString(locationState?.checkIn);
    if (parsed) return parsed;
    return new Date(2025, 6, 8);
  });
  
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const parsed = parseDateString(locationState?.checkOut);
    if (parsed) return parsed;
    return new Date(2025, 6, 9);
  });
  
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(checkInDate));
  const [selectedRoomType, setSelectedRoomType] = useState(() => {
    const roomId = locationState?.roomId;
    return roomId || 'deluxe';
  });
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [options, setOptions] = useState({
    bbq: false,
    breakfast: false,
    wine: false
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [easyPaymentType, setEasyPaymentType] = useState('kakao');
  const [showCardIssuersModal, setShowCardIssuersModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false
  });
  
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    email: '',
    request: ''
  });
  
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const roomPrice = locationState?.roomPrice !== undefined
    ? Number(locationState.roomPrice)
    : ROOM_TYPES.find(r => r.id === selectedRoomType)?.price || 130000;
  const roomNameFromState = locationState?.roomName;
  const roomImgFromState = locationState?.roomImg;
  const roomCapacityFromState = locationState?.roomCapacity;
  const roomAreaFromState = locationState?.roomArea;

  const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;
  const roomTotalPrice = roomPrice * nights;
  const optionsPrice = (options.bbq ? 30000 : 0) + (options.breakfast ? 15000 : 0) + (options.wine ? 45000 : 0);
  const totalPrice = roomTotalPrice + optionsPrice;

  useEffect(() => {
    document.title = '예약하기';
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d} (${days[date.getDay()]})`;
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
        inRange: isInRange,
        isStart: isSelectedStart,
        isEnd: isSelectedEnd
      });
    }

    // 다음 달 빈 칸
    const endIdx = lastDay.getDay();
    for (let i = 1; i < 7 - endIdx; i++) {
      days.push({ day: i, disabled: true });
    }

    return days;
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 3 && value.length <= 7) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length > 7) {
      value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
    }
    setGuestInfo(prev => ({ ...prev, phone: value }));
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 9) {
      value = value.slice(0, 9) + '-' + value.slice(9);
    }
    if (value.length > 14) {
      value = value.slice(0, 14) + '-' + value.slice(14);
    }
    setCardInfo(prev => ({ ...prev, number: value.slice(0, 19) }));
  };

  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardInfo(prev => ({ ...prev, expiry: value.slice(0, 5) }));
  };

  const handleCardCvcChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
    setCardInfo(prev => ({ ...prev, cvc: value }));
  };

  const validateForm = () => {
    if (!guestInfo.name.trim()) {
      showToast('예약자 이름을 입력해주세요');
      return false;
    }
    if (!guestInfo.phone.trim() || guestInfo.phone.replace(/[^0-9]/g, '').length < 10) {
      showToast('올바른 연락처를 입력해주세요');
      return false;
    }
    if (!guestInfo.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      showToast('올바른 이메일을 입력해주세요');
      return false;
    }
    if (!agreements.terms || !agreements.privacy) {
      showToast('필수 약관에 동의해주세요');
      return false;
    }
    if (paymentMethod === 'card') {
      if (!cardInfo.number || cardInfo.number.replace(/[^0-9]/g, '').length < 16) {
        showToast('올바른 카드번호를 입력해주세요');
        return false;
      }
      if (!cardInfo.expiry || !/^\d{2}\/\d{2}$/.test(cardInfo.expiry)) {
        showToast('올바른 유효기간을 입력해주세요 (MM/YY)');
        return false;
      }
      if (!cardInfo.cvc || cardInfo.cvc.length < 3) {
        showToast('올바른 CVC를 입력해주세요');
        return false;
      }
    }
    return true;
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

  const handleReservation = () => {
    if (validateForm()) {
      setShowReservationModal(true);
    }
  };

  const selectedRoom = ROOM_TYPES.find(r => r.id === selectedRoomType) || ROOM_TYPES[0];
  const resolvedRoomName = roomNameFromState || selectedRoom.name;
  const resolvedRoomArea = roomAreaFromState || selectedRoom.area;
  const resolvedRoomCapacity = roomCapacityFromState || selectedRoom.capacity;
  const resolvedRoomImg = roomImgFromState || selectedRoom.image;
  const calendarDays = renderCalendar();

  return (
    <div className="bg-white min-h-[762px] pb-24">
      <style>{`
        :where([class^="ri-"])::before {
          content: "\\f3c2";
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .calendar-day {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 50%;
          position: relative;
        }
        .calendar-day.selected {
          background-color: #7C3AED;
          color: white;
        }
        .calendar-day.range {
          background-color: #EDE9FE;
          color: #7C3AED;
          border-radius: 0;
        }
        .calendar-day.range-start {
          background-color: #7C3AED;
          color: white;
          border-top-left-radius: 50%;
          border-bottom-left-radius: 50%;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        .calendar-day.range-end {
          background-color: #7C3AED;
          color: white;
          border-top-right-radius: 50%;
          border-bottom-right-radius: 50%;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        .calendar-day.disabled {
          color: #D1D5DB;
          cursor: not-allowed;
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="flex items-center px-4 h-16 relative">
          <button
            className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full"
            onClick={() => navigate(-1)}
          >
            <i className="ri-arrow-left-s-line text-xl" />
          </button>
          <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">예약하기</h1>
          <div className="w-10 h-10 ml-auto" />
        </div>
      </nav>

      <main className="pt-20 px-4">
        <section className="mb-6">
          <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
            <img
              src={resolvedRoomImg || 'https://readdy.ai/api/search-image?query=Luxury%20glamping%20tent%20in%20forest%20setting%2C%20cozy%20interior%20with%20comfortable%20bed%2C%20warm%20lighting%2C%20natural%20wood%20elements%2C%20high-quality%20professional%20photography%2C%20no%20people%2C%20serene%20atmosphere&width=100&height=100&seq=101&orientation=squarish'}
              className="w-[80px] h-[80px] rounded-md object-cover"
              alt="숙소 이미지"
            />
            <div>
              <h2 className="font-medium">
                {resolvedRoomName}
              </h2>
              <div className="flex items-center gap-1 mt-1 text-sm">
                <i className="ri-star-fill text-yellow-400 text-xs" />
                <span className="font-medium">4.8</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-600">리뷰 128개</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                <i className="ri-map-pin-line text-primary text-xs" />
                <span>강원도 홍천군 서면</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium mb-4">날짜 선택</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <span className="text-sm text-gray-500">체크인</span>
              <div className="font-medium">{formatDate(checkInDate)}</div>
            </div>
            <div className="w-8 h-[2px] bg-gray-200" />
            <div className="flex-1 flex flex-col">
              <div className="self-end">
                <span className="text-sm text-gray-500">체크아웃</span>
                <div className="font-medium">{checkOutDate ? formatDate(checkOutDate) : '선택해주세요'}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full"
                onClick={() => {
                  const newDate = new Date(currentCalendarDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentCalendarDate(newDate);
                }}
              >
                <i className="ri-arrow-left-s-line" />
              </button>
              <h3 className="font-medium">
                {currentCalendarDate.getFullYear()}년 {currentCalendarDate.getMonth() + 1}월
              </h3>
              <button
                className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-full"
                onClick={() => {
                  const newDate = new Date(currentCalendarDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentCalendarDate(newDate);
                }}
              >
                <i className="ri-arrow-right-s-line" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div key={day} className="text-sm text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayData, index) => (
                <div
                  key={index}
                  className={`calendar-day ${
                    dayData.disabled
                      ? 'disabled'
                      : dayData.selected
                      ? 'selected'
                      : dayData.inRange
                      ? 'range'
                      : ''
                  } ${dayData.isStart ? 'range-start' : ''} ${dayData.isEnd ? 'range-end' : ''}`}
                  onClick={() => !dayData.disabled && handleDateClick(dayData.day)}
                >
                  {dayData.day}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>선택한 날짜</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <span>예약 불가</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div className="text-gray-600">
              총 <span className="font-medium">{nights}</span>박
            </div>
            <div className="text-primary font-medium">₩{roomPrice.toLocaleString()} / 1박</div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium mb-4">선택된 객실</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex gap-3">
              <img
                src={resolvedRoomImg || 'https://readdy.ai/api/search-image?query=Luxury%20glamping%20tent%20interior%20with%20queen%20size%20bed%2C%20cozy%20lighting%2C%20wooden%20furniture%2C%20professional%20photography%2C%20no%20people&width=120&height=120&seq=301&orientation=squarish'}
                className="w-[80px] h-[80px] rounded-md object-cover"
                alt={resolvedRoomName}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{resolvedRoomName}</h4>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">선택됨</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                  <span>면적: {resolvedRoomArea}</span>
                  <span>기준 2인 / 최대 {resolvedRoomCapacity}인</span>
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2">
                  {ROOM_FEATURES[selectedRoomType]?.map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-primary font-medium">₩{roomPrice.toLocaleString()} / 1박</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium mb-4">인원 선택</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">성인</h4>
                <p className="text-sm text-gray-500">만 13세 이상</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full cursor-pointer"
                  onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                >
                  <i className="ri-subtract-line" />
                </button>
                <span className="w-6 text-center">{adultCount}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full cursor-pointer"
                  onClick={() => {
                    const maxCapacity = resolvedRoomCapacity;
                    if (adultCount + childCount < maxCapacity) {
                      setAdultCount(adultCount + 1);
                    } else {
                      showToast(`최대 ${maxCapacity}명까지 가능합니다`);
                    }
                  }}
                >
                  <i className="ri-add-line" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">아동</h4>
                <p className="text-sm text-gray-500">만 12세 이하</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full cursor-pointer"
                  onClick={() => setChildCount(Math.max(0, childCount - 1))}
                >
                  <i className="ri-subtract-line" />
                </button>
                <span className="w-6 text-center">{childCount}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full cursor-pointer"
                  onClick={() => {
                    const maxCapacity = resolvedRoomCapacity;
                    if (adultCount + childCount < maxCapacity) {
                      setChildCount(childCount + 1);
                    } else {
                      showToast(`최대 ${maxCapacity}명까지 가능합니다`);
                    }
                  }}
                >
                  <i className="ri-add-line" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium mb-4">추가 옵션</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">바베큐 세트</h4>
                <p className="text-sm text-gray-500">숯, 그릴, 집게, 장갑 포함</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">₩30,000</span>
                <button
                  type="button"
                  className={`relative w-[52px] h-8 rounded-full transition-colors duration-200 ${
                    options.bbq ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  onClick={() => setOptions(prev => ({ ...prev, bbq: !prev.bbq }))}
                >
                  <div
                    className={`absolute top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out shadow-md ${
                      options.bbq ? 'translate-x-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">조식 패키지</h4>
                <p className="text-sm text-gray-500">1인당 가격</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">₩15,000</span>
                <button
                  type="button"
                  className={`relative w-[52px] h-8 rounded-full transition-colors duration-200 ${
                    options.breakfast ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  onClick={() => setOptions(prev => ({ ...prev, breakfast: !prev.breakfast }))}
                >
                  <div
                    className={`absolute top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out shadow-md ${
                      options.breakfast ? 'translate-x-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">와인 패키지</h4>
                <p className="text-sm text-gray-500">레드 와인 1병, 치즈 플레이트</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">₩45,000</span>
                <button
                  type="button"
                  className={`relative w-[52px] h-8 rounded-full transition-colors duration-200 ${
                    options.wine ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  onClick={() => setOptions(prev => ({ ...prev, wine: !prev.wine }))}
                >
                  <div
                    className={`absolute top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out shadow-md ${
                      options.wine ? 'translate-x-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium mb-4">예약자 정보</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div>
              <label htmlFor="guest-name" className="block text-sm font-medium mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="guest-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="실명을 입력해주세요"
                value={guestInfo.name}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^가-힣\s]/g, '');
                  setGuestInfo(prev => ({ ...prev, name: value }));
                }}
              />
            </div>
            <div>
              <label htmlFor="guest-phone" className="block text-sm font-medium mb-1">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="guest-phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="010-0000-0000"
                value={guestInfo.phone}
                onChange={handlePhoneChange}
              />
            </div>
            <div>
              <label htmlFor="guest-email" className="block text-sm font-medium mb-1">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="guest-email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="example@email.com"
                value={guestInfo.email}
                onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="guest-request" className="block text-sm font-medium mb-1">요청사항</label>
              <textarea
                id="guest-request"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary h-24 resize-none"
                placeholder="요청사항이 있으시면 입력해주세요"
                value={guestInfo.request}
                onChange={(e) => setGuestInfo(prev => ({ ...prev, request: e.target.value }))}
              />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium mb-4">결제 정보</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div>
              <h4 className="font-medium mb-3">결제 수단 선택</h4>
              <div className="grid grid-cols-3 gap-2">
                <label
                  className={`payment-method flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer ${
                    paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setPaymentMethod('card');
                    setShowCardIssuersModal(true);
                  }}
                >
                  <input type="radio" name="payment-method" value="card" checked={paymentMethod === 'card'} readOnly className="sr-only" />
                  <i className="ri-bank-card-line text-2xl mb-1" />
                  <span className="text-sm">신용카드</span>
                </label>
                <label
                  className={`payment-method flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer ${
                    paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('transfer')}
                >
                  <input type="radio" name="payment-method" value="transfer" checked={paymentMethod === 'transfer'} readOnly className="sr-only" />
                  <i className="ri-bank-line text-2xl mb-1" />
                  <span className="text-sm">계좌이체</span>
                </label>
                <label
                  className={`payment-method flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer ${
                    paymentMethod === 'easy' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('easy')}
                >
                  <input type="radio" name="payment-method" value="easy" checked={paymentMethod === 'easy'} readOnly className="sr-only" />
                  <i className="ri-smartphone-line text-2xl mb-1" />
                  <span className="text-sm">간편결제</span>
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && !showCardIssuersModal && (
              <div>
                <div className="mb-3">
                  <label htmlFor="card-number" className="block text-sm font-medium mb-1">
                    카드번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="card-number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="0000-0000-0000-0000"
                    value={cardInfo.number}
                    onChange={handleCardNumberChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="card-expiry" className="block text-sm font-medium mb-1">
                      유효기간 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="card-expiry"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="MM/YY"
                      value={cardInfo.expiry}
                      onChange={handleCardExpiryChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="card-cvc" className="block text-sm font-medium mb-1">
                      CVC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="card-cvc"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="000"
                      value={cardInfo.cvc}
                      onChange={handleCardCvcChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'transfer' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">입금 계좌 정보</h5>
                <p className="text-sm mb-1">은행명: 신한은행</p>
                <p className="text-sm mb-1">계좌번호: 110-123-456789</p>
                <p className="text-sm mb-1">예금주: (주)숲속글램핑</p>
                <p className="text-sm text-red-500 mt-2">* 예약 확정을 위해 24시간 이내 입금이 필요합니다.</p>
              </div>
            )}

            {paymentMethod === 'easy' && (
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'kakao', icon: 'ri-kakao-talk-fill', color: 'text-yellow-400', label: '카카오페이' },
                  { id: 'naver', icon: 'ri-naver-fill', color: 'text-green-500', label: '네이버페이' },
                  { id: 'payco', icon: 'ri-wallet-3-fill', color: 'text-red-500', label: '페이코' },
                  { id: 'toss', icon: 'ri-secure-payment-fill', color: 'text-blue-500', label: '토스' }
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`easy-payment flex flex-col items-center justify-center p-2 border rounded-lg cursor-pointer ${
                      easyPaymentType === method.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                    onClick={() => setEasyPaymentType(method.id)}
                  >
                    <input
                      type="radio"
                      name="easy-payment-type"
                      value={method.id}
                      checked={easyPaymentType === method.id}
                      readOnly
                      className="sr-only"
                    />
                    <i className={`${method.icon} text-2xl mb-1 ${method.color}`} />
                    <span className="text-xs">{method.label}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="font-medium mb-3">결제 금액</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>객실 요금 ({nights}박)</span>
                  <span>₩{roomTotalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>추가 옵션</span>
                  <span>₩{optionsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-gray-100 mt-2">
                  <span>총 결제 금액</span>
                  <span className="text-primary">₩{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium mb-4">이용 약관 동의</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={agreements.all}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAgreements({
                      all: checked,
                      terms: checked,
                      privacy: checked,
                      marketing: checked
                    });
                  }}
                />
                <div
                  className={`w-5 h-5 border-2 rounded ${
                    agreements.all ? 'bg-primary border-primary' : 'border-gray-300'
                  }`}
                />
                <i
                  className={`ri-check-line text-white absolute text-sm ${
                    agreements.all ? '' : 'hidden'
                  }`}
                />
              </div>
              <span className="font-medium">전체 동의</span>
            </label>
            <div className="w-full h-px bg-gray-200 my-2" />
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={agreements.terms}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAgreements(prev => ({
                      ...prev,
                      terms: checked,
                      all: checked && prev.privacy && prev.marketing
                    }));
                  }}
                />
                <div
                  className={`w-5 h-5 border-2 rounded ${
                    agreements.terms ? 'bg-primary border-primary' : 'border-gray-300'
                  }`}
                />
                <i
                  className={`ri-check-line text-white absolute text-sm ${
                    agreements.terms ? '' : 'hidden'
                  }`}
                />
              </div>
              <div>
                <span className="text-sm">[필수] 숙소 이용 규칙 및 취소/환불 규정 동의</span>
                <button className="text-xs text-primary ml-1">보기</button>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={agreements.privacy}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAgreements(prev => ({
                      ...prev,
                      privacy: checked,
                      all: checked && prev.terms && prev.marketing
                    }));
                  }}
                />
                <div
                  className={`w-5 h-5 border-2 rounded ${
                    agreements.privacy ? 'bg-primary border-primary' : 'border-gray-300'
                  }`}
                />
                <i
                  className={`ri-check-line text-white absolute text-sm ${
                    agreements.privacy ? '' : 'hidden'
                  }`}
                />
              </div>
              <div>
                <span className="text-sm">[필수] 개인정보 수집 및 이용 동의</span>
                <button className="text-xs text-primary ml-1">보기</button>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={agreements.marketing}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAgreements(prev => ({
                      ...prev,
                      marketing: checked,
                      all: checked && prev.terms && prev.privacy
                    }));
                  }}
                />
                <div
                  className={`w-5 h-5 border-2 rounded ${
                    agreements.marketing ? 'bg-primary border-primary' : 'border-gray-300'
                  }`}
                />
                <i
                  className={`ri-check-line text-white absolute text-sm ${
                    agreements.marketing ? '' : 'hidden'
                  }`}
                />
              </div>
              <div>
                <span className="text-sm">[선택] 마케팅 정보 수신 동의</span>
                <button className="text-xs text-primary ml-1">보기</button>
              </div>
            </label>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">총 결제 금액</span>
          <span className="text-xl font-bold text-primary">₩{totalPrice.toLocaleString()}</span>
        </div>
        <button
          className="w-full h-12 bg-primary text-white font-medium !rounded-button shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 cursor-pointer"
          onClick={handleReservation}
        >
          예약하기
        </button>
      </div>

      {showCardIssuersModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setShowCardIssuersModal(false)}
        >
          <div
            className="bg-white rounded-xl w-[320px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">카드사 선택</h3>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  onClick={() => setShowCardIssuersModal(false)}
                >
                  <i className="ri-close-line text-xl" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {[
                { id: 'samsung', name: '삼성카드', desc: '삼성카드 앱카드로 결제', icon: 'ri-samsung-line', color: 'text-blue-500' },
                { id: 'shinhan', name: '신한카드', desc: '신한 앱카드로 결제', icon: 'ri-bank-line', color: 'text-blue-600' },
                { id: 'kb', name: '국민카드', desc: '국민 앱카드로 결제', icon: 'ri-bank-line', color: 'text-yellow-500' },
                { id: 'hyundai', name: '현대카드', desc: '현대카드 앱으로 결제', icon: 'ri-bank-line', color: 'text-red-500' },
                { id: 'lotte', name: '롯데카드', desc: '롯데카드 앱으로 결제', icon: 'ri-bank-line', color: 'text-red-600' }
              ].map((issuer) => (
                <button
                  key={issuer.id}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    const schemes = {
                      samsung: 'samsungcard://',
                      shinhan: 'shinhancard://',
                      kb: 'kb-acp://',
                      hyundai: 'hyundaicard://',
                      lotte: 'lottecard://'
                    };
                    if (schemes[issuer.id]) {
                      window.location.href = schemes[issuer.id];
                      setTimeout(() => {
                        if (!document.hidden) {
                          showToast('해당 카드사 앱이 설치되어 있지 않습니다.');
                        }
                      }, 500);
                    }
                    setShowCardIssuersModal(false);
                  }}
                >
                  <i className={`${issuer.icon} text-2xl ${issuer.color}`} />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{issuer.name}</p>
                    <p className="text-sm text-gray-500">{issuer.desc}</p>
                  </div>
                  <i className="ri-arrow-right-s-line text-xl text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showReservationModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[320px] p-6 animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <i className="ri-check-line text-3xl text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-center mb-2">예약이 완료되었습니다</h3>
            <p className="text-gray-600 text-center mb-6">예약 확인 메일이 발송되었습니다.</p>
            <div className="space-y-3">
              <button
                className="block w-full py-3 bg-primary text-white text-center font-medium !rounded-button"
                onClick={() => navigate('/')}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
