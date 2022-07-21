import { supabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs';
import * as React from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { Row_Application } from '@/lib/db';

import ApplicationCard, {
  BlankCard,
} from '@/components/applications/ApplicationCard';
import ApplicationsHeader from '@/components/applications/ApplicationsHeader';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Loader from '@/components/Loader';
import Seo from '@/components/Seo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Page() {
  // const [autoRefresh, setAutoRefresh] = React.useState(true);

  // const router = useRouter();
  // // refresh the page every 20 seconds
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     autoRefresh ? router.reload() : null;
  //   }, 20000);
  //   return () => clearInterval(interval);
  // }, [router, autoRefresh]);

  const { mutate } = useSWRConfig();

  // TODO error handling?
  const { data } = useSWR<Row_Application[]>('applications', fetcher, {
    refreshInterval: 10 * 1000,
  });

  React.useEffect(() => {
    mutate('applications');
  });

  return (
    <Layout>
      <Seo templateTitle='Dashboard' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-20'>
            <div className='flex w-full flex-col items-center'>
              <ApplicationsHeader />
              <span className='text-2xl font-bold'>Applications</span>
              <div className='mt-2 flex justify-center'>
                <ArrowLink
                  as={ButtonLink}
                  href='/applications/new'
                  variant='gradient'
                >
                  New application
                </ArrowLink>
              </div>

              <div className='mt-6 w-full border-t' />

              <div className='mt-6'>
                {data ? (
                  <CardCollection data={data} />
                ) : (
                  <div className='flex justify-center'>
                    <Loader />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

// export const getServerSideProps = withPageAuth({
//   redirectTo: '/login',
//   async getServerSideProps(ctx) {
//     const { data } = await supabaseServerClient(ctx)
//       .from('applications')
//       .select('*');
//     return { props: { data } };
//   },
// });

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
});

const CardCollection = ({ data }: { data: Row_Application[] }) => {
  if (data.length === 0) {
    return (
      <div className='align-center flex flex-col'>
        <div className='text-center'>Nothing here yet 🤷‍♂️</div>
      </div>
    );
  } else {
    return (
      <div className='flex flex-wrap justify-around gap-4'>
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
    );
  }
};

const fetcher = async () => {
  const { data, error } = await supabaseClient
    .from('applications')
    .select('*')
    .is('deleted_at', null);

  if (error) {
    //eslint-disable-next-line no-console
    console.error(error);
  }

  return data || [];
};
