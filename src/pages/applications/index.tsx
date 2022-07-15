import {
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import * as React from 'react';

import ApplicationCard, {
  BlankCard,
} from '@/components/applications/ApplicationCard';
import ApplicationsHeader from '@/components/applications/ApplicationsHeader';
import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Page({ data }: { data: any[] }) {
  const [autoRefresh, setAutoRefresh] = React.useState(true);

  const router = useRouter();
  // refresh the page every 20 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      autoRefresh ? router.reload() : null;
    }, 20000);
    return () => clearInterval(interval);
  }, [router, autoRefresh]);

  return (
    <Layout>
      <Seo templateTitle='Dashboard' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-20'>
            <div className='flex w-full flex-col items-center'>
              <ApplicationsHeader />
              <span className='text-2xl font-bold'>Applications</span>
              <div className='flex justify-center space-y-4'>
                <Button
                  variant='ghost'
                  className='py-0 px-2'
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {autoRefresh ? '⌛ Auto Refresh On' : '🛑 Auto Refresh Off'}
                </Button>
              </div>

              <div className='mt-6 w-full border-t' />

              <div className='mt-6 flex flex-wrap justify-around gap-4'>
                {data.map((item) => (
                  <UnstyledLink href={`/applications/${item.id}`} key={item.id}>
                    <ApplicationCard item={item} />
                  </UnstyledLink>
                ))}
                <BlankCard />
                <BlankCard />
                <BlankCard />
                <BlankCard />
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { data } = await supabaseServerClient(ctx)
      .from('applications')
      .select('*');
    return { props: { data } };
  },
});
