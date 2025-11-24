import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SafeImage from '../../components/SafeImage.jsx';

export default function IndexPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const sideMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const weatherContainerRef = useRef(null);
  
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState('올 봄엔 어디로 캠핑을 떠날까요?');
  const [weatherData, setWeatherData] = useState([]);

  // 페이지 제목 설정
  useEffect(() => {
    document.title = 'ThankQ Camping';
  }, []);

  // 비디오 자동재생 시도
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryAutoPlay = async () => {
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        await video.play();
        setIsVideoPlaying(true);
      } catch (error) {
        setIsVideoPlaying(false);
      } finally {
        setIsProcessing(false);
      }
    };

    setTimeout(tryAutoPlay, 500);
  }, [isProcessing]);

  // 날씨 데이터 생성
  useEffect(() => {
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weatherTypes = [
      { icon: 'ri-sun-line', color: 'text-yellow-500', condition: '맑음', weight: 7 },
      { icon: 'ri-sun-cloudy-line', color: 'text-blue-500', condition: '구름', weight: 3 }
    ];

    const getRandomTemp = () => Math.floor(Math.random() * 9) + 20;

    const getRandomWeather = () => {
      const totalWeight = weatherTypes.reduce((sum, weather) => sum + weather.weight, 0);
      let random = Math.random() * totalWeight;

      for (const weather of weatherTypes) {
        random -= weather.weight;
        if (random <= 0) {
          return weather;
        }
      }
      return weatherTypes[0];
    };

    const generateWeather = () => {
      const weather = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dayName = dayNames[date.getDay()];
        const weatherType = getRandomWeather();
        const temp = getRandomTemp();
        weather.push({ dayName, ...weatherType, temp });
      }
      setWeatherData(weather);
    };

    generateWeather();
  }, []);

  // 사이드 메뉴 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sideMenuRef.current &&
        !sideMenuRef.current.contains(event.target) &&
        !event.target.closest('#menuButton') &&
        !event.target.closest('#bottomMenuButton')
      ) {
        setIsSideMenuOpen(false);
      }
    };

    if (isSideMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isSideMenuOpen]);

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  const handlePlayPause = async () => {
    if (isProcessing || !videoRef.current) return;
    setIsProcessing(true);

    try {
      if (videoRef.current.paused || videoRef.current.ended) {
        await videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    } catch (error) {
      setIsVideoPlaying(videoRef.current.paused);
    } finally {
      setTimeout(() => setIsProcessing(false), 100);
    }
  };

  const handleSearch = () => {
    const searchQuery = searchInputRef.current?.value.trim();
    if (!searchQuery) {
      alert('검색어를 입력해주세요.');
      return;
    }

    navigate('/search_result', {
      state: {
        query: searchQuery,
        location: '전국',
        type: '전체'
      }
    });
  };

  return (
    <div className="min-h-[762px] mx-auto bg-white">
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

      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="h-8">
            <SafeImage 
              src="https://readdy.ai/api/search-image?query=Camping%20logo%20design%20with%20tent%20and%20nature%20elements%2C%20modern%20minimalist%20style&width=128&height=32&seq=1&orientation=landscape"
              alt="DaeCamp"
              className="w-32 relative -left-9 -top-2.5"
              width={128}
              height={32}
            />
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <button className="w-8 h-8 flex items-center justify-center">
                <i className="ri-user-line text-xl text-black" />
              </button>
            </Link>
            <button
              id="menuButton"
              className="w-8 h-8 flex items-center justify-center"
              onClick={() => setIsSideMenuOpen(true)}
            >
              <i className="ri-menu-line text-xl" />
            </button>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="search"
              ref={searchInputRef}
              className="w-full h-12 pl-4 pr-12 text-sm bg-gray-50 border-none !rounded-button search-input"
              placeholder={searchPlaceholder}
              onFocus={() => setSearchPlaceholder('지역, 숙소명을 입력하세요')}
              onBlur={(e) => {
                if (!e.target.value) {
                  setSearchPlaceholder('올 봄엔 어디로 캠핑을 떠날까요?');
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <button
              id="searchButton"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer"
              onClick={handleSearch}
            >
              <i className="ri-search-line text-gray-400 hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20">
        <div className="grid grid-cols-4 gap-6 px-4 mb-8">
          <Link to="/shop_list" state={{ type: 'normal' }} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
              <SafeImage 
                src="https://readdy.ai/api/search-image?query=3D%20rendered%20isometric%20camping%20tent%20icon%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=128&height=128&seq=31&orientation=squarish"
                className="w-full h-full object-cover"
                alt="캠핑"
                width={128}
                height={128}
              />
            </div>
            <span className="text-xs">캠핑</span>
          </Link>
          <Link to="/shop_list" state={{ type: 'glamping' }} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
              <SafeImage 
                src="https://readdy.ai/api/search-image?query=3D%20rendered%20isometric%20glamping%20dome%20tent%20icon%2C%20luxury%20camping%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=128&height=128&seq=32&orientation=squarish"
                className="w-full h-full object-cover"
                alt="글램핑"
                width={128}
                height={128}
              />
            </div>
            <span className="text-xs">글램핑</span>
          </Link>
          <Link to="/shop_list" state={{ type: 'pet' }} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
              <SafeImage 
                src="https://readdy.ai/api/search-image?query=3D%20rendered%20isometric%20pet%20friendly%20hotel%20icon%2C%20dog%20house%20symbol%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=128&height=128&seq=33&orientation=squarish"
                className="w-full h-full object-cover"
                alt="반려동물"
                width={128}
                height={128}
              />
            </div>
            <span className="text-xs">반려동물</span>
          </Link>
          <Link to="/shop_list" state={{ type: 'pension' }} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
              <SafeImage 
                src="https://readdy.ai/api/search-image?query=3D%20rendered%20isometric%20pension%20house%20icon%2C%20korean%20style%20building%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=128&height=128&seq=34&orientation=squarish"
                className="w-full h-full object-cover"
                alt="펜션"
                width={128}
                height={128}
              />
            </div>
            <span className="text-xs">펜션</span>
          </Link>
          <Link to="/shop_list" state={{ type: 'hotel' }} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
              <SafeImage 
                src="https://readdy.ai/api/search-image?query=3D%20rendered%20isometric%20hotel%20building%20icon%2C%20modern%20architecture%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=128&height=128&seq=35&orientation=squarish"
                className="w-full h-full object-cover"
                alt="호텔"
                width={128}
                height={128}
              />
            </div>
            <span className="text-xs">호텔</span>
          </Link>
          <Link to="/shop_list" state={{ type: 'sharing' }} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
              <SafeImage 
                src="https://readdy.ai/api/search-image?query=3D%20rendered%20isometric%20private%20house%20icon%2C%20sharing%20economy%20concept%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=128&height=128&seq=36&orientation=squarish"
                className="w-full h-full object-cover"
                alt="공유숙박"
                width={128}
                height={128}
              />
            </div>
            <span className="text-xs">공유숙박</span>
          </Link>
          <Link to="/shop_list" state={{ type: 'hotspring' }} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
              <SafeImage 
                src="https://readdy.ai/api/search-image?query=3D%20rendered%20isometric%20hot%20spring%20icon%2C%20wellness%20concept%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=128&height=128&seq=37&orientation=squarish"
                className="w-full h-full object-cover"
                alt="온천"
                width={128}
                height={128}
              />
            </div>
            <span className="text-xs">온천</span>
          </Link>
          <Link to="/shop_list" state={{ type: 'resort' }} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
              <SafeImage 
                src="https://readdy.ai/api/search-image?query=3D%20rendered%20isometric%20beach%20resort%20icon%2C%20summer%20vacation%20concept%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=128&height=128&seq=38&orientation=squarish"
                className="w-full h-full object-cover"
                alt="리조트"
                width={128}
                height={128}
              />
            </div>
            <span className="text-xs">리조트</span>
          </Link>
        </div>

        <div className="px-4 mb-8">
          <div className="relative h-64 rounded-xl overflow-hidden bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={isVideoMuted}
              loop
              playsInline
              preload="metadata"
              poster="https://readdy.ai/api/search-image?query=Beautiful%20camping%20site%20in%20nature%20with%20tent%20and%20campfire%20at%20sunset%2C%20cinematic%20shot%2C%204k%20quality&width=800&height=600&seq=10&orientation=landscape"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onEnded={() => setIsVideoPlaying(false)}
            >
              <source src="/assets/index_video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-2xl font-medium text-white mb-2">캠핑의 모든 것</h2>
              <p className="text-white/90 text-sm mb-4">자연 속에서 특별한 순간을 만나보세요</p>
              <div className="flex gap-3">
                <Link
                  to="/shop_detail"
                  state={{
                    title: '숲속 글램핑 리조트',
                    region: '경기도 가평군 청평면 대성리',
                    price: 130000,
                    id: 'forest-glamping',
                    rating: 4.8,
                    description: '자연 속에서 특별한 순간을 만나보세요. 럭셔리 글램핑으로 힐링하는 완벽한 휴식',
                    distance: '45km',
                    facilities: '글램핑,데크,바베큐장,샤워실,주차장',
                    badge: '프리미엄 글램핑',
                    image:
                      "https://readdy.ai/api/search-image?query=Beautiful%20camping%20site%20in%20nature%20with%20tent%20and%20campfire%20at%20sunset%2C%20cinematic%20shot%2C%204k%20quality&width=800&height=600&seq=10&orientation=landscape"
                  }}
                  className="px-6 py-2 bg-primary text-white !rounded-button flex items-center gap-2"
                >
                  <i className="ri-play-fill" />
                  <span>둘러보기</span>
                </Link>
                <button className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white !rounded-button flex items-center gap-2">
                  <i className="ri-information-line" />
                  <span>자세히</span>
                </button>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                className="w-10 h-10 bg-black/30 backdrop-blur-sm !rounded-full flex items-center justify-center text-white"
                onClick={handleMuteToggle}
              >
                <i className={isVideoMuted ? 'ri-volume-mute-fill' : 'ri-volume-up-fill'} />
              </button>
              <button
                className="w-10 h-10 bg-black/30 backdrop-blur-sm !rounded-full flex items-center justify-center text-white"
                onClick={handlePlayPause}
              >
                <i className={isVideoPlaying ? 'ri-pause-fill' : 'ri-play-fill'} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="flex justify-between gap-4 overflow-x-auto pb-4 mb-8">
            <Link to="/recommend" className="flex flex-col items-center gap-2 min-w-[80px]">
              <i className="ri-robot-line text-2xl text-primary" />
              <span className="text-xs whitespace-nowrap">AI 추천</span>
            </Link>
            <Link to="/weather" className="flex flex-col items-center gap-2 min-w-[80px]">
              <i className="ri-cloud-line text-2xl text-primary" />
              <span className="text-xs whitespace-nowrap">날씨 예측</span>
            </Link>
            <button className="flex flex-col items-center gap-2 min-w-[80px]">
              <i className="ri-route-line text-2xl text-primary" />
              <span className="text-xs whitespace-nowrap">최적 경로</span>
            </button>
            <button className="flex flex-col items-center gap-2 min-w-[80px]">
              <i className="ri-camera-line text-2xl text-primary" />
              <span className="text-xs whitespace-nowrap">장비 인식</span>
            </button>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <i className="ri-brain-line text-xl text-primary" />
              </div>
              <div>
                <h3 className="font-medium">AI 맞춤 추천</h3>
                <p className="text-sm text-gray-600">당신의 캠핑 스타일을 분석했어요</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-user-star-line text-primary" />
                  <span className="text-sm font-medium">선호 스타일</span>
                </div>
                <p className="text-xs text-gray-600">자연 친화적인 캠핑을 선호하시네요</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-group-line text-primary" />
                  <span className="text-sm font-medium">추천 인원</span>
                </div>
                <p className="text-xs text-gray-600">2-3인 가족 캠핑에 적합해요</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-map-pin-line text-primary" />
                  <span className="text-sm font-medium">추천 장소</span>
                </div>
                <p className="text-xs text-gray-600">계곡이 있는 캠핑장을 추천해요</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-calendar-line text-primary" />
                  <span className="text-sm font-medium">최적 시기</span>
                </div>
                <p className="text-xs text-gray-600">9월 초순이 가장 좋아요</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-home-smile-line text-xl text-primary" />
              <h3 className="text-lg font-medium">프리미엄 글램핑</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              <Link
                to="/shop_detail"
                state={{
                  title: '프리미엄 글램핑 A',
                  region: '경기도 가평군 청평면 대성리',
                  price: 280000,
                  id: 'premium-a',
                  image:
                    "https://readdy.ai/api/search-image?query=Luxury%20glamping%20tent%20interior%20with%20king%20size%20bed%2C%20warm%20lighting%2C%20premium%20camping%20experience%2C%20cozy%20atmosphere&width=560&height=300&seq=17&orientation=landscape"
                }}
                className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[0.98] active:scale-95"
              >
                <div className="relative">
                  <SafeImage
                    src="https://readdy.ai/api/search-image?query=Luxury%20glamping%20tent%20interior%20with%20king%20size%20bed%2C%20warm%20lighting%2C%20premium%20camping%20experience%2C%20cozy%20atmosphere&width=560&height=300&seq=17&orientation=landscape"
                    className="w-full h-36 object-cover"
                    alt="프리미엄 글램핑"
                    fallbackSrc="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=560&h=300&fit=crop&auto=format"
                  />
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">온라인예약</span>
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">프리미엄 글램핑 A</h4>
                  <p className="text-sm text-gray-600">₩280,000 부터</p>
                </div>
              </Link>
              <Link
                to="/shop_detail"
                state={{
                  title: '글램핑 돔 B',
                  region: '경기도 양평군 양서면 용담리',
                  price: 250000,
                  id: 'dome-b',
                  image:
                    "https://readdy.ai/api/search-image?query=Modern%20glamping%20dome%20with%20panoramic%20windows%2C%20forest%20view%2C%20luxury%20camping%20setup&width=560&height=300&seq=18&orientation=landscape"
                }}
                className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[0.98] active:scale-95"
              >
                <div className="relative">
                  <SafeImage 
                    src="https://readdy.ai/api/search-image?query=Modern%20glamping%20dome%20with%20panoramic%20windows%2C%20forest%20view%2C%20luxury%20camping%20setup&width=560&height=300&seq=18&orientation=landscape"
                    className="w-full h-36 object-cover"
                    alt="글램핑"
                    width={560}
                    height={300}
                  />
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">온라인예약</span>
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">글램핑 돔 B</h4>
                  <p className="text-sm text-gray-600">₩250,000 부터</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-home-heart-line text-xl text-primary" />
              <h3 className="text-lg font-medium">반려견 동반 풀빌라</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              <Link
                to="/shop_detail"
                state={{
                  title: '프리미엄 펫 풀빌라',
                  region: '경기도 포천시 영중면 영평리',
                  price: 320000,
                  id: 'pet-villa',
                  image:
                    "https://readdy.ai/api/search-image?query=Luxury%20pet-friendly%20villa%20with%20private%20pool%2C%20modern%20design%2C%20spacious%20outdoor%20area%2C%20perfect%20for%20dogs&width=560&height=300&seq=19&orientation=landscape"
                }}
                className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[0.98] active:scale-95"
              >
                <div className="relative">
                  <SafeImage 
                    src="https://readdy.ai/api/search-image?query=Luxury%20pet-friendly%20villa%20with%20private%20pool%2C%20modern%20design%2C%20spacious%20outdoor%20area%2C%20perfect%20for%20dogs&width=560&height=300&seq=19&orientation=landscape"
                    className="w-full h-36 object-cover"
                    alt="반려견 동반 풀빌라"
                    width={560}
                    height={300}
                  />
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">온라인예약</span>
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">프리미엄 펫 풀빌라</h4>
                  <p className="text-sm text-gray-600">₩320,000 부터</p>
                </div>
              </Link>
              <Link
                to="/shop_detail"
                state={{
                  title: '디럭스 펫 룸',
                  region: '경기도 용인시 처인구 백암면 백암리',
                  price: 270000,
                  id: 'pet-room',
                  image:
                    "https://readdy.ai/api/search-image?query=Pet-friendly%20luxury%20accommodation%20with%20garden%20view%2C%20dog%20amenities%2C%20modern%20interior&width=560&height=300&seq=20&orientation=landscape"
                }}
                className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[0.98] active:scale-95"
              >
                <div className="relative">
                  <SafeImage 
                    src="https://readdy.ai/api/search-image?query=Pet-friendly%20luxury%20accommodation%20with%20garden%20view%2C%20dog%20amenities%2C%20modern%20interior&width=560&height=300&seq=20&orientation=landscape"
                    className="w-full h-36 object-cover"
                    alt="반려견 동반 숙소"
                    width={560}
                    height={300}
                  />
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">온라인예약</span>
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">디럭스 펫 룸</h4>
                  <p className="text-sm text-gray-600">₩270,000 부터</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="ri-cloudy-line text-xl text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">AI 날씨 분석</h3>
                  <p className="text-sm text-gray-600">이번 주 캠핑하기 좋은 날씨예요</p>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto" ref={weatherContainerRef}>
                {weatherData.map((weather, index) => (
                  <div key={index} className="min-w-[100px] bg-white rounded-xl p-3 text-center">
                    <p className="text-sm font-medium mb-2">{weather.dayName}</p>
                    <i className={`${weather.icon} text-2xl ${weather.color} mb-2`} />
                    <p className="text-xs text-gray-600">
                      {weather.condition} {weather.temp}°
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">실시간 리뷰</h3>
              <Link
                to="/shop_detail"
                state={{
                  title: '프리미엄 펫 풀빌라',
                  region: '경기도 포천시 영중면 영평리',
                  price: 320000,
                  id: 'pet-villa',
                  image:
                    "https://readdy.ai/api/search-image?query=Luxury%20pet-friendly%20villa%20with%20private%20pool%2C%20modern%20design%2C%20spacious%20outdoor%20area%2C%20perfect%20for%20dogs&width=560&height=300&seq=19&orientation=landscape"
                }}
                className="text-sm text-primary"
              >
                전체보기
              </Link>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <i className="ri-user-smile-line text-xl text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">김서연</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="ri-star-fill text-sm" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">뷰가 너무 좋았고 조식도 맛있었어요. 다음에 또 방문하고 싶네요!</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <SafeImage 
                    src="https://readdy.ai/api/search-image?query=Hotel%20room%20view%20of%20city%20skyline%20at%20sunset&width=200&height=200&seq=21&orientation=squarish"
                    className="w-full h-24 object-cover rounded-lg"
                    alt="리뷰사진"
                    width={200}
                    height={200}
                  />
                  <SafeImage 
                    src="https://readdy.ai/api/search-image?query=Luxury%20hotel%20breakfast%20spread%20with%20fresh%20fruits&width=200&height=200&seq=22&orientation=squarish"
                    className="w-full h-24 object-cover rounded-lg"
                    alt="리뷰사진"
                    width={200}
                    height={200}
                  />
                  <SafeImage 
                    src="https://readdy.ai/api/search-image?query=Modern%20hotel%20bathroom%20with%20premium%20amenities&width=200&height=200&seq=23&orientation=squarish"
                    className="w-full h-24 object-cover rounded-lg"
                    alt="리뷰사진"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 px-4">
          <h3 className="text-lg font-medium mb-4">추천 캠핑장</h3>
          <div className="space-y-4">
            <Link
              to="/shop_detail"
              state={{
                title: '서울 글램핑 파크',
                region: '서울시 강동구 천호동',
                price: 120000,
                id: 'seoul-glamping',
                image:
                  "https://readdy.ai/api/search-image?query=Luxurious%20camping%20site%20at%20night%20with%20warm%20lighting%2C%20comfortable%20tents%2C%20and%20natural%20surroundings%2C%20professional%20photography&width=800&height=400&seq=11&orientation=landscape"
              }}
              className="block bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <SafeImage
                src="https://readdy.ai/api/search-image?query=Luxurious%20camping%20site%20at%20night%20with%20warm%20lighting%2C%20comfortable%20tents%2C%20and%20natural%20surroundings%2C%20professional%20photography&width=800&height=400&seq=11&orientation=landscape"
                className="w-full h-48 object-cover"
                alt="캠핑장"
                fallbackSrc="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=400&fit=crop&auto=format"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">서울 글램핑 파크</h4>
                  <span className="text-primary">₩120,000~</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">도심 속 프리미엄 글램핑</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <i className="ri-map-pin-line" />
                  <span>서울시 강동구 천호동</span>
                </div>
              </div>
            </Link>
            <Link
              to="/shop_detail"
              state={{
                title: '가평 숲속 캠핑장',
                region: '경기도 가평군 청평면 대성리',
                price: 80000,
                id: 'gapyeong-camping',
                image:
                  "https://readdy.ai/api/search-image?query=Scenic%20mountain%20camping%20ground%20with%20modern%20facilities%2C%20tents%20surrounded%20by%20pine%20trees%2C%20morning%20atmosphere&width=800&height=400&seq=12&orientation=landscape"
              }}
              className="block bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <SafeImage 
                src="https://readdy.ai/api/search-image?query=Scenic%20mountain%20camping%20ground%20with%20modern%20facilities%2C%20tents%20surrounded%20by%20pine%20trees%2C%20morning%20atmosphere&width=800&height=400&seq=12&orientation=landscape"
                className="w-full h-48 object-cover"
                alt="캠핑장"
                width={800}
                height={400}
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">가평 숲속 캠핑장</h4>
                  <span className="text-primary">₩80,000~</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">자연 그대로의 캠핑</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <i className="ri-map-pin-line" />
                  <span>경기도 가평군 청평면 대성리</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mb-8 px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">인기 카라반</h3>
            <Link to="/shop_list" state={{ type: 'caravan' }} className="text-sm text-primary">
              전체보기
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <Link
              to="/shop_detail"
              state={{
                title: '프리미엄 카라반 A동',
                region: '경기도 가평군 청평면 대성리',
                price: 180000,
                id: 'caravan-a',
                image:
                  "https://readdy.ai/api/search-image?query=Modern%20luxury%20caravan%20camping%2C%20stylish%20interior%20and%20exterior%20view%2C%20sunset%20lighting&width=560&height=300&seq=13&orientation=landscape"
              }}
              className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[0.98] active:scale-95"
            >
              <SafeImage 
                src="https://readdy.ai/api/search-image?query=Modern%20luxury%20caravan%20camping%2C%20stylish%20interior%20and%20exterior%20view%2C%20sunset%20lighting&width=560&height=300&seq=13&orientation=landscape"
                className="w-full h-36 object-cover"
                alt="카라반"
                width={560}
                height={300}
              />
              <div className="p-4">
                <h4 className="font-medium mb-1">프리미엄 카라반 A동</h4>
                <p className="text-sm text-gray-600">최대 4인 / 취사가능</p>
              </div>
            </Link>
            <Link
              to="/shop_detail"
              state={{
                title: '디럭스 카라반 B동',
                region: '경기도 양평군 양서면 용담리',
                price: 150000,
                id: 'caravan-b',
                image:
                  "https://readdy.ai/api/search-image?query=Cozy%20caravan%20interior%20with%20modern%20amenities%2C%20warm%20lighting%2C%20comfortable%20living%20space&width=560&height=300&seq=14&orientation=landscape"
              }}
              className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[0.98] active:scale-95"
            >
              <SafeImage 
                src="https://readdy.ai/api/search-image?query=Cozy%20caravan%20interior%20with%20modern%20amenities%2C%20warm%20lighting%2C%20comfortable%20living%20space&width=560&height=300&seq=14&orientation=landscape"
                className="w-full h-36 object-cover"
                alt="카라반"
                width={560}
                height={300}
              />
              <div className="p-4">
                <h4 className="font-medium mb-1">디럭스 카라반 B동</h4>
                <p className="text-sm text-gray-600">최대 6인 / 바베큐존</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="mb-8 px-4">
          <h3 className="text-lg font-medium mb-4">이번주 특가</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/shop_detail"
              state={{
                title: '양평 리버뷰',
                region: '경기도 양평군 양서면 용담리',
                price: 70000,
                id: 'yangpyeong-river',
                image:
                  "https://readdy.ai/api/search-image?query=Peaceful%20lakeside%20camping%20spot%20with%20tent%20and%20campfire%2C%20evening%20atmosphere&width=400&height=300&seq=15&orientation=landscape"
              }}
              className="bg-white rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[0.98] active:scale-95"
            >
              <div className="relative">
                <SafeImage 
                  src="https://readdy.ai/api/search-image?query=Peaceful%20lakeside%20camping%20spot%20with%20tent%20and%20campfire%2C%20evening%20atmosphere&width=400&height=300&seq=15&orientation=landscape"
                  className="w-full h-32 object-cover"
                  alt="캠핑장"
                  width={400}
                  height={300}
                />
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">30% OFF</span>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium mb-1">양평 리버뷰</h4>
                <p className="text-xs text-gray-500 mb-1">주중 특가</p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <i className="ri-map-pin-line" />
                  <span>경기도 양평군 양서면 용담리</span>
                </div>
              </div>
            </Link>
            <Link
              to="/shop_detail"
              state={{
                title: '포천 숲속캠핑',
                region: '경기도 포천시 영중면 영평리',
                price: 60000,
                id: 'pocheon-forest',
                image:
                  "https://readdy.ai/api/search-image?query=Forest%20camping%20ground%20with%20wooden%20deck%2C%20morning%20mist%20atmosphere&width=400&height=300&seq=16&orientation=landscape"
              }}
              className="bg-white rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[0.98] active:scale-95"
            >
              <div className="relative">
                <SafeImage 
                  src="https://readdy.ai/api/search-image?query=Forest%20camping%20ground%20with%20wooden%20deck%2C%20morning%20mist%20atmosphere&width=400&height=300&seq=16&orientation=landscape"
                  className="w-full h-32 object-cover"
                  alt="캠핑장"
                  width={400}
                  height={300}
                />
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">20% OFF</span>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium mb-1">포천 숲속캠핑</h4>
                <p className="text-xs text-gray-500 mb-1">주말 패키지</p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <i className="ri-map-pin-line" />
                  <span>경기도 포천시 영중면 영평리</span>
                </div>
              </div>
            </Link>
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
              <i className="ri-home-5-fill text-lg text-primary transition-colors duration-300" />
            </div>
            <span className="text-[10px] text-primary transition-colors duration-300">홈</span>
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
            id="bottomMenuButton"
            className="flex flex-col items-center gap-1 group"
            onClick={() => setIsSideMenuOpen(true)}
          >
            <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <i className="ri-menu-fill text-lg group-hover:text-primary transition-colors duration-300" />
            </div>
            <span className="text-[10px] transition-colors duration-300 group-hover:text-primary">전체</span>
          </button>
        </div>
      </nav>

      <div
        ref={sideMenuRef}
        className={`fixed top-0 right-0 w-[280px] h-full bg-white transform transition-transform duration-300 z-50 shadow-lg flex flex-col ${
          isSideMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">메뉴</h2>
          <button
            id="closeMenu"
            className="w-8 h-8 flex items-center justify-center"
            onClick={() => setIsSideMenuOpen(false)}
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
    </div>
  );
}
