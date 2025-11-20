import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function WeatherPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('서울특별시 강남구');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const rainChartRef = useRef(null);
  const windChartRef = useRef(null);

  useEffect(() => {
    document.title = '날씨 예측 - ThankQ Camping';
    
    // ECharts 로드
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.5.0/echarts.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.echarts) {
        // 강수량 차트
        if (rainChartRef.current) {
          const rainChart = window.echarts.init(rainChartRef.current);
          const rainOption = {
            grid: { top: 20, right: 20, bottom: 30, left: 40 },
            xAxis: {
              type: 'category',
              data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
              axisLabel: { fontSize: 10 }
            },
            yAxis: {
              type: 'value',
              name: 'mm',
              nameTextStyle: { fontSize: 10 },
              axisLabel: { fontSize: 10 }
            },
            series: [{
              data: [0, 0, 0.2, 0.5, 0, 0, 1.2, 0.8],
              type: 'bar',
              itemStyle: { color: '#4A90E2' },
              barWidth: '60%'
            }]
          };
          rainChart.setOption(rainOption);
        }

        // 바람 차트
        if (windChartRef.current) {
          const windChart = window.echarts.init(windChartRef.current);
          const windOption = {
            grid: { top: 10, right: 20, bottom: 20, left: 40 },
            xAxis: {
              type: 'category',
              data: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
              axisLabel: { fontSize: 10 }
            },
            yAxis: {
              type: 'value',
              name: 'm/s',
              nameTextStyle: { fontSize: 10 },
              axisLabel: { fontSize: 10 }
            },
            series: [{
              data: [1.5, 2.1, 2.8, 3.2, 2.5, 1.8],
              type: 'line',
              smooth: true,
              itemStyle: { color: '#FF7A45' },
              lineStyle: { color: '#FF7A45' }
            }]
          };
          windChart.setOption(windOption);
        }
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleCurrentLocation = () => {
    setIsLoadingLocation(true);
    setTimeout(() => setIsLoadingLocation(false), 1500);
  };

  return (
    <div className="min-h-[762px] mx-auto bg-gray-50">
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
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <i className="ri-arrow-left-line text-xl" />
          </button>
          <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">날씨 예측</h1>
          <button
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={handleShare}
          >
            <i className="ri-share-line text-xl" />
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="search"
              className="w-full h-12 pl-12 pr-16 text-sm bg-gray-50 border-none !rounded-button search-input"
              placeholder="지역을 검색하세요"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
              <i className="ri-search-line text-gray-400" />
            </div>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary text-white !rounded-full cursor-pointer"
              onClick={handleCurrentLocation}
            >
              {isLoadingLocation ? (
                <i className="ri-loader-4-line text-sm animate-spin" />
              ) : (
                <i className="ri-map-pin-fill text-sm" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="px-4">
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-medium">{location}</h2>
                <p className="text-sm text-gray-500">현재 위치</p>
              </div>
              <button
                className="w-10 h-10 flex items-center justify-center bg-gray-50 !rounded-full cursor-pointer"
                onClick={handleRefresh}
              >
                {isRefreshing ? (
                  <i className="ri-loader-4-line text-lg animate-spin" />
                ) : (
                  <i className="ri-refresh-line text-lg" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <i className="ri-sun-line text-4xl text-yellow-500" />
              </div>
              <div>
                <div className="text-3xl font-light mb-1">23°C</div>
                <div className="text-sm text-gray-600">체감온도 25°C</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-600 mb-1">맑음</div>
                <div className="text-xs text-gray-500">습도 65%</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <i className="ri-eye-line text-lg text-gray-400 mb-1" />
                <div className="text-xs text-gray-500">가시거리</div>
                <div className="text-sm font-medium">10km</div>
              </div>
              <div>
                <i className="ri-drop-line text-lg text-blue-400 mb-1" />
                <div className="text-xs text-gray-500">강수확률</div>
                <div className="text-sm font-medium">10%</div>
              </div>
              <div>
                <i className="ri-windy-line text-lg text-gray-400 mb-1" />
                <div className="text-xs text-gray-500">바람</div>
                <div className="text-sm font-medium">2m/s</div>
              </div>
              <div>
                <i className="ri-sun-line text-lg text-orange-400 mb-1" />
                <div className="text-xs text-gray-500">자외선</div>
                <div className="text-sm font-medium">보통</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">시간별 날씨</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[
                { time: '지금', icon: 'ri-sun-line', temp: 23, rain: 10 },
                { time: '14시', icon: 'ri-sun-line', temp: 25, rain: 5 },
                { time: '15시', icon: 'ri-sun-cloudy-line', temp: 26, rain: 15 },
                { time: '16시', icon: 'ri-sun-cloudy-line', temp: 24, rain: 20 },
                { time: '17시', icon: 'ri-cloudy-line', temp: 22, rain: 30 },
                { time: '18시', icon: 'ri-cloudy-line', temp: 21, rain: 25 }
              ].map((item, idx) => (
                <div key={idx} className="min-w-[60px] text-center">
                  <div className="text-xs text-gray-500 mb-2">{item.time}</div>
                  <i className={`${item.icon} text-2xl ${item.icon.includes('sun') ? 'text-yellow-500' : 'text-blue-400'} mb-2`} />
                  <div className="text-sm font-medium mb-1">{item.temp}°</div>
                  <div className="text-xs text-blue-500">{item.rain}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ri-tent-line text-xl text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">캠핑 적합도</h3>
                <p className="text-sm text-gray-600">오늘의 캠핑 지수</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">종합 지수</span>
                <span className="text-lg font-bold text-green-600">85점</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
              <p className="text-xs text-gray-600 mt-2">캠핑하기 매우 좋은 날씨입니다</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: 'ri-temp-hot-line', label: '기온', score: 90, status: '적정' },
                { icon: 'ri-drop-line', label: '강수', score: 95, status: '낮음' },
                { icon: 'ri-windy-line', label: '바람', score: 80, status: '약함' },
                { icon: 'ri-water-percent-line', label: '습도', score: 75, status: '보통' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <i className={`${item.icon} text-primary`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{item.status}</span>
                    <span className={`text-sm font-bold ${item.score >= 90 ? 'text-green-600' : item.score >= 80 ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {item.score}점
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="ri-robot-line text-primary" />
                <span className="text-sm font-medium">AI 추천 시간</span>
              </div>
              <p className="text-xs text-gray-600">오후 2시~5시가 캠핑 설치에 가장 적합합니다</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">7일 예보</h3>
            <div className="space-y-3">
              {[
                { day: '오늘', icon: 'ri-sun-line', weather: '맑음', rain: 10, temp: '15° / 26°' },
                { day: '내일', icon: 'ri-sun-cloudy-line', weather: '구름많음', rain: 30, temp: '17° / 24°' },
                { day: '목요일', icon: 'ri-cloudy-2-line', weather: '흐림', rain: 60, temp: '16° / 22°' },
                { day: '금요일', icon: 'ri-rainy-line', weather: '비', rain: 80, temp: '14° / 19°' },
                { day: '토요일', icon: 'ri-sun-cloudy-line', weather: '구름많음', rain: 40, temp: '16° / 23°' },
                { day: '일요일', icon: 'ri-sun-line', weather: '맑음', rain: 10, temp: '18° / 25°' },
                { day: '월요일', icon: 'ri-sun-line', weather: '맑음', rain: 5, temp: '19° / 27°' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-12">{item.day}</span>
                    <i className={`${item.icon} text-xl ${item.icon.includes('sun') ? 'text-yellow-500' : item.icon.includes('rain') ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="text-sm text-gray-600">{item.weather}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-500">{item.rain}%</span>
                    <span className="text-sm">{item.temp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">강수량 예측</h3>
            <div ref={rainChartRef} className="h-48" />
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">바람 정보</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
                  <i className="ri-navigation-line text-2xl text-blue-500" style={{ transform: 'rotate(45deg)' }} />
                </div>
                <div className="text-sm font-medium">북동풍</div>
                <div className="text-xs text-gray-500">풍향</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-green-600">2.1</span>
                </div>
                <div className="text-sm font-medium">m/s</div>
                <div className="text-xs text-gray-500">풍속</div>
              </div>
            </div>
            <div ref={windChartRef} className="h-32" />
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">일출/일몰</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                  <i className="ri-sun-line text-xl text-orange-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">일출</div>
                  <div className="text-lg font-bold">06:42</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <i className="ri-moon-line text-xl text-purple-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">일몰</div>
                  <div className="text-lg font-bold">19:28</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">캠핑장 기상특보</h3>
              <span className="text-xs text-gray-500">최근 업데이트: 10:30</span>
            </div>
            <div className="space-y-4">
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <i className="ri-alert-line text-lg text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-red-700">산사태 주의 지역</h4>
                    <p className="text-sm text-red-600">강원도 및 경상북도 산간 지역</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {['설악산 국립공원 캠핑장', '지리산 달궁 캠핑장', '소백산 죽령 캠핑장'].map((name, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-red-700">
                      <i className="ri-checkbox-circle-line" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <i className="ri-snowy-line text-lg text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-blue-700">폭설 예상 지역</h4>
                    <p className="text-sm text-blue-600">강원도 산간 지역 (해발 700m 이상)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    '대관령 캠핑장 (예상 적설량: 25cm)',
                    '용평 캠핑장 (예상 적설량: 20cm)',
                    '홍천 무궁화 캠핑장 (예상 적설량: 15cm)'
                  ].map((name, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-blue-700">
                      <i className="ri-checkbox-circle-line" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Link to="/search_map?from=nearby">
        <button className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white !rounded-full shadow-lg flex items-center justify-center cursor-pointer">
          <i className="ri-map-pin-fill text-xl" />
        </button>
      </Link>

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
