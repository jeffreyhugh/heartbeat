import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { UserProvider } from '@supabase/supabase-auth-helpers/react';
import { AppProps } from 'next/app';

import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
