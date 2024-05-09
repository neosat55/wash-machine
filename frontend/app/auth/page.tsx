'use client';

import { Button, Input } from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    console.log(username, password);
  }

  return (
    <div className={'flex flex-col w-full h-full items-center justify-center'}>
      <h1 className={''}>Wach Machine</h1>

      <div className={'flex flex-col sm:w-2/3 lg:w-1/3 md:w-2/4 gap-2'}>
        <Input label={'Логин'} placeholder={'Введите логин'} value={username} onValueChange={setUsername} />
        <Input label={'Пароль'} placeholder={'Введите пароль'} value={password} onValueChange={setPassword} />
        <Button onPress={handleLogin}>{'Войти'}</Button>
      </div>
    </div>
  );
}