import React, { useState, useEffect } from 'react';

const images = [
  'https://instasize.com/api/image/e39f67f26434f9adc6a5a47a6d7f480842dc1522abfd65e73fd7c2a0c8db786c.webp',
  'https://instasize.com/api/image/c2fa392139e592988b1fb0794dadc2aa1e27c2c2a3634ae4663fa5a23c215641.png',
  'https://instasize.com/api/image/9fca5e25154f75c48716f381e00e406cf7cc2ff7d4386a4669c71228c12a9c4c.jpeg',
  'https://instasize.com/api/image/3c98674a70fec6a262ca8925c10ec03da52026a077269de1e5691544015a4c00.png',
  'https://instasize.com/api/image/1f9616ab240e470a60ff2761f6ec77e74a7b4ba5844f486da390e7e950d650ad.webp',
];

const DynamicImageGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative w-full max-w-6xl mx-auto aspect-video rounded-2xl shadow-2xl overflow-hidden bg-slate-200">
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Dynamic gallery image ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicImageGallery;