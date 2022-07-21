import { useUser } from '@supabase/auth-helpers-react';
import * as React from 'react';

import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Logo from '@/components/Logo';

// const links = [
//   { href: '/dashboard', label: 'Dashboard' },
//   { href: '/login', label: 'Login' },
// ];

// const links = [];

export default function Header() {
  const { user } = useUser();

  return (
    <header className='absolute top-0 z-50 w-full bg-white'>
      <div className='layout flex h-14 items-center justify-between'>
        <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
          <Logo />
        </UnstyledLink>
        <nav>
          <ul className='flex items-center justify-between space-x-4'>
            {/* {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
                <UnstyledLink href={href} className='hover:text-gray-600'>
                  {label}
                </UnstyledLink>
              </li>
            ))} */}
            {user ? (
              <ArrowLink as={ButtonLink} href='/applications'>
                Applications
              </ArrowLink>
            ) : (
              <ButtonLink variant='primary' href='/login'>
                Login
              </ButtonLink>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
