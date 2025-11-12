import React, { useState, useContext } from 'react';
import { XIcon } from './icons/XIcon';
import { LanguageContext } from '../contexts/LanguageContext';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from 'firebase/auth';

interface AuthModalProps {
  initialView: 'login' | 'signup';
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ initialView, onClose, onLoginSuccess }) => {
  const [view, setView] = useState(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useContext(LanguageContext);
  
  const getFirebaseErrorMessage = (error: AuthError) => {
      switch (error.code) {
        case 'auth/email-already-in-use':
            return t('auth.errorExists');
        case 'auth/invalid-email':
            return 'The email address is not valid.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled.';
        case 'auth/weak-password':
            return 'The password is too weak.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
             return t('auth.errorInvalid');
        default:
            return error.message;
      }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError(t('auth.errorMatch'));
      setLoading(false);
      return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert(t('auth.signupSuccess'));
        onLoginSuccess();
    } catch (err) {
        setError(getFirebaseErrorMessage(err as AuthError));
    } finally {
        setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess();
    } catch (err) {
        setError(getFirebaseErrorMessage(err as AuthError));
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="p-8">
          {view === 'login' ? (
            <div>
              <h2 className="text-2xl font-bold text-black text-center">{t('auth.loginTitle')}</h2>
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-black">{t('auth.emailLabel')}</label>
                  <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="login-password"className="block text-sm font-medium text-black">{t('auth.passwordLabel')}</label>
                  <input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#f9da07] bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-500">{loading ? 'Logging in...' : t('auth.loginButton')}</button>
              </form>
              <p className="mt-6 text-center text-sm text-black">
                {t('auth.noAccount')}{' '}
                <button onClick={() => { setView('signup'); setError('') }} className="font-medium text-black underline hover:opacity-80">{t('auth.signupLink')}</button>
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-black text-center">{t('auth.signupTitle')}</h2>
              <form onSubmit={handleSignup} className="mt-6 space-y-4">
                 <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-black">{t('auth.emailLabel')}</label>
                  <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="signup-password"className="block text-sm font-medium text-black">{t('auth.passwordLabel')}</label>
                  <input id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
                </div>
                 <div>
                  <label htmlFor="confirm-password"className="block text-sm font-medium text-black">{t('auth.confirmPasswordLabel')}</label>
                  <input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#f9da07] bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-500">{loading ? 'Creating Account...' : t('auth.createAccountButton')}</button>
              </form>
              <p className="mt-6 text-center text-sm text-black">
                {t('auth.hasAccount')}{' '}
                <button onClick={() => { setView('login'); setError('') }} className="font-medium text-black underline hover:opacity-80">{t('auth.loginLink')}</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
