import React, { useEffect, useState } from 'react';
import { Box, Button, Text } from '@stacks/ui';
import { stacksTestnetNetwork as network } from '@common/utils';
import { SignatureData } from '@stacks/connect';

import {
  serializeCV,
  bufferCVFromString,
  contractPrincipalCV,
  falseCV,
  intCV,
  listCV,
  noneCV,
  responseErrorCV,
  responseOkCV,
  someCV,
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  trueCV,
  TupleCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import { useConnect } from '@stacks/connect-react';
import { hashMessage, verifyECDSA } from '@stacks/encryption';

export const Signature = () => {
  const [signature, setSignature] = useState<SignatureData | undefined>();
  const [signatureIsVerified, setSignatureIsVerified] = useState<boolean | undefined>();
  const [currentMessage, setCurrentMessage] = useState<string | undefined>();
  const signatureMessage = 'Hello world!';
  const longSignatureMessage =
    'Nullam eu ante vel est convallis dignissim.  Fusce suscipit, wisi nec facilisis facilisis, est dui fermentum leo, quis tempor ligula erat quis odio.  Nunc porta vulputate tellus.  Nunc rutrum turpis sed pede.  Sed bibendum.  Aliquam posuere.  Nunc aliquet, augue nec adipiscing interdum, lacus tellus malesuada massa, quis varius mi purus non odio.  Pellentesque condimentum, magna ut suscipit hendrerit, ipsum augue ornare nulla, non luctus diam neque sit amet urna.  Curabitur vulputate vestibulum lorem.  Fusce sagittis, libero non molestie mollis, magna orci ultrices dolor, at vulputate neque nulla lacinia eros.  Sed id ligula quis est convallis tempor.  Curabitur lacinia pulvinar nibh.  Nam a sapien.';
  const ADDRESS = 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B';

  const structuredData = tupleCV({
    a: intCV(-1),
    b: uintCV(1),
    c: bufferCVFromString('test'),
    d: trueCV(),
    e: someCV(trueCV()),
    f: noneCV(),
    g: standardPrincipalCV(ADDRESS),
    h: contractPrincipalCV(ADDRESS, 'test'),
    i: responseOkCV(trueCV()),
    j: responseErrorCV(falseCV()),
    k: listCV([trueCV(), falseCV()]),
    l: tupleCV({
      a: trueCV(),
      b: falseCV(),
    }),
    m: stringAsciiCV('hello world'),
    another: tupleCV({
      a: trueCV(),
      b: falseCV(),
      deep: tupleCV({
        a: trueCV(),
        b: falseCV(),
      }),
    }),
    n: stringUtf8CV('hello \u{1234}'),
    o: listCV([]),
  });
  const { sign, signStructuredData } = useConnect();

  useEffect(() => {
    if (!signature || !currentMessage) return;
    const verified = verifyECDSA(
      hashMessage(currentMessage),
      signature.publicKey,
      signature.signature
    );
    setSignatureIsVerified(verified);
  }, [signature, currentMessage]);

  const clearState = () => {
    setSignatureIsVerified(undefined);
    setSignature(undefined);
  };

  const signMessage = async (message: string) => {
    clearState();
    setCurrentMessage(message);
    await sign({
      /* network: stacksMainnetNetwork, */
      network,
      message,
      onFinish: (sigObj: SignatureData) => {
        console.log('signature from debugger', sigObj);
        setSignature(sigObj);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const signStructure = async (message: TupleCV) => {
    clearState();
    setCurrentMessage(serializeCV(message).toString('hex'));
    console.log('signStructure', signStructuredData);
    await signStructuredData({
      /* network: stacksMainnetNetwork, */
      network,
      message,
      onFinish: (sigObj: SignatureData) => {
        console.log('signature from debugger', sigObj);
        setSignature(sigObj);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  return (
    <Box py={6}>
      {signature && (
        <Text textStyle="body.large" display="block" my={'base'}>
          <Text color="green" fontSize={1}>
            {' '}
            Signature {signatureIsVerified ? 'successfully ' : 'not'} verified
          </Text>
        </Text>
      )}
      <Button mt={3} onClick={() => signMessage(signatureMessage)}>
        Signature
      </Button>
      <br />
      <Button mt={3} onClick={() => signMessage(longSignatureMessage)}>
        Signature (long message)
      </Button>
      <br />
      <Button mt={3} onClick={() => signStructure(structuredData)}>
        Signature of Structured Data
      </Button>
    </Box>
  );
};
