import { useEffect, useState } from 'react';
import React from 'react';

import { stacksTestnetNetwork as network, stacksTestnetNetwork } from '@common/utils';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { SignatureData } from '@stacks/connect-jwt';
import { useConnect } from '@stacks/connect-react-jwt';
import { hashMessage, verifyMessageSignatureRsv } from '@stacks/encryption';
import { StacksNetwork } from '@stacks/network';
import {
  ClarityValue,
  TupleCV,
  bufferCVFromString,
  contractPrincipalCV,
  encodeStructuredData,
  falseCV,
  intCV,
  listCV,
  noneCV,
  responseErrorCV,
  responseOkCV,
  serializeCV,
  someCV,
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  trueCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import { Box, styled } from 'leather-styles/jsx';

import { LeatherProvider } from '@leather.io/rpc';

declare global {
  interface Window {
    LeatherProvider?: LeatherProvider;
  }
}

export const Signature = () => {
  const [signature, setSignature] = useState<SignatureData | undefined>();
  const [signatureStructured, setSignatureStructured] = useState<SignatureData | undefined>();
  const [signatureIsVerified, setSignatureIsVerified] = useState<boolean | undefined>();
  const [currentMessage, setCurrentMessage] = useState<string | undefined>();
  const [currentStructuredData, setCurrentStructuredData] = useState<
    { message: ClarityValue; domain: ClarityValue } | undefined
  >();
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
    const messageHash = bytesToHex(sha256(message));
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

  const signMessageRpc = async (message: string) => {
    if (!window.LeatherProvider) throw new Error('LeatherProvider not found');

    clearState();
    setCurrentMessage(message);

    const result = await window.LeatherProvider.request('stx_signMessage', {
      message,
      messageType: 'utf8',
    });

    const isValid = verifyMessageSignatureRsv({
      ...result.result,
      message: hashMessage(message),
    });

    console.log('Is message valid', isValid);

    console.log('signature from rpc', result);
  };

  const domain = tupleCV({
    name: stringAsciiCV('hiro.so'),
    version: stringAsciiCV('1.0.0'),
    'chain-id': uintCV(1),
  });

  const signStructure = async (message: ClarityValue, domain: TupleCV) => {
    console.log('signStructure', message, domain);
    clearState();

    setCurrentStructuredData({ message, domain });
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

  const signStructureRpc = async (message: ClarityValue, domain: TupleCV) => {
    if (!window.LeatherProvider) throw new Error('LeatherProvider not found');

    clearState();
    setCurrentStructuredData({ message, domain });

    // ClarityValue -> Uint8Array -> Buffer -> string (hex)
    const stringMessage = serializeCV(message);
    const stringDomain = serializeCV(domain);

    const result = await window.LeatherProvider.request('stx_signStructuredMessage', {
      message: stringMessage,
      messageType: 'structured',
      domain: stringDomain,
    });

    setSignatureStructured(result.result);
  };

  const sip18Test = [
    {
      message: stringAsciiCV('Hello World'),
      domain: tupleCV({
        name: stringAsciiCV('Test App'),
        version: stringAsciiCV('1.0.0'),
        'chain-id': uintCV(1),
      }),
    },
  ];

  return (
    <Box py={6}>
      {(signature || signatureStructured) && (
        <styled.span textStyle="body.large" display="block" my="space.04">
          <styled.span color="green">
            Signature {signatureIsVerified ? 'successfully ' : 'not'} verified
          </styled.span>
        </styled.span>
      )}
      <styled.button mt={3} onClick={() => signMessage(signatureMessage)}>
        Signature (Mainnet)
      </styled.button>
      <styled.button mt={3} ml={3} onClick={() => signMessage(signatureMessage)}>
        Signature (Testnet)
      </styled.button>
      <br />
      <styled.button mt={3} onClick={() => signMessage(longSignatureMessage)}>
        Signature (long message)
      </styled.button>
      <br />
      <styled.button mt={3} onClick={() => signMessage(signatureMessageWithLineBreaks)}>
        Signature (with line breaks)
      </styled.button>
      <br />
      <styled.button mt={3} onClick={() => signStructure(structuredData, domain)}>
        Signature of Structured Data (2)
      </styled.button>
      <br />
      <hr style={{ margin: '10px' }} />
      <styled.button
        mt={3}
        onClick={() => signStructure(sip18Test[0].message, sip18Test[0].domain)}
      >
        Signature of Structured Data SIP-018 test vector
      </styled.button>
      <br />
      <span>
        expected hash : '1bfdab6d4158313ce34073fbb8d6b0fc32c154d439def12247a0f44bb2225259'
      </span>
      <br />
      <hr style={{ margin: '10px' }} />
      <span>RPC</span>
      <br />
      <styled.button mt={3} onClick={() => signMessageRpc(signatureMessage)}>
        Signature RPC (Testnet)
      </styled.button>
      <br />
      <styled.button mt={3} onClick={() => signStructureRpc(structuredData, domain)}>
        Signature Structure RPC (Testnet)
      </styled.button>
    </Box>
  );
};
