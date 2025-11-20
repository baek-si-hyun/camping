import { Link } from 'react-router-dom';

/**
 * 하단 네비게이션 바 컴포넌트
 * @param {string} activePath - 현재 활성화된 경로
 * @param {Function} onMenuClick - 전체 메뉴 버튼 클릭 핸들러
 */
export default function BottomNav({ activePath = '/', onMenuClick }) {
  const navItems = [
    { path: '/search_map?from=nearby', icon: 'ri-map-pin-2-fill', label: '내주변' },
    { path: '/', icon: 'ri-home-5-fill', label: '홈' },
    { path: '/wishlist', icon: 'ri-heart-3-fill', label: '찜' },
    { path: '/mypage', icon: 'ri-user-3-fill', label: '마이' },
    { path: '#', icon: 'ri-wallet-3-fill', label: '페이', isButton: true },
    { path: '#', icon: 'ri-menu-fill', label: '전체', isButton: true, id: 'bottomMenuButton', onClick: onMenuClick }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return activePath === '/';
    }
    return activePath.startsWith(path.split('?')[0]);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="grid grid-cols-6 py-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Component = item.isButton ? 'button' : Link;
          const props = item.isButton 
            ? { 
                id: item.id,
                onClick: item.onClick || undefined
              }
            : { to: item.path };

          return (
            <Component
              key={item.path}
              {...props}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-6 h-6 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                <i className={`${item.icon} text-lg ${
                  active 
                    ? 'text-primary' 
                    : 'group-hover:text-primary transition-colors duration-300'
                }`} />
              </div>
              <span className={`text-[10px] transition-colors duration-300 ${
                active ? 'text-primary' : 'group-hover:text-primary'
              }`}>
                {item.label}
              </span>
            </Component>
          );
        })}
      </div>
    </nav>
  );
}
