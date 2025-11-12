import React, { useState, useEffect, useContext } from 'react';
import { Transaction } from '../App';
import { LanguageContext } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
// FIX: Import the `query` function from `firebase/firestore` to build the database query.
import { collection, onSnapshot, orderBy, Timestamp, doc, updateDoc, query } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';


const AdminDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useContext(LanguageContext);
  const functions = getFunctions();
  
  useEffect(() => {
    const q = collection(db, "transactions");
    const orderedQuery = orderBy("date", "desc");

    const unsubscribe = onSnapshot(query(q, orderedQuery), (querySnapshot) => {
      const transactionsData: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(transactionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleStatusChange = async (transactionId: string, newStatus: Transaction['status']) => {
    try {
        const updateTransactionStatus = httpsCallable(functions, 'updateTransactionStatusByAdmin');
        await updateTransactionStatus({ transactionId, newStatus });
        alert('Status updated successfully!');
    } catch (error) {
        console.error("Error updating status: ", error);
        alert('Failed to update status.');
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleString();
  }

  if (loading) {
      return (
          <section className="py-12 md:py-20 bg-gray-100 min-h-[80vh]">
              <div className="container mx-auto px-4 lg:px-8">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-8">{t('admin.title')}</h1>
                  <p>Loading transactions...</p>
              </div>
          </section>
      )
  }

  return (
    <section className="py-12 md:py-20 bg-gray-100 min-h-[80vh]">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-8">{t('admin.title')}</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-800 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3">{t('history.orderNumber')}</th>
                  <th scope="col" className="px-6 py-3">{t('history.date')}</th>
                  <th scope="col" className="px-6 py-3">{t('admin.user')}</th>
                  <th scope="col" className="px-6 py-3">{t('history.beneficiary')}</th>
                  <th scope="col" className="px-6 py-3">{t('history.idNumber')}</th>
                  <th scope="col" className="px-6 py-3 text-right">{t('history.totalPaid')}</th>
                  <th scope="col" className="px-6 py-3 text-center">{t('history.status')}</th>
                  <th scope="col" className="px-6 py-3 text-center">{t('admin.updateStatus')}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{tx.orderNumber}</td>
                    <td className="px-6 py-4">{formatDate(tx.date)}</td>
                    <td className="px-6 py-4">{tx.userEmail || 'N/A'}</td>
                    <td className="px-6 py-4">{tx.recipient.fullName}</td>
                    <td className="px-6 py-4">{tx.recipient.idNumber}</td>
                    <td className="px-6 py-4 text-right">${tx.details.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">{tx.status}</td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={tx.status}
                        onChange={(e) => handleStatusChange(tx.id!, e.target.value as Transaction['status'])}
                        className="p-1 border rounded-md bg-white border-gray-300 focus:ring-2 focus:ring-black"
                      >
                          <option value="En Proceso">{t('admin.status.enproceso')}</option>
                          <option value="Entregado">{t('admin.status.entregado')}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;