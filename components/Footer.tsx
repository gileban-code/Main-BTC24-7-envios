import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useContext(LanguageContext);

  const linkKeys = {
    'footer.quickLinks.title': ['footer.quickLinks.send', 'footer.quickLinks.receive', 'footer.quickLinks.track'],
    'footer.support.title': ['footer.support.faq', 'footer.support.help', 'footer.support.contact', 'footer.support.complaint'],
  };

  return (
    <footer className="bg-black text-yellow-200">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8">
          {Object.entries(linkKeys).map(([titleKey, itemKeys]) => (
            <div key={titleKey}>
              <h3 className="font-bold text-[#f9da07] uppercase tracking-wider text-sm">{t(titleKey)}</h3>
              <ul className="mt-4 space-y-2">
                {itemKeys.map((itemKey) => (
                  <li key={itemKey}>
                    <a href="#" className="hover:text-white transition-colors">{t(itemKey)}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-yellow-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="mt-4 md:mt-0">
            {/* Social media icons would go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;