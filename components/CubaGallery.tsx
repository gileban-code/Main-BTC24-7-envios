import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const galleryImages = [
  {
    src: 'https://instasize.com/api/image/e39f67f26434f9adc6a5a47a6d7f480842dc1522abfd65e73fd7c2a0c8db786c.jpeg',
    alt: 'Vibrant street in Old Havana with classic cars',
  },
  {
    src: 'https://instasize.com/api/image/c2fa392139e592988b1fb0794dadc2aa1e27c2c2a3634ae4663fa5a23c215641.jpeg',
    alt: 'Stunning Varadero beach with turquoise water',
  },
  {
    src: 'https://instasize.com/api/image/9fca5e25154f75c48716f381e00e406cf7cc2ff7d4386a4669c71228c12a9c4d.jpeg',
    alt: 'Colorful colonial architecture in Trinidad, Cuba',
  },
  {
    src: 'https://instasize.com/api/image/3c98674a70fec6a262ca8925c10ec03da52026a077269de1e5691544015a4c00.jpeg',
    alt: 'Lush green landscape of the Viñales Valley',
  },
  {
    src: 'https://instasize.com/api/image/1f9616ab240e470a60ff2761f6ec77e74a7b4ba5844f486da390e7e950d650ad.jpeg',
    alt: 'Sunset over the Malecón seawall in Havana',
  },
  {
    src: 'https://instasize.com/api/image/e39f67f26434f9adc6a5a47a6d7f480842dc1522abfd65e73fd7c2a0c8db786d.jpeg',
    alt: 'A family receiving a money transfer at their home in Cuba',
  },
];

const CubaGallery: React.FC = () => {
  const { t } = useContext(LanguageContext);

  return (
    <section id="cuba-gallery" className="py-16 sm:py-24 bg-yellow-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black">
            {t('cubaGallery.title')}
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {galleryImages.map((image) => (
            <div key={image.src} className="overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300 ease-in-out"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CubaGallery;
