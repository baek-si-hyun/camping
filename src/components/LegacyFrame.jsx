import { useCallback, useMemo, useRef } from 'react';

const iframeStyle = {
  width: '100%',
  border: '0',
  minHeight: '100vh',
  backgroundColor: '#fff',
};

export default function LegacyFrame({ file, hideBottomNav = false, onReady }) {
  const iframeRef = useRef(null);
  const src = useMemo(() => `${process.env.PUBLIC_URL}/legacy/${file}`, [file]);

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    const iframeDoc = iframe?.contentDocument;

    if (hideBottomNav && iframeDoc) {
      const navs = iframeDoc.querySelectorAll('nav');
      navs.forEach((nav) => {
        const className = nav.getAttribute('class') || '';
        if (className.includes('bottom-0')) {
          nav.style.display = 'none';
        }
      });
    }

    if (typeof onReady === 'function') {
      onReady(iframe);
    }
  }, [hideBottomNav, onReady]);

  return (
    <div className="legacy-frame-container" style={{ minHeight: '100vh', background: '#f2f2f2' }}>
      <iframe
        ref={iframeRef}
        title={file}
        src={src}
        style={iframeStyle}
        scrolling="yes"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={handleLoad}
      />
    </div>
  );
}
