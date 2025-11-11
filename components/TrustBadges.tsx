import React, { useContext } from 'react';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { LightningBoltIcon } from './icons/LightningBoltIcon';
import { HandshakeIcon } from './icons/HandshakeIcon';
import { LanguageContext } from '../contexts/LanguageContext';

const TrustBadges: React.FC = () => {
  const { t } = useContext(LanguageContext);

  const badges = [
    {
      icon: <LockClosedIcon className="h-8 w-8 text-[#f9da07]" />,
      text: t('trust.badge1'),
    },
    {
      icon: <LightningBoltIcon className="h-8 w-8 text-[#f9da07]" />,
      text: t('trust.badge2'),
    },
    {
      icon: <HandshakeIcon className="h-8 w-8 text-[#f9da07]" />,
      text: t('trust.badge3'),
    },
  ];

  return (
    <section className="bg-black">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8 text-white">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {badge.icon}
              </div>
              <p className="text-sm">{badge.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;