import {
  SupabaseClient,
  supabaseClient,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import * as React from 'react';
import useSWR from 'swr';

import { Row_Application, Row_Heartbeat } from '@/lib/db';
import useWithToast from '@/lib/hooks/useWithToast';

import ApplicationsHeader from '@/components/applications/ApplicationsHeader';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const fetcher = async (
  applicationID: string,
  supabaseClient: SupabaseClient
) => {
  const { data, error } = await supabaseClient
    .from('heartbeats')
    .select('*')
    .eq('application_id', applicationID)
    .limit(22);

  if (!data && error) {
    throw error;
  } else if (!data) {
    return [] as Row_Heartbeat[];
  } else {
    return data as Row_Heartbeat[];
  }
};

export default function Page({
  application,
  error, // TODO use this
}: {
  application: Row_Application;
  error?: Error;
}) {
  const { data: _heartbeats, isLoading: _heartbeatsIsLoading } = useWithToast(
    useSWR<Row_Heartbeat[]>(application.id, (applicationID) =>
      fetcher(applicationID, supabaseClient)
    ),
    {
      loading: 'Fetching Heartbeats...',
    }
  );

  if (!application && !error) return null;

  return (
    <Layout>
      <Seo templateTitle={application.friendly_name} />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-20'>
            <div className='flex w-full flex-col items-center'>
              <ApplicationsHeader />
              <span className='text-2xl font-bold'>
                {application.friendly_name}
              </span>

              <div className='mt-6 w-full border-t' />
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
    const { data, error } = await supabaseServerClient(ctx)
      .from('applications')
      .select('*')
      .eq('id', ctx.query.id);

    if (!data || data.length === 0) {
      return {
        notFound: true,
        props: {
          application: {} as Row_Application,
          error: new Error('Application not found'),
        },
      };
    } else if (error) {
      return {
        props: {
          application: {} as Row_Application,
          error: error,
        },
      };
    } else {
      const application = data[0] as Row_Application;
      application.secret = '';

      return {
        props: {
          application,
          error: null,
        },
      };
    }
  },
});
