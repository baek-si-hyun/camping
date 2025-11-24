import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WISHLIST_ITEMS } from '../../constants/wishlist.js';
import StarRating from '../../components/StarRating.jsx';
import WishlistButton from '../../components/WishlistButton.jsx';
import BottomNav from '../../components/BottomNav.jsx';
import SideMenu from '../../components/SideMenu.jsx';
import CommonStyles from '../../components/CommonStyles.jsx';

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState(WISHLIST_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSideMenu, setShowSideMenu] = useState(false);

  useEffect(() => {
    document.title = '찜한 숙소';
  }, []);

  const filteredItems = wishlistItems.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const searchText = `${item.name} ${item.region} ${item.facilities.join(' ')}`.toLowerCase();
    return searchText.includes(query);
  });

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-[762px] mx-auto bg-white">
      <CommonStyles />
      <style>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="h-8">
            <img src="https://readdy.ai/api/search-image?query=Camping%20logo%20design%20with%20tent%20and%20nature%20elements%2C%20modern%20minimalist%20style&width=128&height=32&seq=1&orientation=landscape"
              alt="DaeCamp"
              className="w-32 relative -left-9 -top-2.5"
             onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop&auto=format'; }} />
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <button className="w-8 h-8 flex items-center justify-center">
                <i className="ri-user-line text-xl text-black" />
              </button>
            </Link>
            <button
              className="w-8 h-8 flex items-center justify-center"
              onClick={() => setShowSideMenu(true)}
            >
              <i className="ri-menu-line text-xl" />
            </button>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="search"
              className="w-full h-12 pl-4 pr-12 text-sm bg-gray-50 border-none !rounded-button search-input"
              placeholder={searchQuery ? '숙소명, 지역, 태그로 검색' : '찜한 숙소에서 검색'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer">
              <i className="ri-search-line text-gray-400 hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20">
        <div className="px-4 mb-6">
          <h1 className="text-2xl font-bold mb-2">찜한 숙소</h1>
          <p className="text-gray-600">
            {searchQuery
              ? `검색 결과: ${filteredItems.length}개의 숙소`
              : `총 ${wishlistItems.length}개의 숙소를 찜하셨습니다`}
          </p>
        </div>
        <div className="px-4 space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                <div className="relative">
                  <img src={item.image} className="w-full h-48 object-cover" alt={item.name} />
                  <div className="absolute top-3 right-3">
                    <WishlistButton
                      isWishlisted={true}
                      onClick={() => removeFromWishlist(item.id)}
                    />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                    온라인예약
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <span className="text-primary font-bold">₩{item.price.toLocaleString()}~</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.region}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={item.rating} size="sm" />
                    <span className="text-sm text-gray-500">
                      {item.rating} ({item.reviews}개 리뷰)
                    </span>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {item.facilities.map((facility, idx) => {
                      const colors = [
                        'bg-blue-50 text-blue-600',
                        'bg-green-50 text-green-600',
                        'bg-purple-50 text-purple-600'
                      ];
                      return (
                        <span
                          key={idx}
                          className={`px-2 py-1 ${colors[idx % colors.length]} rounded text-xs`}
                        >
                          {facility}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/shop_detail"
                      state={{
                        title: item.name,
                        region: item.region,
                        price: item.price,
                        id: item.id,
                        image: item.image,
                        rating: item.rating,
                        facilities: item.facilities.join(',')
                      }}
                      className="flex-1 bg-primary text-white py-2 rounded-lg text-center font-medium"
                    >
                      상세보기
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 mt-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-heart-line text-3xl text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {searchQuery ? '검색 결과가 없습니다' : '찜한 숙소가 없습니다'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? `"${searchQuery}"에 해당하는 찜한 숙소가 없습니다`
                    : '마음에 드는 숙소를 찜해보세요'}
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium"
                  >
                    전체 보기
                  </button>
                ) : (
                  <Link
                    to="/shop_list"
                    className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium"
                  >
                    숙소 둘러보기
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav 
        activePath="/wishlist" 
        onMenuClick={() => setShowSideMenu(true)}
      />
      <SideMenu 
        isOpen={showSideMenu} 
        onClose={() => setShowSideMenu(false)}
      />
    </div>
  );
}
