import React, { useMemo, useState, useEffect } from 'react';

// Dynamically import all images from the ads folder
const adImages = Object.values(
  import.meta.glob('/src/assets/ads/*.{jpg,png,jpeg,gif,webp,avif}', { eager: true, as: 'url' })
);

function getTwoRandomImages() {
  if (adImages.length < 2) return [adImages[0], adImages[0]];
  const firstIdx = Math.floor(Math.random() * adImages.length);
  let secondIdx = Math.floor(Math.random() * (adImages.length - 1));
  if (secondIdx >= firstIdx) secondIdx++;
  return [adImages[firstIdx], adImages[secondIdx]];
}

const Ads: React.FC = () => {
  // Pick two different random images on each render
  const [img1, img2] = useMemo(getTwoRandomImages, []);
  const [ratios, setRatios] = useState([1.78, 1.78]); // Default 16:9 aspect ratio

  useEffect(() => {
    const imgs = [img1, img2];
    Promise.all(
      imgs.map(
        src =>
          new Promise<number>(resolve => {
            const i = new window.Image();
            i.onload = () => resolve(i.naturalWidth / i.naturalHeight);
            i.onerror = () => resolve(1.78);
            i.src = src;
          })
      )
    ).then(setRatios);
  }, [img1, img2]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-3 my-4 overflow-x-hidden">
      {[img1, img2].map((img, idx) => (
        <div
          key={idx}
          className="relative w-full md:w-1/2 max-w-full rounded-3xl overflow-hidden shadow-xl flex items-center justify-center"
          style={{
            backgroundColor: '#f3f4f6',
            aspectRatio: ratios[idx],
            height: 'auto',
          }}
        >
          <img
            src={img}
            alt="Ad image"
            className="w-full h-full object-cover"
            draggable="false"
            style={{ aspectRatio: ratios[idx] }}
          />
        </div>
      ))}
    </div>
  );
};

export default Ads; 