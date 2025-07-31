import React, { useMemo, useState, useEffect } from 'react';

interface AdsProps {
  pageName?: string; // Optional: empty or undefined means homepage
}

const Ads: React.FC<AdsProps> = ({ pageName }) => {
  // Import and filter image paths
  const adImages = useMemo(() => {
    const allAds = import.meta.glob('/src/assets/ads/*/*.{jpg,png,jpeg,gif,webp,avif}', {
      eager: true,
      as: 'url',
    });

    return Object.entries(allAds)
      .filter(([path]) => {
        if (!pageName) return true;
        return path.includes(`/ads/${pageName}/`);
      })
      .map(([, url]) => url as string);
  }, [pageName]);

  function getTwoRandomImages() {
    if (adImages.length === 0) return [undefined, undefined];
    if (adImages.length === 1) return [adImages[0], adImages[0]];
    const firstIdx = Math.floor(Math.random() * adImages.length);
    let secondIdx = Math.floor(Math.random() * (adImages.length - 1));
    if (secondIdx >= firstIdx) secondIdx++;
    return [adImages[firstIdx], adImages[secondIdx]];
  }

  const [img1, img2] = useMemo(getTwoRandomImages, [adImages]);
  // Force 16:9 aspect ratio for all images
  const ratios = [16/9, 16/9];

  if (!img1 || !img2) return null;

  return (
    <div className="w-full px-4 md:px-8 my-6">
      <div className="flex flex-col md:flex-row gap-4">
        {[img1, img2].map((img, idx) => (
          <div
            key={idx}
            className="flex-1 rounded-2xl overflow-hidden shadow-md"
            style={{
              aspectRatio: ratios[idx],
              backgroundColor: '#f3f4f6',
            }}
          >
            <img
              src={img}
              alt="Ad"
              className="w-full h-full object-cover"
              draggable="false"
              style={{ aspectRatio: ratios[idx] }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ads;