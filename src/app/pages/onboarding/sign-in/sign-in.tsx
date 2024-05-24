import { useEffect, useState } from 'react';

import { createNullArrayOfLength } from '@leather-wallet/utils';

import { MnemonicForm } from '@app/pages/onboarding/sign-in/mnemonic-form';
import { Link } from '@app/ui/components/link/link';
import { TwoColumnLayout } from '@app/ui/pages/two-column.layout';

export function SignIn() {
  const [twentyFourWordMode, setTwentyFourWordMode] = useState(true);
  const [mnemonic, setMnemonic] = useState<(string | null)[]>([]);

  useEffect(() => {
    const emptyMnemonicArray = twentyFourWordMode
      ? createNullArrayOfLength(24)
      : createNullArrayOfLength(12);
    setMnemonic(emptyMnemonicArray);
  }, [twentyFourWordMode]);

  return (
    <TwoColumnLayout
      title={
        <>
          Sign in <br /> with your <br /> Secret Key
        </>
      }
      content={<>Speed things up by pasting your entire Secret Key in one go.</>}
      action={
        <Link
          onClick={() => setTwentyFourWordMode(!twentyFourWordMode)}
          textStyle="label.03"
          width="fit-content"
          variant="text"
        >
          {twentyFourWordMode ? 'Have a 12-word Secret Key?' : 'Use 24 word Secret Key'}
        </Link>
      }
    >
      <MnemonicForm
        mnemonic={mnemonic}
        setMnemonic={setMnemonic}
        twentyFourWordMode={twentyFourWordMode}
      />
    </TwoColumnLayout>
  );
}
