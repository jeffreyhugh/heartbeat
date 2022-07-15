import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { UserProvider } from '@supabase/auth-helpers-react';
import { AppProps } from 'next/app';

import '@/styles/globals.css';

import DismissableToast from '@/components/DismissableToast';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <DismissableToast />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
