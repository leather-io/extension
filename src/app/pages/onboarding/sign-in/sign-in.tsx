import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { createNullArrayOfLength } from '@app/common/utils';
import { Header } from '@app/components/header';
import { TwoColumnLayout } from '@app/components/secret-key/two-column.layout';
import { MnemonicForm } from '@app/pages/onboarding/sign-in/mnemonic-form';

import { SignInContent } from './components/sign-in.content';

export function SignIn() {
  const navigate = useNavigate();

  const [twentyFourWordMode, setTwentyFourWordMode] = useState(true);
  const [mnemonic, setMnemonic] = useState<(string | null)[]>([]);

  useRouteHeader(<Header onClose={() => navigate(RouteUrls.Onboarding)} hideActions />);

  useEffect(() => {
    const emptyMnemonicArray = twentyFourWordMode
      ? createNullArrayOfLength(24)
      : createNullArrayOfLength(12);
    setMnemonic(emptyMnemonicArray);
  }, [twentyFourWordMode]);

  return (
    <>
      <TwoColumnLayout
        leftColumn={
          <SignInContent
            onClick={() => setTwentyFourWordMode(!twentyFourWordMode)}
            twentyFourWordMode={twentyFourWordMode}
          />
        }
        rightColumn={
          <MnemonicForm
            mnemonic={mnemonic}
            setMnemonic={setMnemonic}
            twentyFourWordMode={twentyFourWordMode}
          />
        }
      />
    </>
  );
}
