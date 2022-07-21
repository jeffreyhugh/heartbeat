import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import crypto from 'crypto';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Row_Heartbeat } from '@/lib/db';

import ApplicationsHeader from '@/components/applications/ApplicationsHeader';
import Button from '@/components/buttons/Button';
import EmojiPicker from '@/components/forms/EmojiPicker';
import Input from '@/components/forms/Input';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';

export default function NewApplicationPage() {
  const methods = useForm({
    mode: 'onTouched',
  });

  const { handleSubmit } = methods;

  const [isLoading, setIsLoading] = React.useState(false);
  const [chosenEmoji, setChosenEmoji] = React.useState('➖');
  const [appSecret, setAppSecret] = React.useState('');
  const [appID, setAppID] = React.useState('');
  const [appName, setAppName] = React.useState('');

  const { user } = useUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    //eslint-disable-next-line no-console
    console.log(data, 'hi');

    setIsLoading(true);

    const secret = crypto.randomBytes(32).toString('hex');
    // TODO can bcrypt hash this client-side?
    // existing errors had to do with not finding 'fs' and 'child-process'
    const res = await fetch('/api/bcrypt', {
      method: 'POST',
      body: secret,
    });
    if (res.status !== 200) {
      //eslint-disable-next-line no-console
      console.error('Error hashing secret');
      setIsLoading(false);
      return;
    }
    const { hash } = await res.json();

    const userID = user?.id;

    if (!userID) {
      setIsLoading(false);
      //eslint-disable-next-line no-console
      console.error('User not logged in');
      return;
    }

    const { data: newAppData, error } = await supabaseClient
      .from('applications')
      .insert({
        secret: hash,
        friendly_name: data.name,
        emoji: chosenEmoji,
        user_id: userID,
      });

    if (error) {
      setIsLoading(false);
      //eslint-disable-next-line no-console
      console.error(error);
      return;
    }

    if (!newAppData || newAppData.length === 0) {
      setIsLoading(false);
      //eslint-disable-next-line no-console
      console.error('No data returned from Supabase');
      return;
    }

    setAppSecret(secret);
    setAppID((newAppData as unknown as Row_Heartbeat[])[0].id);
    setAppName(data.name);

    setIsLoading(false);
  };

  return (
    <Layout>
      <Seo templateTitle='New Application' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-20'>
            <div className='flex flex-col items-center justify-center'>
              <ApplicationsHeader />
              <span className='text-2xl font-bold'>New Application</span>

              <div className='mt-6 w-full border-t' />

              {appID ? (
                <CreatedApp
                  appID={appID}
                  appSecret={appSecret}
                  appName={appName}
                />
              ) : (
                <div className='mt-6 w-[28rem] space-y-3'>
                  <EmojiPicker
                    onEmojiSelect={setChosenEmoji}
                    label='Emoji'
                    defaultSelected={chosenEmoji}
                  />
                  <FormProvider {...methods}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className='space-y-3'
                    >
                      <Input
                        type='text'
                        id='name'
                        label='Name'
                        validation={{
                          required: 'Name must be filled',
                        }}
                      />

                      <div className='text-sm'>
                        You can always change these later
                      </div>
                      <Button
                        type='submit'
                        variant='primary'
                        isLoading={isLoading}
                        className='flex w-full justify-center'
                      >
                        Let&apos;s go
                      </Button>
                      <ButtonLink
                        variant='outline'
                        href='/'
                        className='flex w-full justify-center'
                      >
                        Back to applications
                      </ButtonLink>
                    </form>
                  </FormProvider>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

const CreatedApp = ({
  appID,
  appSecret,
  appName,
}: {
  appID: string;
  appSecret: string;
  appName: string;
}) => {
  const [appSecretCopied, setAppSecretCopied] = React.useState(false);

  return (
    <div className='mt-6 space-y-3'>
      <div>Copy this secret -- you&apos;ll need it to send us heartbeats.</div>
      <div>
        <span className='font-bold'>This is the only time you can see it</span>,
        but you can reset it anytime.
      </div>
      <div className='select-all break-after-all rounded bg-gray-200 p-2 font-mono'>
        {appSecret}
      </div>
      <div className='flex w-full justify-center'>
        {!appSecretCopied ? (
          <Button
            variant='primary'
            type='button'
            onClick={() => {
              navigator.clipboard.writeText(appSecret);
              setAppSecretCopied(true);
            }}
          >
            Copy to clipboard
          </Button>
        ) : (
          <ArrowLink as={ButtonLink} href={`/applications/${appID}`}>
            Go to {appName}&apos;s homepage
          </ArrowLink>
        )}
      </div>
    </div>
  );
};
