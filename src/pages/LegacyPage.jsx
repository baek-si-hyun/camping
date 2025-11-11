import { useCallback, useRef } from 'react';
import LegacyFrame from '../components/LegacyFrame.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function LegacyPage({ file, showBottomNav }) {
  const iframeRef = useRef(null);

  const handleIframeReady = useCallback((iframeEl) => {
    iframeRef.current = iframeEl;
  }, []);

  const handleOpenMenu = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const button = doc.getElementById('bottomMenuButton');
    if (button) {
      button.click();
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f4f4f5] pb-20">
      <LegacyFrame file={file} hideBottomNav={showBottomNav} onReady={handleIframeReady} />
      {showBottomNav ? <BottomNav onOpenMenu={handleOpenMenu} /> : null}
    </div>
  );
}
