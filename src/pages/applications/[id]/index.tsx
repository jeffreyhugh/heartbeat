import {
  SupabaseClient,
  supabaseClient,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { DateTime } from 'luxon';
import * as React from 'react';
import BillboardChart from 'react-billboardjs';
import { FormProvider, useForm } from 'react-hook-form';
import useSWR, { useSWRConfig } from 'swr';

import { Row_Application, Row_Heartbeat } from '@/lib/db';

import ApplicationsHeader from '@/components/applications/ApplicationsHeader';
import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import Layout from '@/components/layout/Layout';
import Loader from '@/components/Loader';
import Seo from '@/components/Seo';

const AXIS_OPTIONS = {
  y: {
    max: 300,
    min: 0,
    padding: {
      bottom: 0,
    },
    tick: {
      stepSize: 60,
    },
  },
  x: {
    tick: {
      show: false,
      text: {
        show: false,
      },
    },
    padding: {
      left: 0,
    },
  },
};

const GRID_OPTIONS = {
  y: {
    show: true,
  },
};

const POINT_OPTIONS = {
  focus: {
    only: true,
  },
};

export default function Page({
  application,
  error, // TODO use this
}: {
  application: Row_Application;
  error?: Error;
}) {
  const { mutate } = useSWRConfig();

  const methods = useForm({
    mode: 'onTouched',
  });

  const { handleSubmit } = methods;

  React.useEffect(() => {
    mutate(application.id);
  });

  const { data: graphHeartbeats, error: graphHeartbeatsError } = useSWR<
    Row_Heartbeat[]
  >(
    application.id,
    (applicationID) => graphFetcher(applicationID, supabaseClient),
    {
      refreshInterval: 5000,
    }
  );

  const [queryIsLoading, setQueryIsLoading] = React.useState(false);

  const [tableHeartbeats, setTableHeartbeats] = React.useState<Row_Heartbeat[]>(
    []
  );

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    //eslint-disable-next-line no-console
    console.log(data, DateTime.fromISO(data.heartbeatsBefore).toISO());

    setQueryIsLoading(true);

    if (data.heartbeatsID) {
      const { data: heartbeatsData, error: heartbeatsError } =
        await supabaseClient
          .from('heartbeats')
          .select('*')
          .eq('application_id', application.id)
          .eq('id', data.heartbeatsID);

      if (heartbeatsData) {
        setTableHeartbeats(heartbeatsData);
      }

      if (heartbeatsError) {
        //eslint-disable-next-line no-console
        console.error(heartbeatsError);
      }
    } else {
      const { data: heartbeatsData, error: heartbeatsError } =
        await supabaseClient
          .from('heartbeats')
          .select('*')
          .eq('application_id', application.id)
          .lt(
            'created_at',
            data.heartbeatsBefore
              ? DateTime.fromISO(data.heartbeatsBefore).toISO()
              : DateTime.now().toISO()
          )
          .order('created_at', { ascending: false })
          .limit(
            data.heartbeatsLimit ? parseInt(data.heartbeatsLimit, 10) : 25
          );

      if (heartbeatsData) {
        setTableHeartbeats(heartbeatsData);
      }

      if (heartbeatsError) {
        //eslint-disable-next-line no-console
        console.error(heartbeatsError);
      }
    }

    setQueryIsLoading(false);
  };

  if (!application && !error) return null;
  if (graphHeartbeats === undefined) return null;

  const CHART_DATA = make_chart_data(graphHeartbeats);

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

              <div className='mx-2 mt-6'>
                {graphHeartbeats.length === 0 ? (
                  <>
                    <div className='text-center'>
                      <span className='text-lg font-bold'>
                        No heartbeats yet 😕
                      </span>
                    </div>
                    <div className='mt-2 flex flex-col'>
                      <span className=''>
                        Send the first heartbeat with a <code>POST</code>{' '}
                        request
                      </span>
                      <span className='max-w-md select-all break-after-all rounded bg-gray-200 p-2 font-mono'>
                        curl -L -X POST{' '}
                        {`'https://heartbeat.gg/api/applications/${application.id}/ingest' -H 'Authorization: Bearer ${application.secret}'`}
                      </span>
                    </div>
                  </>
                ) : graphHeartbeatsError ? (
                  <div className='text-center'>
                    <span className='text-2xl font-bold'>
                      Error fetching heartbeats, please check the console for
                      more details.
                    </span>
                  </div>
                ) : (
                  <BillboardChart
                    data={CHART_DATA}
                    axis={AXIS_OPTIONS}
                    grid={GRID_OPTIONS}
                    point={POINT_OPTIONS}
                  />
                )}
              </div>

              <div className='mt-6 w-full'>
                {tableHeartbeats.length > 0 || graphHeartbeats.length > 0 ? (
                  <HeartbeatsQueryForm
                    methods={methods}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    queryIsLoading={queryIsLoading}
                    setTableHeartbeats={setTableHeartbeats}
                  />
                ) : null}

                <div className='mt-2 flex justify-center'>
                  {tableHeartbeats.length > 0 ? (
                    <HeartbeatsTable heartbeats={tableHeartbeats} />
                  ) : graphHeartbeats.length > 0 ? (
                    <HeartbeatsTable heartbeats={graphHeartbeats} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

const HeartbeatsTable = ({ heartbeats }: { heartbeats: Row_Heartbeat[] }) => {
  if (heartbeats.length === 0) {
    return (
      <>
        <Loader />
      </>
    );
  } else {
    return (
      <div className='w-full overflow-hidden rounded border'>
        <table className='w-full'>
          <colgroup>
            <col className='w-auto' />
            <col className='w-auto' />
            <col className='w-1/2' />
          </colgroup>
          <thead className='m-2'>
            <tr className='' style={{ backgroundColor: '#b2b2b2' }}>
              <th>Time</th>
              <th className='border-x border-black'>ID</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {heartbeats?.map((heartbeat) => (
              <tr
                key={heartbeat.id}
                className='border-collapse border-y border-gray-200 hover:bg-gray-200'
              >
                <td className='font-light'>
                  <span className='ml-1'>
                    {DateTime.fromISO(heartbeat.created_at).toFormat(
                      // July 1st 2020 at 11:00:00 PM
                      'LLLL d yyyy hh:mm:ss a'
                    )}
                  </span>
                </td>
                <td className='border-x border-dotted border-gray-600'>
                  <span className='ml-1 select-all font-mono'>
                    {heartbeat.id}
                  </span>
                </td>
                <td>
                  <span className='ml-1 select-all break-after-all font-mono'>
                    {heartbeat.body || '<empty>'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

const HeartbeatsQueryForm = ({
  methods,
  handleSubmit,
  onSubmit,
  queryIsLoading,
  setTableHeartbeats,
}: {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: any;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: any;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: any;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryIsLoading: boolean;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTableHeartbeats: any;
}) => (
  <FormProvider {...methods}>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col flex-nowrap space-y-2 md:flex-row md:space-x-2 md:space-y-0'
    >
      <Input
        id='heartbeatsBefore'
        label='Heartbeats before'
        validation={{}}
        type='datetime-local'
      />
      <Input
        id='heartbeatsLimit'
        label='Limit'
        type='number'
        defaultValue={25}
        validation={{
          min: 0,
          max: 100,
        }}
      />
      <span className='px-1 md:self-center'>-OR-</span>
      <Input
        id='heartbeatsID'
        label='Heartbeat ID'
        type='text'
        validation={{}}
      />
      <div className='flex flex-col justify-end'>
        <Button type='submit' isLoading={queryIsLoading} className='h-11'>
          Run query
        </Button>
        <div className='mt-1' />
      </div>
      <div className='flex flex-col justify-end'>
        <Button
          type='reset'
          variant='outline'
          isLoading={queryIsLoading}
          className='h-11 text-center'
          onClick={() => {
            setTableHeartbeats([]);
          }}
        >
          Reset
        </Button>
        <div className='mt-1' />
      </div>
    </form>
  </FormProvider>
);

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
      // TODO block out application secret?
      // application.secret = '';

      return {
        props: {
          application,
          error: null,
        },
      };
    }
  },
});

const make_chart_data = (heartbeats: Row_Heartbeat[]) => {
  const CHART_DATA = {
    columns: [['Time since last heartbeat (seconds)'], ['Average']],
    types: {
      'Time since last heartbeat (seconds)': 'area-spline',
      Average: 'line',
    },
    colors: {
      'Time since last heartbeat (seconds)': '#ff0000',
      Average: '#454545',
    },
  };

  if (!heartbeats) return CHART_DATA;

  let sum = 0;
  if (heartbeats.length > 0) {
    for (let index = heartbeats.length - 1; index > 0; index--) {
      const timeSinceLast = Math.abs(
        DateTime.fromISO(heartbeats[index].created_at)
          .diff(DateTime.fromISO(heartbeats[index - 1].created_at))
          .as('seconds')
      );
      CHART_DATA.columns[0].push(timeSinceLast.toFixed(0));
      sum += timeSinceLast;
    }
  } else {
    CHART_DATA.columns[0].push('0');
  }

  for (let index = 1; index < CHART_DATA.columns[0].length; index++) {
    CHART_DATA.columns[1].push((sum / CHART_DATA.columns[0].length).toFixed(0));
  }

  return CHART_DATA;
};

const graphFetcher = async (
  applicationID: string,
  supabaseClient: SupabaseClient
) => {
  const { data, error } = await supabaseClient
    .from('heartbeats')
    .select('*')
    .eq('application_id', applicationID)
    .order('created_at', { ascending: false })
    .limit(27);

  if (error) {
    throw error;
  } else {
    return data as Row_Heartbeat[];
  }
};
