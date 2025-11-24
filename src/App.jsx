import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import CommonStyles from './components/CommonStyles.jsx';
import AdminPage from './pages/admin/AdminPage.jsx';
import CustomerServicePage from './pages/customer_service/CustomerServicePage.jsx';
import EquipmentPage from './pages/equipment/EquipmentPage.jsx';
import EventPage from './pages/event/EventPage.jsx';
import IndexPage from './pages/index/IndexPage.jsx';
import LoginPage from './pages/login/LoginPage.jsx';
import MypagePage from './pages/mypage/MypagePage.jsx';
import RecomendCourseTmapPage from './pages/recomend_course_tmap/RecomendCourseTmapPage.jsx';
import RecommendPage from './pages/recommend/RecommendPage.jsx';
import RecommendResultListPage from './pages/recommend_result_list/RecommendResultListPage.jsx';
import RecommendSeasonPage from './pages/recommend_season/RecommendSeasonPage.jsx';
import ReservationPage from './pages/reservation/ReservationPage.jsx';
import SearchPage from './pages/search/SearchPage.jsx';
import SearchMapPage from './pages/search_map/SearchMapPage.jsx';
import SearchResultPage from './pages/search_result/SearchResultPage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import ShopDetailPage from './pages/shop_detail/ShopDetailPage.jsx';
import ShopListPage from './pages/shop_list/ShopListPage.jsx';
import SurroundingsPage from './pages/surroundings/SurroundingsPage.jsx';
import WeatherPage from './pages/weather/WeatherPage.jsx';
import WishlistPage from './pages/wishlist/WishlistPage.jsx';

export default function App() {
  // 전역 이미지 에러 핸들러
  useEffect(() => {
    const handleImageError = (e) => {
      if (e.target.tagName === 'IMG' && !e.target.dataset.fallbackApplied) {
        e.target.dataset.fallbackApplied = 'true';
        const fallbackImages = [
          'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&auto=format',
        ];
        const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        e.target.src = randomFallback;
      }
    };

    document.addEventListener('error', handleImageError, true);
    return () => {
      document.removeEventListener('error', handleImageError, true);
    };
  }, []);

  return (
    <>
      <CommonStyles />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/customer_service" element={<CustomerServicePage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MypagePage />} />
        <Route path="/recomend_course_tmap" element={<RecomendCourseTmapPage />} />
        <Route path="/recommend" element={<RecommendPage />} />
        <Route path="/recommend_result_list" element={<RecommendResultListPage />} />
        <Route path="/recommend_season" element={<RecommendSeasonPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search_map" element={<SearchMapPage />} />
        <Route path="/search_result" element={<SearchResultPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/shop_detail" element={<ShopDetailPage />} />
        <Route path="/shop_list" element={<ShopListPage />} />
        <Route path="/surroundings" element={<SurroundingsPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
