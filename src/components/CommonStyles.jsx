/**
 * 공통 스타일 컴포넌트
 * RemixIcon, 스크롤바 숨김 등 공통 스타일을 제공합니다.
 */
export default function CommonStyles() {
  return (
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
      button i[class*="ri-heart"] {
        transition: all 0.2s ease;
      }
      button:has(i[class*="ri-heart"]) {
        transition: transform 0.15s ease;
      }
      button:has(i[class*="ri-heart"]):hover {
        transform: scale(1.05);
      }
    `}</style>
  );
}

