import React, { useEffect, useState } from 'react';
import { Box, Button, Text } from '@stacks/ui';
import { stacksMainnetNetwork, stacksTestnetNetwork as network, stacksTestnetNetwork } from '@common/utils';
import { SignatureData } from '@stacks/connect';

import {
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
  tupleCV,
  uintCV,
  ClarityValue,
  encodeStructuredData,
  TupleCV,
} from '@stacks/transactions';
import { useConnect } from '@stacks/connect-react';
import { hashMessage, verifyMessageSignatureRsv } from '@stacks/encryption';
import { sha256 } from 'sha.js';
import { StacksNetwork } from '@stacks/network';

export const Signature = () => {
  const [signature, setSignature] = useState<SignatureData | undefined>();
  const [signatureStructured, setSignatureStructured] = useState<SignatureData | undefined>();
  const [signatureIsVerified, setSignatureIsVerified] = useState<boolean | undefined>();
  const [currentMessage, setCurrentMessage] = useState<string | undefined>();
  const [currentStructuredData, setCurrentStructuredData] = useState<{message: ClarityValue, domain: ClarityValue} | undefined>();
  const signatureMessage = 'Hello world!';
  const longSignatureMessage =
    'Nullam eu ante vel est convallis dignissim.  Fusce suscipit, wisi nec facilisis facilisis, est dui fermentum leo, quis tempor ligula erat quis odio.  Nunc porta vulputate tellus.  Nunc rutrum turpis sed pede.  Sed bibendum.  Aliquam posuere.  Nunc aliquet, augue nec adipiscing interdum, lacus tellus malesuada massa, quis varius mi purus non odio.  Pellentesque condimentum, magna ut suscipit hendrerit, ipsum augue ornare nulla, non luctus diam neque sit amet urna.  Curabitur vulputate vestibulum lorem.  Fusce sagittis, libero non molestie mollis, magna orci ultrices dolor, at vulputate neque nulla lacinia eros.  Sed id ligula quis est convallis tempor.  Curabitur lacinia pulvinar nibh.  Nam a sapien.';
  const signatureMessageWithLineBreaks =
    'This is line one.\nThis is line two.\nThis is line three.\nThis is line four.\nThis is line five.';
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
    
    const verified = verifyMessageSignatureRsv({
      ...signature,
      message: hashMessage(currentMessage),
    });
    setSignatureIsVerified(verified);
  }, [signature, currentMessage]);

  useEffect(() => {
    if (!signatureStructured || !currentStructuredData) return;
    const message = encodeStructuredData(currentStructuredData);
    const messageHash = new sha256().update(message).digest('hex')
    const verified = verifyMessageSignatureRsv({
      ...signatureStructured,
      message: Buffer.from(messageHash, 'hex'),
    });
    
    setSignatureIsVerified(verified);
  }, [signatureStructured, currentStructuredData]);

  const clearState = () => {
    setSignatureIsVerified(undefined);
    setSignature(undefined);
    setSignatureStructured(undefined);
  };

  const signMessage = async (message: string, network?: StacksNetwork) => {
    clearState();
    setCurrentMessage(message);
    const defaultNetwork = stacksTestnetNetwork;
    await sign({
      network: network ?? defaultNetwork,
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
  const domain = tupleCV({
    name: stringAsciiCV('hiro.so'),
    version: stringAsciiCV('1.0.0'),
    'chain-id': uintCV(1),
  }); 

  const signStructure = async (message: ClarityValue, domain: TupleCV) => {
    console.log('signStructure', message, domain);
    clearState();

    setCurrentStructuredData({message, domain});
    console.log('signStructure', message, domain);
    await signStructuredData({
      /* network: stacksMainnetNetwork, */
      network,
      message,
      domain,
      onFinish: (sigObj: SignatureData) => {
        console.log('signature from debugger', sigObj);
        setSignatureStructured(sigObj);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const sip18Test = [{
    message: stringAsciiCV('Hello World'),
    domain: tupleCV({
      name: stringAsciiCV('Test App'),
      version: stringAsciiCV('1.0.0'),
      'chain-id': uintCV(1),
    }),
  }]

  return (
    <Box py={6}>
      {(signature || signatureStructured) && (
        <Text textStyle="body.large" display="block" my={'base'}>
          <Text color="green" fontSize={1}>
            {' '}
            Signature {signatureIsVerified ? 'successfully ' : 'not'} verified
          </Text>
        </Text>
      )}
      <Button mt={3} onClick={() => signMessage(signatureMessage, stacksMainnetNetwork)}>
        Signature (Mainnet)
      </Button>
      <Button mt={3} ml={3} onClick={() => signMessage(signatureMessage, stacksTestnetNetwork)}>
        Signature (Testnet)
      </Button>
      <br />
      <Button mt={3} onClick={() => signMessage(longSignatureMessage)}>
        Signature (long message)
      </Button>
      <br />
      <Button mt={3} onClick={() => signMessage(signatureMessageWithLineBreaks)}>
        Signature (with line breaks)
      </Button>
      <br />
      <Button mt={3} onClick={() => signStructure(structuredData, domain)}>
        Signature of Structured Data (2)
      </Button>
      <br />
      <hr style={{margin: '10px'}}/>
      <Button mt={3} onClick={() => signStructure(sip18Test[0].message, sip18Test[0].domain)}>
        Signature of Structured Data SIP-018 test vector
      </Button>
      <br/>
      <span>expected hash : '1bfdab6d4158313ce34073fbb8d6b0fc32c154d439def12247a0f44bb2225259'</span>
    </Box>
  );
};
