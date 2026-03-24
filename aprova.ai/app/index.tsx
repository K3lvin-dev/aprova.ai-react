import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { doesSessionExist } from '@/lib/supertokens';

export default function Index() {
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    doesSessionExist().then((exists) => {
      setAuthenticated(exists);
      setChecked(true);
    });
  }, []);

  if (!checked) return null;

  return <Redirect href={authenticated ? '/(tabs)' : '/(auth)/login'} />;
}
