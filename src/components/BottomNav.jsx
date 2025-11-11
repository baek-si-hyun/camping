import { NavLink, useLocation } from 'react-router-dom';

const primaryItems = [
  { to: '/search_map?from=nearby', label: '내주변', icon: 'ri-map-pin-2-fill', match: (path) => path.startsWith('/search_map') },
  { to: '/', label: '홈', icon: 'ri-home-5-fill', match: (path) => path === '/' || path === '/index.html' },
  { to: '/wishlist', label: '찜', icon: 'ri-heart-3-fill', match: (path) => path.startsWith('/wishlist') },
  { to: '/mypage', label: '마이', icon: 'ri-user-3-fill', match: (path) => path.startsWith('/mypage') },
];

export default function BottomNav({ onOpenMenu }) {
  const location = useLocation();

  const isActive = (item, navIsActive) => navIsActive || (typeof item.match === 'function' ? item.match(location.pathname) : location.pathname === item.to);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
      <div className="mx-auto grid max-w-md grid-cols-6 items-center px-4 py-1 text-[10px] text-center">
        {primaryItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive: navIsActive }) => {
              const active = isActive(item, navIsActive);
              return `flex w-full flex-col items-center gap-1 group ${active ? 'text-primary' : 'text-gray-500'}`;
            }}
          >
            {({ isActive: navIsActive }) => {
              const active = isActive(item, navIsActive);
              return (
                <>
                  <div
                    className={`w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${
                      active ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    <i className={`${item.icon} text-lg`} />
                  </div>
                  <span className={`transition-colors duration-300 ${active ? 'text-primary' : ''}`}>{item.label}</span>
                </>
              );
            }}
          </NavLink>
        ))}

        <button type="button" className="flex w-full flex-col items-center gap-1 text-gray-500 group">
          <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
            <i className="ri-wallet-3-fill text-lg" />
          </div>
          <span className="transition-colors duration-300 group-hover:text-primary">페이</span>
        </button>

        <button
          type="button"
          className="flex w-full flex-col items-center gap-1 text-gray-500 group"
          onClick={() => {
            if (typeof onOpenMenu === 'function') {
              onOpenMenu();
            }
          }}
        >
          <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
            <i className="ri-menu-fill text-lg" />
          </div>
          <span className="transition-colors duration-300 group-hover:text-primary">전체</span>
        </button>
      </div>
    </nav>
  );
}
