import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function LoginSuccessPage() {
  return (
    <Layout>
      <Seo templateTitle='Login' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-20'>
            <div className='flex flex-col items-center justify-center'>
              <span className='text-2xl font-bold'>Lookin&apos; good</span>
              <span>Check your email for a login link</span>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
