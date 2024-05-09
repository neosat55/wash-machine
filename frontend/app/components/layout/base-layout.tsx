'use client';

import { PropsWithChildren } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export const BaseLayout = ({children}: PropsWithChildren) => {
  const router = useRouter();

  return (
    <NextUIProvider className={'h-full w-full'} navigate={router.push}>
      {children}
    </NextUIProvider>
  )
}