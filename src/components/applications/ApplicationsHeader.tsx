import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import * as React from 'react';

import Button from '@/components/buttons/Button';
import UnstyledLink from '@/components/links/UnstyledLink';
import Logo from '@/components/Logo';

// const links = [
//   { href: '/dashboard', label: 'Dashboard' },
//   { href: '/login', label: 'Login' },
// ];

// const links = [];

export default function DashboardHeader() {
  const router = useRouter();

  return (
    <header className='absolute top-0 z-50 w-full bg-white'>
      <div className='layout flex h-14 items-center justify-between'>
        <UnstyledLink
          href='/applications'
          className='font-bold hover:text-gray-600'
        >
          <Logo />
        </UnstyledLink>
        <nav>
          <ul className='flex items-center justify-between space-x-4'>
            <Button
              variant='ghost'
              onClick={() => {
                supabaseClient.auth.signOut();
                router.push('/');
              }}
            >
              Log Out
            </Button>
          </ul>
        </nav>
      </div>
    </header>
  );
}
