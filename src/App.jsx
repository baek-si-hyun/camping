import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPage from './pages/Admin/AdminPage.jsx';
import CustomerServicePage from './pages/CustomerService/CustomerServicePage.jsx';
import EquipmentPage from './pages/Equipment/EquipmentPage.jsx';
import EventPage from './pages/Event/EventPage.jsx';
import IndexPage from './pages/Index/IndexPage.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import MypagePage from './pages/Mypage/MypagePage.jsx';
import RecomendCourseTmapPage from './pages/RecomendCourseTmap/RecomendCourseTmapPage.jsx';
import RecommendPage from './pages/Recommend/RecommendPage.jsx';
import RecommendResultListPage from './pages/RecommendResultList/RecommendResultListPage.jsx';
import RecommendSeasonPage from './pages/RecommendSeason/RecommendSeasonPage.jsx';
import ReservationPage from './pages/Reservation/ReservationPage.jsx';
import SearchPage from './pages/Search/SearchPage.jsx';
import SearchMapPage from './pages/SearchMap/SearchMapPage.jsx';
import SearchResultPage from './pages/SearchResult/SearchResultPage.jsx';
import SettingsPage from './pages/Settings/SettingsPage.jsx';
import ShopDetailPage from './pages/ShopDetail/ShopDetailPage.jsx';
import ShopListPage from './pages/ShopList/ShopListPage.jsx';
import SurroundingsPage from './pages/Surroundings/SurroundingsPage.jsx';
import WeatherPage from './pages/Weather/WeatherPage.jsx';
import WishlistPage from './pages/Wishlist/WishlistPage.jsx';

export default function App() {
  return (
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
  );
}
