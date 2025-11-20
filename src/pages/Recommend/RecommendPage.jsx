import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MBTI_TYPES,
  REGIONS,
  CAMPING_STYLES,
  FACILITIES,
  PURPOSES,
  PEOPLE_OPTIONS,
  BUDGET_OPTIONS,
  RESULT_CARDS,
} from '../../constants/recommend.js';

export default function RecommendPage() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mainRef = useRef(null);
  const isMapDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [surveyData, setSurveyData] = useState({
    people: '',
    budget: 15,
    regions: [],
    style: '',
    pet: false,
    facilities: [],
    mbti: '',
    purpose: ''
  });
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showMoreLink, setShowMoreLink] = useState(false);

  const totalSteps = 5;

  useEffect(() => {
    document.title = 'AI 맞춤 추천 - ThankQ Camping';

    // 카카오 지도 API 로드
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=7c64a249ef8e3b9b648f20a50c07b249';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          initMap();
        });
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) return;

    const defaultLat = 37.5665;
    const defaultLng = 126.9780;
    const options = {
      center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
      level: 8
    };

    mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);

    window.kakao.maps.event.addListener(mapInstanceRef.current, 'dragstart', () => {
      isMapDraggingRef.current = true;
    });
    window.kakao.maps.event.addListener(mapInstanceRef.current, 'dragend', () => {
      isMapDraggingRef.current = false;
    });
    window.kakao.maps.event.addListener(mapInstanceRef.current, 'zoom_start', () => {
      isMapDraggingRef.current = true;
    });
    window.kakao.maps.event.addListener(mapInstanceRef.current, 'zoom_changed', () => {
      isMapDraggingRef.current = false;
    });
  };

  const updateProgress = () => {
    const percentage = (currentStep / totalSteps) * 100;
    return percentage;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
      // 마지막 스텝에서 "추천 받기" 버튼 클릭 시
      setShowMoreLink(false);
      setShowAIAnalysis(true);
      
      setTimeout(() => {
        setShowAIAnalysis(false);
        setShowResults(true);
        setShowMoreLink(true);
      }, 3000);
    }
  };

  const handlePeopleSelect = (value) => {
    setSurveyData(prev => ({ ...prev, people: value }));
  };

  const handlePetChange = (checked) => {
    setSurveyData(prev => ({ ...prev, pet: checked }));
  };

  const handleMBTISelect = (mbti) => {
    setSurveyData(prev => ({ ...prev, mbti }));
  };

  const handleBudgetChange = (budget) => {
    setSurveyData(prev => ({ ...prev, budget }));
  };

  const handleRegionToggle = (region) => {
    setSurveyData(prev => {
      const regions = prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region];
      return { ...prev, regions };
    });
  };

  const handleStyleSelect = (style) => {
    setSurveyData(prev => ({ ...prev, style }));
  };

  const handleFacilityToggle = (facility) => {
    setSurveyData(prev => {
      const facilities = prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility];
      return { ...prev, facilities };
    });
  };

  const handlePurposeSelect = (purpose) => {
    setSurveyData(prev => ({ ...prev, purpose }));
  };

  const handleSwipeStart = (e) => {
    if (isMapDraggingRef.current || e.target.closest('#map')) return;
    startXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
    isDraggingRef.current = true;
  };

  const handleSwipeEnd = (e) => {
    if (!isDraggingRef.current || isMapDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }

    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const dx = endX - startXRef.current;
    const threshold = 50;

    if (dx < -threshold && currentStep <= totalSteps) {
      // 왼쪽 스와이프 → 다음
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else if (dx > threshold && currentStep > 1) {
      // 오른쪽 스와이프 → 이전
      setCurrentStep(currentStep - 1);
    }

    isDraggingRef.current = false;
  };

  const handleResultCardClick = (card) => {
    const params = new URLSearchParams();
    params.append('title', card.title);
    params.append('region', card.region);
    params.append('price', card.price.toString());
    params.append('rating', card.rating);
    params.append('description', card.description);
    params.append('distance', card.distance);
    params.append('facilities', card.facilities);
    params.append('image', card.image);
    params.append('badge', card.badge);

    params.append('survey_people', surveyData.people || '2인');
    params.append('survey_style', surveyData.style || '글램핑');
    params.append('survey_budget', (surveyData.budget || 15).toString());
    params.append('survey_regions', surveyData.regions.join(',') || '경기도');
    params.append('survey_pet', surveyData.pet ? 'true' : 'false');
    params.append('survey_facilities', surveyData.facilities.join(',') || '');
    params.append('survey_mbti', surveyData.mbti || '');

    navigate(`/shop_detail?${params.toString()}`);
  };

  const goToResultList = () => {
    const params = new URLSearchParams();
    params.append('people', surveyData.people || '2인');
    params.append('style', surveyData.style || '글램핑');
    params.append('budget', (surveyData.budget || 15).toString());
    params.append('regions', surveyData.regions.join(',') || '경기도');
    params.append('pet', surveyData.pet ? 'true' : 'false');
    params.append('facilities', surveyData.facilities.join(',') || '');
    params.append('mbti', surveyData.mbti || '');

    navigate(`/recommend_result_list?${params.toString()}`);
  };

  const progressPercentage = updateProgress();

  return (
    <div className="min-h-[762px] mx-auto bg-gray-50">
      <style>{`
        :where([class^="ri-"])::before {
          content: "\\f3c2";
        }
        .progress-bar {
          transition: width 0.3s ease;
        }
        .step-transition {
          transition: transform 0.3s ease, opacity 0.3s ease;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .step-hidden {
          transform: translateX(100%);
          opacity: 0;
          z-index: 0;
        }
        .step-visible {
          transform: translateX(0);
          opacity: 1;
          z-index: 10;
        }
        .step-slide-left {
          transform: translateX(-100%);
          opacity: 0;
          z-index: 0;
        }
        .result-card {
          animation: slideUp 0.5s ease-out;
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
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
          <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">AI 맞춤 추천</h1>
          <div className="text-sm text-gray-500">{currentStep}/{totalSteps}</div>
        </div>
        <div className="px-4 pb-2">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full progress-bar"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      <main
        ref={mainRef}
        className="relative pt-[68px] pb-[65px] overflow-hidden h-screen"
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
        onMouseDown={handleSwipeStart}
        onMouseUp={handleSwipeEnd}
        onMouseLeave={() => { isDraggingRef.current = false; }}
      >
        <div className="relative w-full h-full">
          {/* Step 1: 인원 선택 */}
          <div
            className={`step-transition px-4 h-full overflow-y-auto pt-4 ${
              currentStep === 1 ? 'step-visible' : 'step-hidden'
            }`}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-group-line text-2xl text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-2">함께하는 인원을 선택해주세요</h2>
              <p className="text-gray-600 text-sm">여행 인원에 맞는 숙소를 추천해드릴게요</p>
            </div>
            <div className="space-y-3 mb-8">
              {PEOPLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`w-full p-4 bg-white rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all hover:border-primary ${
                    surveyData.people === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handlePeopleSelect(option.value)}
                >
                  <div className="flex items-center gap-3">
                    <i className={`${option.icon} text-xl text-gray-600`} />
                    <span className="font-medium">{option.value}</span>
                  </div>
                  <i
                    className={`ri-check-line text-xl ${
                      surveyData.people === option.value ? 'text-primary' : 'text-transparent'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="bg-white rounded-xl mb-8">
              <label
                className={`flex items-center gap-3 cursor-pointer transition-all p-4 w-full h-full ${
                  surveyData.pet
                    ? 'bg-primary/5 border-2 border-primary rounded-xl'
                    : 'border-2 border-transparent rounded-xl'
                }`}
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded border-gray-300"
                  checked={surveyData.pet}
                  onChange={(e) => handlePetChange(e.target.checked)}
                />
                <div className="flex items-center gap-2">
                  <i className="ri-heart-3-line text-xl text-primary" />
                  <span className="font-medium">반려동물과 함께 여행해요</span>
                </div>
              </label>
            </div>
            <div className="bg-white rounded-xl p-6 mb-8">
              <h3 className="font-medium mb-4">나의 MBTI를 선택해주세요</h3>
              <div className="grid grid-cols-2 gap-3">
                {MBTI_TYPES.map((mbti) => (
                  <button
                    key={mbti.type}
                    className={`p-3 bg-white rounded-xl text-center border-2 cursor-pointer transition-all hover:border-primary ${
                      surveyData.mbti === mbti.type
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleMBTISelect(mbti.type)}
                  >
                    <p className="font-medium">{mbti.type}</p>
                    <p className="text-xs text-gray-600">{mbti.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: 예산 선택 */}
          <div
            className={`step-transition px-4 h-full overflow-y-auto pt-4 ${
              currentStep === 2 ? 'step-visible' : 'step-hidden'
            }`}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-wallet-3-line text-2xl text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-2">1박당 예산을 선택해주세요</h2>
              <p className="text-gray-600 text-sm">예산에 맞는 최고의 숙소를 찾아드릴게요</p>
            </div>
            <div className="bg-white rounded-xl p-6 mb-8">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-primary">{surveyData.budget}만원</span>
                <p className="text-sm text-gray-600 mt-1">1박당 예산</p>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={surveyData.budget}
                onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>5만원</span>
                <span>50만원</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {BUDGET_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`p-3 bg-white rounded-xl text-center cursor-pointer border-2 transition-all hover:border-primary ${
                    surveyData.budget === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleBudgetChange(option.value)}
                >
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-gray-600">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: 지역 선택 */}
          <div
            className={`step-transition px-4 h-full overflow-y-auto pt-4 ${
              currentStep === 3 ? 'step-visible' : 'step-hidden'
            }`}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-map-pin-2-line text-2xl text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-2">선호하는 지역을 선택해주세요</h2>
              <p className="text-gray-600 text-sm">여러 지역을 선택할 수 있어요</p>
            </div>
            <div className="bg-white rounded-xl mb-4">
              <div ref={mapRef} id="map" className="w-full h-48 rounded-lg" style={{ width: '100%', height: 192 }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {REGIONS.map((region) => (
                <button
                  key={region.name}
                  className={`p-4 bg-white rounded-xl border-2 cursor-pointer transition-all hover:border-primary ${
                    surveyData.regions.includes(region.name)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleRegionToggle(region.name)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <i className={`${region.icon} text-primary`} />
                    <span className="font-medium">{region.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{region.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: 캠핑 스타일 선택 */}
          <div
            className={`step-transition px-4 h-full overflow-y-auto pt-4 ${
              currentStep === 4 ? 'step-visible' : 'step-hidden'
            }`}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-tent-line text-2xl text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-2">선호하는 캠핑 스타일을 선택해주세요</h2>
              <p className="text-gray-600 text-sm">어떤 스타일의 여행을 원하시나요?</p>
            </div>
            <div className="space-y-4">
              {CAMPING_STYLES.map((style) => (
                <button
                  key={style.style}
                  className={`w-full bg-white rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:border-primary ${
                    surveyData.style === style.style
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleStyleSelect(style.style)}
                >
                  <div className="flex items-center p-4">
                    <img src={style.image} className="w-16 h-16 rounded-lg mr-4" alt={style.style} />
                    <div className="flex-1 text-left">
                      <h3 className="font-medium mb-1">{style.style}</h3>
                      <p className="text-sm text-gray-600">{style.desc}</p>
                    </div>
                    <i
                      className={`ri-check-line text-xl ${
                        surveyData.style === style.style ? 'text-primary' : 'text-transparent'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 5: 추가 선호사항 */}
          <div
            className={`step-transition px-4 h-full overflow-y-auto pt-4 ${
              currentStep === 5 ? 'step-visible' : 'step-hidden'
            }`}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-heart-3-line text-2xl text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-2">추가 선호사항을 알려주세요</h2>
              <p className="text-gray-600 text-sm">더 정확한 추천을 위해 선택해주세요</p>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-medium mb-3">선호하는 시설</h3>
                <div className="grid grid-cols-2 gap-3">
                  {FACILITIES.map((facility) => (
                    <label
                      key={facility}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded ${
                        surveyData.facilities.includes(facility) ? 'bg-primary/5' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary rounded"
                        checked={surveyData.facilities.includes(facility)}
                        onChange={() => handleFacilityToggle(facility)}
                      />
                      <span className="text-sm">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-medium mb-3">여행 목적</h3>
                <div className="space-y-2">
                  {PURPOSES.map((purpose) => (
                    <label key={purpose} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="purpose"
                        className="w-4 h-4 text-primary"
                        checked={surveyData.purpose === purpose}
                        onChange={() => handlePurposeSelect(purpose)}
                      />
                      <span className="text-sm">{purpose}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI 분석 단계 */}
          {showAIAnalysis && (
            <div className="step-transition step-visible px-4 h-full overflow-y-auto">
              <div className="h-full flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 mb-6">
                  <div className="absolute inset-0 border-4 border-primary/30 rounded-full" />
                  <div className="absolute inset-0 border-4 border-primary rounded-full animate-[spin_2s_linear_infinite] border-t-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="ri-brain-line text-4xl text-primary animate-pulse" />
                  </div>
                </div>
                <h2 className="text-xl font-medium mb-2 animate-pulse">AI가 분석중입니다...</h2>
                <p className="text-gray-600 text-sm">잠시만 기다려주세요</p>
                <div className="mt-6 space-y-2 w-48">
                  <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-primary/40 rounded-full animate-[shimmer_1s_ease-in-out_infinite]" />
                  </div>
                  <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-primary/40 rounded-full animate-[shimmer_1s_ease-in-out_infinite]" />
                  </div>
                  <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-primary/40 rounded-full animate-[shimmer_1s_ease-in-out_infinite]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 결과 단계 */}
          {showResults && (
            <div className="step-transition step-visible px-4 h-full overflow-y-auto py-4 pb-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-brain-line text-2xl text-white" />
                </div>
                <h2 className="text-xl font-medium mb-2">AI 분석 완료!</h2>
                <p className="text-gray-600 text-sm">맞춤형 추천 결과를 확인해보세요</p>
              </div>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <i className="ri-user-star-line text-xl text-primary" />
                  <span className="font-medium">분석 결과</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/70 rounded-lg p-2">
                    <span className="text-gray-600">선호 스타일:</span>
                    <span className="font-medium ml-1">{surveyData.style || '글램핑'}</span>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2">
                    <span className="text-gray-600">예산:</span>
                    <span className="font-medium ml-1">{surveyData.budget}만원</span>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2">
                    <span className="text-gray-600">인원:</span>
                    <span className="font-medium ml-1">{surveyData.people || '2인'}</span>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2">
                    <span className="text-gray-600">지역:</span>
                    <span className="font-medium ml-1">{surveyData.regions[0] || '경기도'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {RESULT_CARDS.map((card, index) => (
                  <button
                    key={index}
                    className="result-card bg-white rounded-xl overflow-hidden shadow-sm block cursor-pointer w-full text-left"
                    onClick={() => handleResultCardClick(card)}
                  >
                    <img src={card.image} className="w-full h-48 object-cover" alt="추천 숙소" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{card.title}</h3>
                        <div className="flex items-center gap-1">
                          <i className="ri-star-fill text-yellow-400 text-sm" />
                          <span className="text-sm font-medium">{card.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <i className="ri-map-pin-line" />
                          <span>{card.region}</span>
                        </div>
                        <span className="text-primary font-medium">{card.price.toLocaleString()}원~</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-50">
        {showMoreLink && (
          <button
            className="bg-primary text-white py-4 !rounded-button font-medium cursor-pointer block text-center hover:bg-primary/90 transition-colors z-50 w-full mb-2"
            onClick={goToResultList}
          >
            더 많은 추천 보기
          </button>
        )}
        {!showResults && (
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full ${
                    step <= currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              className="px-6 py-2 bg-primary text-white !rounded-button font-medium cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleNext}
            >
              {currentStep === totalSteps ? '추천 받기' : '다음'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
