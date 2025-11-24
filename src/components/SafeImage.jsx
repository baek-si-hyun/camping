import { useState, useEffect, useRef, useMemo } from 'react';

// 안정적인 캠핑 이미지 fallback URL들 (다양한 이미지)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d',
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
  'https://images.unsplash.com/photo-1504851149312-7a075b496cc7',
  'https://images.unsplash.com/photo-1517824806704-9040b037703b',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  'https://images.unsplash.com/photo-1500581276021-a74bb5cdfb23',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
  'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
  'https://images.unsplash.com/photo-1511497584788-876760111969',
];

// 각 이미지 인스턴스마다 고유한 fallback 인덱스를 생성
let fallbackIndexCounter = 0;

export default function SafeImage({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = null,
  imageIndex = null, // 각 이미지마다 고유한 인덱스를 전달할 수 있음
  width = 800,
  height = 600,
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errorCount, setErrorCount] = useState(0);
  
  // imageIndex가 제공되면 사용, 없으면 src 기반 해시 또는 전역 카운터 사용
  const instanceIndexRef = useRef((() => {
    if (imageIndex !== null && imageIndex !== undefined) {
      return imageIndex % FALLBACK_IMAGES.length;
    }
    if (src) {
      // src의 해시를 기반으로 인덱스 생성
      let hash = 0;
      for (let i = 0; i < src.length; i++) {
        hash = ((hash << 5) - hash) + src.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash) % FALLBACK_IMAGES.length;
    }
    return fallbackIndexCounter++ % FALLBACK_IMAGES.length;
  })());

  useEffect(() => {
    setImgSrc(src);
    setErrorCount(0);
  }, [src]);

  const getFallbackUrl = (index, w = width, h = height) => {
    return `${FALLBACK_IMAGES[index]}?w=${w}&h=${h}&fit=crop&auto=format`;
  };

  const handleError = () => {
    if (errorCount < FALLBACK_IMAGES.length) {
      // 각 인스턴스마다 다른 fallback 이미지 사용
      // fallbackSrc가 제공되면 사용하지 않고, 인덱스 기반 fallback 사용
      const baseIndex = instanceIndexRef.current;
      const nextIndex = (baseIndex + errorCount) % FALLBACK_IMAGES.length;
      const nextFallback = getFallbackUrl(nextIndex);
      setErrorCount(prev => prev + 1);
      setImgSrc(nextFallback);
    } else {
      // 모든 fallback도 실패하면 마지막 이미지 사용
      const finalFallback = getFallbackUrl(instanceIndexRef.current);
      setImgSrc(finalFallback);
    }
  };

  const defaultFallback = useMemo(() => {
    // fallbackSrc가 명시적으로 제공되면 사용, 아니면 인덱스 기반 fallback 사용
    return fallbackSrc || getFallbackUrl(instanceIndexRef.current);
  }, [fallbackSrc, width, height]);

  return (
    <img
      src={imgSrc || defaultFallback}
      alt={alt || ''}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}

