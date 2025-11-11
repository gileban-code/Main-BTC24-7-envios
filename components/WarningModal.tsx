import React, { useContext } from 'react';
import { XIcon } from './icons/XIcon';
import { LanguageContext } from '../contexts/LanguageContext';

interface WarningModalProps {
  onClose: () => void;
  onAccept: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ onClose, onAccept }) => {
  const { t } = useContext(LanguageContext);

  const warnings = [
    t('warning.item1'),
    t('warning.item2'),
    t('warning.item3'),
    t('warning.item4'),
    t('warning.item5'),
    t('warning.item6'),
    t('warning.item7'),
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative animate-fade-in-up">
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-black text-center">
            {t('warning.title')}
          </h2>
          <div className="mt-4 text-sm text-black space-y-3">
            <p>{t('warning.listTitle')}</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              {warnings.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="font-semibold pt-2">{t('warning.refundPolicy')}</p>
          </div>
          <div className="mt-6">
            <button
              onClick={onAccept}
              className="w-full bg-black text-[#f9da07] font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t('warning.acceptButton')}
            </button>
            <button
              onClick={onClose}
              className="w-full mt-2 text-sm text-gray-600 hover:text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
