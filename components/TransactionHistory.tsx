import React, { useState, useEffect, useContext } from 'react';
import { User, Transaction } from '../App';
import { LanguageContext } from '../contexts/LanguageContext';

interface TransactionHistoryProps {
  user: User;
  onSendMoney: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ user, onSendMoney }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const userTransactionsKey = `transactions_${user.email}`;
    const storedTransactions = localStorage.getItem(userTransactionsKey);
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, [user.email]);

  return (
    <section className="py-12 md:py-20 bg-[#f9da07] min-h-[60vh]">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-8">
          {t('history.title')}
        </h1>
        {transactions.length > 0 ? (
          <div className="bg-yellow-200 rounded-lg shadow-md overflow-hidden border border-black">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-black">
                <thead className="text-xs text-black uppercase bg-yellow-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">{t('history.orderNumber')}</th>
                    <th scope="col" className="px-6 py-3">{t('history.date')}</th>
                    <th scope="col" className="px-6 py-3">{t('history.beneficiary')}</th>
                    <th scope="col" className="px-6 py-3">{t('history.idNumber')}</th>
                    <th scope="col" className="px-6 py-3">{t('history.destination')}</th>
                    <th scope="col" className="px-6 py-3 text-right">{t('history.totalPaid')}</th>
                    <th scope="col" className="px-6 py-3 text-right">{t('history.receiverGets')}</th>
                    <th scope="col" className="px-6 py-3 text-center">{t('history.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.orderNumber} className="bg-yellow-200 border-b border-black/20 hover:bg-yellow-300">
                      <td className="px-6 py-4 font-medium text-black whitespace-nowrap">{tx.orderNumber}</td>
                      <td className="px-6 py-4">{tx.date}</td>
                      <td className="px-6 py-4">{tx.recipient.fullName}</td>
                      <td className="px-6 py-4">{tx.recipient.idNumber}</td>
                      <td className="px-6 py-4">{tx.details.destination}</td>
                      <td className="px-6 py-4 text-right">${tx.details.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        ${tx.details.receiveAmount.toFixed(2)} USD
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          tx.status === 'Completed' ? 'bg-black text-[#f9da07]' : 'bg-gray-500 text-white'
                        }`}>
                          {t(`history.${tx.status.toLowerCase()}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center bg-yellow-200 p-12 rounded-lg shadow-md border border-black">
            <h3 className="text-xl font-semibold text-black">{t('history.noTransactions')}</h3>
            <p className="mt-2 text-black/80">
              {t('history.noTransactionsDesc')}
            </p>
            <button
              onClick={onSendMoney}
              className="mt-6 bg-black text-[#f9da07] font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t('history.sendMoneyButton')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionHistory;
