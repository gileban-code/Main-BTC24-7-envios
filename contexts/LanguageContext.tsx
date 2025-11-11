import React from 'react';

// FIX: Update the type of the `t` function to accept an optional options object for substitutions
// and ensure its return type is `string`. This resolves a type mismatch error when providing the context
// value in `App.tsx` and an incorrect argument error in `Footer.tsx`.
export const LanguageContext = React.createContext({
    language: 'es' as 'es' | 'en',
    setLanguage: (lang: 'es' | 'en') => {},
    t: (key: string, options?: { [key: string]: string | number }): string => key,
});
