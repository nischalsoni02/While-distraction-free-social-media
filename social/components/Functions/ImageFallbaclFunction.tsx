import React, { useState, useEffect } from 'react';

const useImageWithFallback = (imageUrl: string): string => {
  const fallbackUrl = 'assets/Images/image.jpg'; // Adjust this path to your actual fallback image location

  const [imgSrc, setImgSrc] = useState(fallbackUrl);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      // Image exists
      setImgSrc(imageUrl);
    };

    img.onerror = () => {
      // Image doesn't exist or failed to load
      setImgSrc(fallbackUrl);
    };
  }, [imageUrl]);

  return imgSrc;
};

export default useImageWithFallback;
