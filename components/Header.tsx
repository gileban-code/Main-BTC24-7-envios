import React, { useState, useContext } from 'react';
import { User } from '../App';
import { LanguageContext } from '../contexts/LanguageContext';
import { LogoIcon } from './icons/LogoIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onNavigate: (page: 'home' | 'history' | 'adminDashboard') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onLoginClick, onSignupClick, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useContext(LanguageContext);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const handleNavClick = (page: 'home' | 'history' | 'adminDashboard') => {
    onNavigate(page);
    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };
  
  const handleAnchorClick = (anchor: string) => {
    onNavigate('home');
    setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 0);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-black text-[#f9da07] py-4 px-4 sm:px-6 lg:px-8 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <button onClick={() => handleNavClick('home')} className="flex items-center space-x-2">
          <LogoIcon className="h-10 w-auto" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button onClick={() => handleAnchorClick('hero')} className="hover:text-white transition-colors">{t('header.sendMoney')}</button>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleAnchorClick('how-it-works'); }} className="hover:text-white transition-colors">{t('header.howItWorks')}</a>
          {user && (
            <button onClick={() => handleNavClick('history')} className="hover:text-white transition-colors">{t('header.history')}</button>
          )}
          {user?.isAdmin && (
             <button onClick={() => handleNavClick('adminDashboard')} className="hover:text-white transition-colors font-bold">{t('header.adminPanel')}</button>
          )}
          
          <button onClick={toggleLanguage} className="flex items-center hover:text-white transition-colors">
            <GlobeIcon className="h-5 w-5 mr-1" />
            <span>{language.toUpperCase()}</span>
          </button>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-yellow-200">{t('header.signedInAs')} {user.email}</span>
              <button onClick={onLogout} className="bg-[#f9da07] text-black font-bold py-2 px-4 rounded-full text-sm hover:bg-yellow-300 transition-colors">{t('header.logout')}</button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button onClick={onLoginClick} className="hover:text-white transition-colors py-2 px-4">{t('header.login')}</button>
              <button onClick={onSignupClick} className="bg-[#f9da07] text-black font-bold py-2 px-4 rounded-full text-sm hover:bg-yellow-300 transition-colors">{t('header.signup')}</button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleLanguage} className="flex items-center hover:text-white transition-colors mr-4">
              <GlobeIcon className="h-6 w-6" />
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-black">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <button onClick={() => handleAnchorClick('hero')} className="hover:text-white transition-colors text-lg">{t('header.sendMoney')}</button>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleAnchorClick('how-it-works'); }} className="hover:text-white transition-colors text-lg">{t('header.howItWorks')}</a>
            {user && (
              <button onClick={() => handleNavClick('history')} className="hover:text-white transition-colors text-lg">{t('header.history')}</button>
            )}
            {user?.isAdmin && (
              <button onClick={() => handleNavClick('adminDashboard')} className="hover:text-white transition-colors text-lg font-bold">{t('header.adminPanel')}</button>
            )}

            <div className="pt-4 border-t border-yellow-900 w-full flex flex-col items-center space-y-4">
              {user ? (
                <>
                  <span className="text-base text-yellow-200">{user.email}</span>
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full max-w-xs bg-[#f9da07] text-black font-bold py-3 px-4 rounded-full text-base hover:bg-yellow-300 transition-colors">{t('header.logout')}</button>
                </>
              ) : (
                <>
                  <button onClick={() => { onLoginClick(); setIsMenuOpen(false); }} className="w-full max-w-xs text-center hover:text-white transition-colors py-3 px-4 text-lg">{t('header.login')}</button>
                  <button onClick={() => { onSignupClick(); setIsMenuOpen(false); }} className="w-full max-w-xs bg-[#f9da07] text-black font-bold py-3 px-4 rounded-full text-lg hover:bg-yellow-300 transition-colors">{t('header.signup')}</button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
