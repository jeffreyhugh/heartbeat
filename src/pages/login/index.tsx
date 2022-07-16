import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast, { useToasterStore } from 'react-hot-toast';

import { toastDefaults } from '@/lib/toastDefaults';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';

export default function LoginPage() {
  const { toasts } = useToasterStore();
  const isLoading = toasts.some((toast) => toast.type === 'loading');

  const methods = useForm({
    mode: 'onTouched',
  });

  const { handleSubmit } = methods;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    toast.promise(
      supabaseClient.auth.signIn({
        email: data.email,
      }),
      {
        ...toastDefaults,
        success: 'Check your email for a login link',
      }
    );
  };

  return (
    <Layout>
      <Seo templateTitle='Login' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-20'>
            <div className='flex items-center justify-center'>
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='max-w-sm space-y-3'
                >
                  <Input
                    type='email'
                    id='email'
                    label='Email'
                    validation={{
                      required: 'Email must be filled',
                    }}
                  />
                  <Button
                    type='submit'
                    variant='primary'
                    className='flex w-full justify-center'
                    isLoading={isLoading}
                  >
                    Login with Email
                  </Button>
                  <div className='border-t' />
                  <ButtonLink
                    variant='outline'
                    href='/'
                    className='flex w-full justify-center'
                  >
                    Back Home
                  </ButtonLink>
                </form>
              </FormProvider>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
