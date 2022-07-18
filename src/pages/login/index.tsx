import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';

export default function LoginPage() {
  // const { toasts } = useToasterStore();
  // const isLoading = toasts.some((toast) => toast.type === 'loading');

  const methods = useForm({
    mode: 'onTouched',
  });

  const { handleSubmit } = methods;

  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    // toast.promise(
    //   supabaseClient.auth.signIn({
    //     email: data.email,
    //   }),
    //   {
    //     ...toastDefaults,
    //     success: 'Check your email for a login link',
    //   }
    // );
    setIsLoading(true);

    await supabaseClient.auth.signIn({
      email: data.email,
    });

    setIsLoading(false);

    router.push('/login/success');
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
                  className='max-w-md space-y-3'
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
                    Login with email
                  </Button>
                  <div className='border-t' />
                  <ButtonLink
                    variant='outline'
                    href='/'
                    className='flex w-full justify-center'
                  >
                    Back home
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
