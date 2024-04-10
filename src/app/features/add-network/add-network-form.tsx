import { useCallback, useEffect } from 'react';

import { SelectContent, SelectItem, SelectRoot, SelectTrigger } from '@radix-ui/themes';
import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { useFormikContext } from 'formik';
import { css } from 'leather-styles/css';

import { Input } from '@app/ui/components/input/input';
import { Title } from '@app/ui/components/typography/title';

import { type AddNetworkFormValues, useAddNetwork } from './use-add-network';

export function AddNetworkForm() {
  const { handleChange, setFieldValue, values } = useFormikContext<AddNetworkFormValues>();

  const { bitcoinApi, handleApiChange } = useAddNetwork();

  const setStacksUrl = useCallback(
    (value: string) => {
      void setFieldValue('stacksUrl', value);
    },
    [setFieldValue]
  );

  const setBitcoinUrl = useCallback(
    (value: string) => {
      void setFieldValue('bitcoinUrl', value);
    },
    [setFieldValue]
  );

  useEffect(() => {
    switch (bitcoinApi) {
      case 'mainnet':
        setStacksUrl('https://api.hiro.so');
        setBitcoinUrl('https://blockstream.info/api');
        break;
      case 'testnet':
        setStacksUrl('https://api.testnet.hiro.so');
        setBitcoinUrl('https://blockstream.info/testnet/api');
        break;
      case 'signet':
        setStacksUrl('https://api.testnet.hiro.so');
        setBitcoinUrl('https://mempool.space/signet/api');
        break;
      case 'regtest':
        setStacksUrl('https://api.testnet.hiro.so');
        setBitcoinUrl('https://mempool.space/testnet/api');
        break;
    }
  }, [bitcoinApi, setStacksUrl, setBitcoinUrl]);

  return (
    <>
      <Input.Root>
        <Input.Label>Name</Input.Label>
        <Input.Field
          autoFocus
          data-testid={NetworkSelectors.NetworkName}
          onChange={handleChange}
          name="name"
          value={values.name}
          width="100%"
        />
      </Input.Root>
      <Title>Bitcoin API</Title>
      {/* TODO: Replace with new Select */}
      <SelectRoot onValueChange={handleApiChange} defaultValue="mainnet">
        <SelectTrigger
          className={css({
            backgroundColor: 'ink.background-primary',
            borderRadius: 'sm',
            border: '1px solid ink.border-primary',
          })}
        ></SelectTrigger>
        <SelectContent
          className={css({
            backgroundColor: 'ink.background-primary',
            borderRadius: 'sm',
            border: '1px solid ink.border-primary',
            dropShadow: 'lg',
            height: 'fit-content',
          })}
        >
          <SelectItem key="mainnet" value="mainnet">
            Mainnet
          </SelectItem>
          <SelectItem key="testnet" value="testnet">
            Testnet
          </SelectItem>
          <SelectItem key="signet" value="signet">
            Signet
          </SelectItem>
          <SelectItem key="regtest" value="regtest">
            Regtest
          </SelectItem>
        </SelectContent>
      </SelectRoot>
      <Title>Stacks API URL</Title>
      <Input.Root>
        <Input.Label>Name</Input.Label>
        <Input.Field
          height="inputHeight"
          onChange={handleChange}
          name="stacksUrl"
          value={values.stacksUrl}
          width="100%"
          data-testid={NetworkSelectors.NetworkStacksAddress}
        />
      </Input.Root>
      <Title>Bitcoin API URL</Title>
      <Input.Root>
        <Input.Label>Bitcoin API URL</Input.Label>
        <Input.Field
          onChange={handleChange}
          name="bitcoinUrl"
          value={values.bitcoinUrl}
          width="100%"
          data-testid={NetworkSelectors.NetworkBitcoinAddress}
        />
      </Input.Root>
      <Input.Root>
        <Input.Label>Network key</Input.Label>
        <Input.Field
          data-testid={NetworkSelectors.NetworkKey}
          onChange={handleChange}
          name="key"
          value={values.key}
          width="100%"
        />
      </Input.Root>
    </>
  );
}
