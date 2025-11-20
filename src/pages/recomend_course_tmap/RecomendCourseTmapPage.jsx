import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import WishlistButton from '../../components/WishlistButton.jsx';
import { CATEGORIES, ATTRACTIONS_DATA, getCategoryLabel } from '../../constants/recomendCourseTmap.js';

export default function RecomendCourseTmapPage() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const fullMapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const modalMapInstanceRef = useRef(null);
  const mapMarkersRef = useRef([]);
  const mapPolylinesRef = useRef([]);
  const wishlistRef = useRef(new Set());

  const [currentFilter, setCurrentFilter] = useState('전체');
  const [showFullMapModal, setShowFullMapModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [showTmapDialog, setShowTmapDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const initMap = () => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) return;

    mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.8315, 127.5109),
      level: 7
    });

    const bounds = mapInstanceRef.current.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    ATTRACTIONS_DATA.forEach(attraction => {
      attraction.lat = sw.getLat() + Math.random() * (ne.getLat() - sw.getLat());
      attraction.lng = sw.getLng() + Math.random() * (ne.getLng() - sw.getLng());
    });

    const filtered = getFilteredData();
    drawMapElements(mapInstanceRef.current, filtered);
  };

  const getFilteredData = () => {
    if (currentFilter === '전체') return ATTRACTIONS_DATA;
    return ATTRACTIONS_DATA.filter(a => a.categories.includes(currentFilter));
  };

  useEffect(() => {
    document.title = 'T맵 연동 관광 코스 - ThankQ Camping';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      const filtered = getFilteredData();
      drawMapElements(mapInstanceRef.current, filtered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilter]);

  useEffect(() => {
    if (showFullMapModal && fullMapRef.current && window.kakao && window.kakao.maps) {
      if (!modalMapInstanceRef.current) {
        modalMapInstanceRef.current = new window.kakao.maps.Map(fullMapRef.current, {
          center: new window.kakao.maps.LatLng(37.8315, 127.5109),
          level: 7
        });
      } else {
        window.kakao.maps.event.trigger(modalMapInstanceRef.current, 'resize');
      }
      const filtered = getFilteredData();
      drawMapElements(modalMapInstanceRef.current, filtered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFullMapModal, currentFilter]);

  const drawMapElements = (map, data) => {
    if (!window.kakao || !window.kakao.maps) return;

    // 기존 마커/폴리라인 제거
    mapMarkersRef.current.forEach(m => {
      try {
        if (m && m.setMap) m.setMap(null);
      } catch (e) {
        // ignore
      }
    });
    mapPolylinesRef.current.forEach(pl => {
      try {
        if (pl && pl.setMap) pl.setMap(null);
      } catch (e) {
        // ignore
      }
    });
    mapMarkersRef.current = [];
    mapPolylinesRef.current = [];

    // 마커 찍기
    data.forEach((item, i) => {
      const marker = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(item.lat, item.lng),
        content: `<div class="map-marker w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">${i + 1}</div>`,
        yAnchor: 0.5
      });
      marker.setMap(map);
      mapMarkersRef.current.push(marker);
    });

    // 경로
    if (data.length > 1) {
      const path = data.map(i => new window.kakao.maps.LatLng(i.lat, i.lng));
      const line = new window.kakao.maps.Polyline({
        map,
        path,
        strokeWeight: 3,
        strokeColor: '#FF7A45',
        strokeOpacity: 0.7,
        strokeStyle: 'dash'
      });
      mapPolylinesRef.current.push(line);
    }

    // 현재 위치 녹색 점
    const greenDot = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(37.8315, 127.5109),
      content: `<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>`,
      yAnchor: 0.5
    });
    greenDot.setMap(map);
    mapMarkersRef.current.push(greenDot);
  };

  const filteredAttractions = getFilteredData();

  const calculateSummary = () => {
    const totalMinutes = filteredAttractions.reduce((total, item) => {
      const duration = parseInt(item.duration.match(/\d+/)?.[0] || '0');
      return total + duration;
    }, 0);

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const totalDurationText = `${totalHours}시간 ${remainingMinutes}분`;

    const travelMinutes = filteredAttractions.reduce((total, item) => {
      const travelTime = parseInt(item.travelTime.match(/\d+/)?.[0] || '0');
      return total + travelTime;
    }, 0);

    const travelHours = Math.floor(travelMinutes / 60);
    const travelRemainingMinutes = travelMinutes % 60;
    const travelTimeText = travelHours > 0 ? `${travelHours}시간 ${travelRemainingMinutes}분` : `${travelRemainingMinutes}분`;

    const totalDistance = filteredAttractions.reduce((total, item) => {
      const distance = parseFloat(item.distance.replace('km', ''));
      return total + distance;
    }, 0);

    const avgRating = filteredAttractions.reduce((total, item) => total + item.rating, 0) / filteredAttractions.length;
    const satisfaction = Math.round(avgRating * 20);

    return {
      totalDuration: totalDurationText,
      travelTime: travelTimeText,
      count: filteredAttractions.length,
      distance: totalDistance.toFixed(1),
      satisfaction
    };
  };

  const summary = calculateSummary();

  const toggleWishlist = (id) => {
    const newSet = new Set(wishlistRef.current);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    wishlistRef.current = newSet;
    // 강제 리렌더링을 위해 상태 업데이트
    setShowDetailModal(prev => prev);
  };

  const handleAttractionClick = (attraction) => {
    setSelectedAttraction(attraction);
    setShowDetailModal(true);
  };

  const handleStartTmap = () => {
    setShowTmapDialog(true);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  return (
    <div className="min-h-[762px] bg-gray-50">
      <style>{`
        .map-marker {
          animation: bounce 2s infinite;
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
        .attraction-card {
          scroll-snap-align: start;
        }
        .attraction-scroll {
          scroll-snap-type: x mandatory;
        }
        .filter-active {
          background: linear-gradient(135deg, #FF7A45 0%, #FF6B35 100%);
        }
        .mbti-tag {
          background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
        }
      `}</style>

      <PageHeader
        title="T맵 연동 관광 코스"
        onBack={() => navigate(-1)}
        rightContent={
          <button
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={() => setShowFullMapModal(true)}
          >
            <i className="ri-fullscreen-line text-xl" />
          </button>
        }
      />

      <main className="pt-14 pb-20 min-h-screen">
        <div className="relative">
          <div className="w-full h-64 relative overflow-hidden">
            <div ref={mapRef} id="map" className="absolute inset-0" />
            <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1 shadow-sm z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">현재 위치</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-1 shadow-sm z-10">
              <span className="text-sm font-medium text-primary">{filteredAttractions.length}개 관광지</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-center z-10">
              <button
                className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg cursor-pointer"
                onClick={() => setShowFullMapModal(true)}
              >
                <i className="ri-route-line text-primary" />
                <span className="text-sm font-medium">전체 경로 보기</span>
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">ENFP 맞춤 추천 코스</h2>
            <div className="flex items-center gap-2">
              <div className="bg-secondary text-white px-2 py-1 rounded-full text-xs font-medium mbti-tag">ENFP</div>
              <span className="text-sm text-gray-600">총 {filteredAttractions.length}개</span>
            </div>
          </div>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer ${
                  currentFilter === category.name
                    ? 'filter-active bg-primary text-white'
                    : 'bg-white border border-gray-200'
                }`}
                onClick={() => setCurrentFilter(category.name)}
              >
                <i className={category.icon} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 attraction-scroll">
            {filteredAttractions.map((attraction, index) => (
              <div
                key={attraction.id}
                className="flex-shrink-0 w-72 bg-white rounded-xl shadow-sm overflow-hidden attraction-card cursor-pointer"
                onClick={() => handleAttractionClick(attraction)}
              >
                <div className="relative">
                  <img src={attraction.image} className="w-full h-40 object-cover object-top" alt={attraction.name} />
                  <div className="absolute top-3 left-3 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 text-white rounded-full px-2 py-1 text-xs">
                    {attraction.distance}
                  </div>
                  <WishlistButton
                    className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm"
                    isWishlisted={wishlistRef.current.has(attraction.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(attraction.id);
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-base">{attraction.name}</h3>
                    <div className="flex items-center gap-1">
                      <i className="ri-star-fill text-yellow-400 text-sm" />
                      <span className="text-sm font-medium">{attraction.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{attraction.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                      ENFP 추천
                    </div>
                    <span className="text-xs text-gray-500">{getCategoryLabel(attraction.categories[0])}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <i className="ri-time-line" />
                      <span>{attraction.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <i className="ri-car-line" />
                      <span>{attraction.travelTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">코스 요약</h3>
              <button className="text-primary text-sm font-medium cursor-pointer">
                <i className="ri-edit-line mr-1" />
                순서 편집
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  총
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">전체 소요 시간</span>
                    <span className="text-primary font-bold">{summary.totalDuration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                    <span>이동 시간</span>
                    <span>{summary.travelTime}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 font-bold">{summary.count}개</div>
                  <div className="text-gray-600">관광지</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-green-600 font-bold">{summary.distance}km</div>
                  <div className="text-gray-600">총 거리</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded-lg">
                  <div className="text-orange-600 font-bold">{summary.satisfaction}%</div>
                  <div className="text-gray-600">만족도</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 z-40">
        <div className="flex gap-3">
          <button
            className="flex-1 bg-white border-2 border-primary text-primary py-3 !rounded-button font-medium cursor-pointer flex items-center justify-center gap-2"
            onClick={handleShare}
          >
            <i className="ri-share-line" />
            <span>공유하기</span>
          </button>
          <button
            className="flex-1 bg-primary text-white py-3 !rounded-button font-medium cursor-pointer flex items-center justify-center gap-2"
            onClick={handleStartTmap}
          >
            <i className="ri-navigation-line" />
            <span>T맵 내비 시작</span>
          </button>
        </div>
      </div>

      {showFullMapModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFullMapModal(false);
            }
          }}
        >
        <div className="w-full h-full bg-white flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium">전체 관광 코스</h2>
              <button
                className="w-8 h-8 flex items-center justify-center"
                onClick={() => setShowFullMapModal(false)}
              >
              <i className="ri-close-line text-xl" />
            </button>
          </div>
          <div className="w-full h-full relative">
              <div ref={fullMapRef} id="fullMap" className="absolute inset-0" />
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-sm rounded-lg p-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">ENFP 맞춤 관광 코스</div>
                    <div className="text-sm text-gray-600">
                      총 {filteredAttractions.length}개 관광지 • {summary.totalDuration}
                    </div>
                </div>
                  <button
                    className="bg-primary text-white px-4 py-2 !rounded-button cursor-pointer"
                    onClick={handleStartTmap}
                  >
                  시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {showDetailModal && selectedAttraction && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailModal(false);
            }
          }}
        >
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-medium">관광지 상세정보</h2>
              <button
                className="w-8 h-8 flex items-center justify-center cursor-pointer"
                onClick={() => setShowDetailModal(false)}
              >
              <i className="ri-close-line text-xl" />
            </button>
          </div>
            <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-medium">{selectedAttraction.name}</h3>
              <div className="flex items-center gap-1">
                <i className="ri-star-fill text-yellow-400" />
                  <span className="font-medium">{selectedAttraction.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{selectedAttraction.detailDescription}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">소요 시간</div>
                  <div className="font-medium">{selectedAttraction.duration}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">이동 시간</div>
                  <div className="font-medium">{selectedAttraction.travelTime}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 !rounded-button cursor-pointer">
                  길찾기
                </button>
                <button
                  className="flex-1 bg-primary text-white py-3 !rounded-button cursor-pointer"
                  onClick={() => toggleWishlist(selectedAttraction.id)}
                >
                  즐겨찾기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTmapDialog && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full">
            <div className="text-center mb-4">
              <i className="ri-navigation-line text-4xl text-primary mb-2" />
              <h3 className="text-lg font-medium mb-2">T맵 내비게이션 연동</h3>
              <p className="text-sm text-gray-600">T맵 내비게이션으로 이동하시겠습니까?</p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-gray-100 text-gray-700 py-2 !rounded-button cursor-pointer"
                onClick={() => setShowTmapDialog(false)}
              >
                취소
              </button>
              <button
                className="flex-1 bg-primary text-white py-2 !rounded-button cursor-pointer"
                onClick={() => {
                  window.location.href = 'tmap://';
                  setShowTmapDialog(false);
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareDialog && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm">
            <div className="text-center mb-4">
              <i className="ri-share-line text-4xl text-primary mb-2" />
              <h3 className="text-lg font-medium mb-2">관광 코스 공유</h3>
              <p className="text-sm text-gray-600">ENFP 맞춤 관광 코스를 친구들과 공유해보세요!</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <i className="ri-kakao-talk-fill text-2xl text-yellow-500" />
                <span className="text-xs">카카오톡</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <i className="ri-links-line text-2xl text-gray-600" />
                <span className="text-xs">링크 복사</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <i className="ri-more-line text-2xl text-gray-600" />
                <span className="text-xs">더보기</span>
              </button>
            </div>
            <button
              className="w-full bg-gray-100 text-gray-700 py-2 !rounded-button cursor-pointer"
              onClick={() => setShowShareDialog(false)}
            >
              닫기
            </button>
        </div>
      </div>
      )}
    </div>
  );
}
