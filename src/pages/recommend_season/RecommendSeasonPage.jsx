import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SEASONS = [
  { id: 'spring', name: '봄', icon: 'ri-flower-line', color: 'text-pink-500', gradient: 'from-pink-50 to-rose-50' },
  { id: 'summer', name: '여름', icon: 'ri-sun-line', color: 'text-yellow-500', gradient: 'from-blue-50 to-cyan-50' },
  { id: 'autumn', name: '가을', icon: 'ri-leaf-line', color: 'text-orange-500', gradient: 'from-orange-50 to-amber-50' },
  { id: 'winter', name: '겨울', icon: 'ri-snowy-line', color: 'text-cyan-500', gradient: 'from-indigo-50 to-blue-50' }
];

const SPRING_CAMPSITES = [
  {
    title: '양평 벚꽃마을 캠핑장',
    region: '경기도 양평군 양서면 용담리',
    price: 85000,
    rating: 4.6,
    reviews: 142,
    description: '남한강변을 따라 피어나는 벚꽃과 함께하는 캠핑, 4월 초 벚꽃 축제 기간 방문 추천',
    tags: ['벚꽃 명소', '계곡 인접', '반려동물 동반'],
    image: 'https://readdy.ai/api/search-image?query=Spring%20camping%20in%20Korea%20with%20cherry%20blossoms%2C%20peaceful%20atmosphere%2C%20tent%20setup%20near%20flowering%20trees%2C%20beautiful%20nature%20scenery%2C%20professional%20photography%2C%20clear%20blue%20sky&width=800&height=400&seq=201&orientation=landscape',
    badge: '벚꽃명소',
    facilities: '캠핑,바베큐장,샤워실,편의점,주차장',
    distance: '38km'
  },
  {
    title: '춘천 호반 캠핑장',
    region: '강원도 춘천시 서면',
    price: 70000,
    rating: 4.4,
    reviews: 215,
    description: '의암호가 보이는 전망 좋은 사이트, 봄철 야생화 관찰 코스 인접',
    tags: ['호수 뷰', '숲속 캠핑', '데크 사이트'],
    image: 'https://readdy.ai/api/search-image?query=Spring%20camping%20in%20Korea%20with%20mountain%20view%2C%20tent%20setup%20near%20forest%2C%20beautiful%20nature%20scenery%2C%20professional%20photography&width=800&height=400&seq=203&orientation=landscape',
    badge: '호수뷰',
    facilities: '캠핑,호수뷰,데크,샤워실,주차장',
    distance: '52km'
  },
  {
    title: '가평 청춘 글램핑',
    region: '경기도 가평군 상면 수목원로',
    price: 120000,
    rating: 4.6,
    reviews: 98,
    description: '편안한 글램핑 시설과 봄꽃 정원, 개인 바베큐장 완비, 커플 추천',
    tags: ['글램핑', '바베큐', '온수 샤워'],
    image: 'https://readdy.ai/api/search-image?query=Spring%20camping%20in%20Korea%20with%20green%20hills%2C%20wildflowers%2C%20tent%20setup%20in%20meadow%2C%20beautiful%20nature%20scenery%2C%20professional%20photography&width=800&height=400&seq=202&orientation=landscape',
    badge: '봄 추천',
    facilities: '글램핑,바베큐,온수샤워,커플추천',
    distance: '45km'
  }
];

const SUMMER_CAMPSITES = [
  {
    title: '가평 청평 계곡 캠핑장',
    region: '경기도 가평군 청평면 대성리',
    price: 90000,
    rating: 4.6,
    reviews: 176,
    description: '깨끗한 계곡물과 울창한 숲, 어린이 물놀이장 완비, 가족 캠핑 추천',
    tags: ['계곡 접근성', '그늘 많음', '수영장'],
    image: 'https://readdy.ai/api/search-image?query=Summer%20camping%20in%20Korea%20near%20river%20or%20lake%2C%20refreshing%20water%20activities%2C%20tents%20under%20shade%2C%20clear%20blue%20sky%2C%20professional%20photography&width=800&height=400&seq=204&orientation=landscape',
    badge: '여름 추천',
    facilities: '캠핑,바베큐장,수영장,그늘많음,주차장',
    distance: '45km'
  }
];

const AUTUMN_CAMPSITES = [
  {
    title: '가평 단풍 캠핑장',
    region: '경기도 가평군 설악면',
    price: 95000,
    rating: 4.7,
    reviews: 189,
    description: '단풍이 아름다운 산속 캠핑장, 가을철 단풍 명소 인접',
    tags: ['단풍 명소', '산속 캠핑', '전망 좋음'],
    image: 'https://readdy.ai/api/search-image?query=Autumn%20camping%20in%20Korea%20with%20colorful%20fall%20foliage%2C%20red%20and%20yellow%20leaves%2C%20tent%20setup%20in%20mountain%2C%20beautiful%20nature%20scenery%2C%20professional%20photography&width=800&height=400&seq=205&orientation=landscape',
    badge: '가을 추천',
    facilities: '캠핑,바베큐장,샤워실,주차장',
    distance: '50km'
  }
];

const WINTER_CAMPSITES = [
  {
    title: '가평 설경 캠핑장',
    region: '경기도 가평군 설악면',
    price: 110000,
    rating: 4.5,
    reviews: 156,
    description: '눈 덮인 설경을 감상하며 즐기는 겨울 캠핑, 난방 시설 완비',
    tags: ['설경 명소', '난방 완비', '프라이빗'],
    image: 'https://readdy.ai/api/search-image?query=Winter%20camping%20in%20Korea%20with%20snow%20covered%20landscape%2C%20tent%20setup%20in%20snow%2C%20beautiful%20winter%20scenery%2C%20professional%20photography&width=800&height=400&seq=206&orientation=landscape',
    badge: '겨울 추천',
    facilities: '캠핑,바베큐장,난방시설,주차장',
    distance: '55km'
  }
];

const SEASON_CAMPSITES = {
  spring: SPRING_CAMPSITES,
  summer: SUMMER_CAMPSITES,
  autumn: AUTUMN_CAMPSITES,
  winter: WINTER_CAMPSITES
};

const ACCORDION_ITEMS = {
  spring: [
    {
      id: 'checklist',
      title: '봄 캠핑 준비물 체크리스트',
      icon: 'ri-list-check-2',
      color: 'bg-pink-100 text-pink-600',
      content: [
        '1. 일교차 대비 겹옷 (아침저녁 추위 대비)',
        '2. 방수 기능이 있는 텐트와 타프',
        '3. 봄비 대비 우산과 레인코트',
        '4. 꽃가루 알레르기 대비 약품',
        '5. 벌레 퇴치제 (초봄부터 벌레 출현)',
        '6. 보온성 좋은 침낭 (밤 기온 하락 대비)',
        '7. 따뜻한 음료를 위한 보온병'
      ]
    },
    {
      id: 'precautions',
      title: '봄 캠핑 주의사항',
      icon: 'ri-information-line',
      color: 'bg-blue-100 text-blue-600',
      content: [
        '1. 일교차가 크므로 옷차림에 신경쓰세요.',
        '2. 봄비가 자주 내리므로 방수 준비를 철저히 하세요.',
        '3. 황사/미세먼지 정보를 확인하고 마스크를 준비하세요.',
        '4. 꽃가루 알레르기가 있다면 약을 챙기세요.',
        '5. 해가 짧으므로 일찍 텐트를 설치하는 것이 좋습니다.'
      ]
    },
    {
      id: 'activities',
      title: '봄 캠핑 추천 활동',
      icon: 'ri-plant-line',
      color: 'bg-green-100 text-green-600',
      content: [
        '1. 봄꽃 관찰 및 사진 촬영',
        '2. 가벼운 산책과 트레킹',
        '3. 봄나물 채집 (캠핑장 규정 확인 필수)',
        '4. 별자리 관찰 (봄철 별자리)',
        '5. 봄 테마 요리 (봄나물 요리, 딸기 디저트 등)'
      ]
    }
  ],
  summer: [
    {
      id: 'checklist',
      title: '여름 캠핑 준비물 체크리스트',
      icon: 'ri-list-check-2',
      color: 'bg-blue-100 text-blue-600',
      content: [
        '1. 시원한 옷과 수영복',
        '2. 선크림과 모자',
        '3. 냉장고와 아이스박스',
        '4. 선풍기나 휴대용 선풍기',
        '5. 모기 퇴치제',
        '6. 그늘막과 타프',
        '7. 충분한 물과 음료'
      ]
    }
  ],
  autumn: [
    {
      id: 'checklist',
      title: '가을 캠핑 준비물 체크리스트',
      icon: 'ri-list-check-2',
      color: 'bg-orange-100 text-orange-600',
      content: [
        '1. 일교차 대비 옷차림',
        '2. 보온성 좋은 침낭',
        '3. 난로나 히터',
        '4. 따뜻한 음료',
        '5. 방수 장비',
        '6. 단풍 관찰용 카메라',
        '7. 충분한 연료'
      ]
    }
  ],
  winter: [
    {
      id: 'checklist',
      title: '겨울 캠핑 준비물 체크리스트',
      icon: 'ri-list-check-2',
      color: 'bg-indigo-100 text-indigo-600',
      content: [
        '1. 방한복과 방한 장갑',
        '2. 보온성 좋은 침낭',
        '3. 난로와 연료',
        '4. 4계절용 텐트와 추가 보온재',
        '5. 고효율 버너와 충분한 연료',
        '6. 전기 히터 (전기 사용 가능 캠핑장)',
        '7. 따뜻한 음료와 음식'
      ]
    },
    {
      id: 'precautions',
      title: '겨울 캠핑 주의사항',
      icon: 'ri-information-line',
      color: 'bg-indigo-100 text-indigo-600',
      content: [
        '1. 일산화탄소 중독 위험에 주의하세요. (텐트 내 환기 필수)',
        '2. 동파 방지를 위해 수도관과 물통을 관리하세요.',
        '3. 눈이 내릴 경우 텐트 위 눈을 주기적으로 제거하세요.',
        '4. 화재 위험이 높으므로 난방 기구 사용에 주의하세요.',
        '5. 체온 유지에 신경쓰고 저체온증 증상을 알아두세요.'
      ]
    },
    {
      id: 'activities',
      title: '겨울 캠핑 추천 활동',
      icon: 'ri-snowy-line',
      color: 'bg-cyan-100 text-cyan-600',
      content: [
        '1. 눈사람 만들기, 눈싸움',
        '2. 인근 스키장 이용',
        '3. 따뜻한 겨울 음료 만들기 (핫초코, 글루바인 등)',
        '4. 겨울 별자리 관찰 (맑은 겨울 밤하늘)',
        '5. 캠핑장 주변 설경 사진 촬영'
      ]
    }
  ]
};

export default function RecommendSeasonPage() {
  const navigate = useNavigate();
  const [currentSeason, setCurrentSeason] = useState('spring');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [openAccordions, setOpenAccordions] = useState(new Set());
  const sideMenuRef = useRef(null);

  useEffect(() => {
    document.title = '계절별 추천 캠핑';
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
        const menuButton = document.getElementById('bottomMenuButton');
        if (menuButton && !menuButton.contains(event.target)) {
          setIsSideMenuOpen(false);
        }
      }
    };

    if (isSideMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSideMenuOpen]);

  const toggleWishlist = (id) => {
    const newSet = new Set(wishlist);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setWishlist(newSet);
  };

  const toggleAccordion = (id) => {
    const newSet = new Set(openAccordions);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setOpenAccordions(newSet);
  };

  const handleReservation = (campsite) => {
    const params = new URLSearchParams();
    params.append('title', campsite.title);
    params.append('region', campsite.region);
    params.append('price', campsite.price.toString());
    params.append('rating', campsite.rating.toString());
    params.append('description', campsite.description);
    params.append('distance', campsite.distance);
    params.append('facilities', campsite.facilities);
    params.append('image', campsite.image);
    params.append('badge', campsite.badge || '');
    navigate(`/shop_detail?${params.toString()}`);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="ri-star-fill text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill text-sm" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line text-sm" />);
    }
    return stars;
  };

  const currentSeasonData = SEASONS.find(s => s.id === currentSeason);
  const currentCampsites = SEASON_CAMPSITES[currentSeason] || [];
  const currentAccordions = ACCORDION_ITEMS[currentSeason] || [];

  return (
    <div className="min-h-[762px] mx-auto bg-white">
      <style>{`
        :where([class^="ri-"])::before {
          content: "\\f3c2";
        }
        .season-tab-active {
          color: #FF7A45;
          border-bottom: 2px solid #FF7A45;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out, opacity 0.3s ease-out, padding-bottom 0.3s ease-out;
          opacity: 0;
          padding-bottom: 0;
        }
        .accordion-content.active {
          opacity: 1;
          padding-bottom: 1.5rem;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .pulse-on-hover:hover {
          animation: pulse 1s infinite;
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
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
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <i className="ri-arrow-left-s-line text-xl" />
            </button>
            <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">계절별 추천 캠핑</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/search" className="w-8 h-8 flex items-center justify-center cursor-pointer">
              <i className="ri-search-line text-xl" />
            </Link>
          </div>
        </div>
        <div className="flex border-b">
          {SEASONS.map((season) => (
            <button
              key={season.id}
              className={`season-tab flex-1 py-3 text-center text-sm font-medium ${
                currentSeason === season.id
                  ? 'season-tab-active'
                  : 'text-gray-500'
              }`}
              onClick={() => setCurrentSeason(season.id)}
            >
              {season.name}
            </button>
          ))}
        </div>
      </header>

      <main className="pt-28 pb-20 transition-all duration-300 ease-in-out">
        <div className={`season-content animate-fade-in`}>
          <div className={`px-4 py-3 bg-gradient-to-r ${currentSeasonData?.gradient} mb-4`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm">
                <i className={`${currentSeasonData?.icon} ${currentSeasonData?.color}`} />
              </div>
              <h2 className="text-lg font-medium">{currentSeasonData?.name} 캠핑의 매력</h2>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {currentSeason === 'spring' && '봄바람과 함께 피어나는 꽃들, 새싹이 돋는 자연 속에서 즐기는 캠핑은 특별한 경험을 선사합니다. 쌀쌀한 밤공기와 따뜻한 낮 온도의 조화가 봄 캠핑의 매력입니다.'}
              {currentSeason === 'summer' && '시원한 계곡과 강가에서 즐기는 물놀이, 밤하늘의 쏟아지는 별빛까지. 여름 캠핑은 자연과 하나되는 특별한 경험을 선사합니다.'}
              {currentSeason === 'autumn' && '단풍이 물든 산과 계곡에서 즐기는 가을 캠핑은 색다른 경험을 선사합니다. 선선한 날씨와 아름다운 풍경이 가을 캠핑의 매력입니다.'}
              {currentSeason === 'winter' && '눈 덮인 설경과 함께하는 겨울 캠핑은 특별한 경험을 선사합니다. 따뜻한 난로와 함께하는 겨울 밤이 겨울 캠핑의 매력입니다.'}
            </p>
            <div className="flex gap-2">
              {currentSeason === 'spring' && (
                <>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">벚꽃 명소</span>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">온화한 날씨</span>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">새싹 관찰</span>
                </>
              )}
              {currentSeason === 'summer' && (
                <>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">계곡 물놀이</span>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">밤하늘 별 관찰</span>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">바베큐</span>
                </>
              )}
              {currentSeason === 'autumn' && (
                <>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">단풍 명소</span>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">선선한 날씨</span>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">가을 음식</span>
                </>
              )}
              {currentSeason === 'winter' && (
                <>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">설경 명소</span>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">난방 완비</span>
                  <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 shadow-sm">겨울 별자리</span>
                </>
              )}
            </div>
          </div>

          <div className="px-4 mb-8">
            <h3 className="text-xl font-bold mb-5 tracking-tight">{currentSeasonData?.name} 추천 캠핑장</h3>
            <div className="space-y-6">
              {currentCampsites.map((campsite, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm relative">
                  <img src={campsite.image} className="w-full h-48 object-cover" alt={campsite.title} />
                  <button
                    className={`absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md wishlist-btn ${
                      wishlist.has(`${currentSeason}-${index}`) ? 'active' : ''
                    }`}
                    onClick={() => toggleWishlist(`${currentSeason}-${index}`)}
                  >
                    <i
                      className={`${
                        wishlist.has(`${currentSeason}-${index}`) ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-xl'
                      }`}
                    />
                  </button>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{campsite.title}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex text-yellow-400">
                            {renderStars(campsite.rating)}
                          </div>
                          <span className="text-xs text-gray-500">({campsite.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {campsite.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`text-xs px-2 py-1 rounded-full ${
                            tagIndex === 0
                              ? 'bg-pink-50 text-pink-600'
                              : tagIndex === 1
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-green-50 text-green-600'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{campsite.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <i className="ri-map-pin-line" />
                      <span>{campsite.region}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-medium">₩{campsite.price.toLocaleString()}~</span>
                      <button
                        className="px-4 py-2 bg-primary text-white !rounded-button text-sm cursor-pointer pulse-on-hover inline-block no-underline hover:bg-primary/90 transition-colors"
                        onClick={() => handleReservation(campsite)}
                      >
                        예약하기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-4 bg-gray-50">
            <h3 className="text-lg font-medium mb-4">{currentSeasonData?.name} 캠핑 준비 팁</h3>
            {currentAccordions.map((item) => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
                <button
                  className="w-full flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleAccordion(`${currentSeason}-${item.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center`}>
                      <i className={`${item.icon} ${item.color.split(' ')[1]}`} />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <i
                    className={`${
                      openAccordions.has(`${currentSeason}-${item.id}`)
                        ? 'ri-arrow-up-s-line'
                        : 'ri-arrow-down-s-line'
                    } text-gray-400`}
                  />
                </button>
                <div
                  className={`accordion-content ${
                    openAccordions.has(`${currentSeason}-${item.id}`) ? 'active' : ''
                  }`}
                  style={{
                    maxHeight: openAccordions.has(`${currentSeason}-${item.id}`) ? '1000px' : '0'
                  }}
                >
                  <div className="px-4 pl-11 text-sm text-gray-600 space-y-2 mb-4">
                    {item.content.map((line, lineIndex) => (
                      <p key={lineIndex}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}
