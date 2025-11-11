import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

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
        {/* The image grid has been removed as requested. */}
      </div>
    </section>
  );
};

export default CubaGallery;
