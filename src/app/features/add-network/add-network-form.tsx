import { useCallback, useEffect } from 'react';

import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { useFormikContext } from 'formik';
import { HStack, styled } from 'leather-styles/jsx';

import type { BitcoinNetworkModes } from '@leather-wallet/models';

import { Input } from '@app/ui/components/input/input';
import { Select } from '@app/ui/components/select/select';
import { SelectItemLayout } from '@app/ui/components/select/select-item.layout';
import { Title } from '@app/ui/components/typography/title';
import { CheckmarkIcon, ChevronDownIcon } from '@app/ui/icons';

import { type AddNetworkFormValues } from './use-add-network';

const networks: {
  label: string;
  value: BitcoinNetworkModes;
}[] = [
  {
    label: 'Mainnet',
    value: 'mainnet',
  },
  {
    label: 'Testnet',
    value: 'testnet',
  },
  {
    label: 'Signet',
    value: 'signet',
  },
  {
    label: 'Regtest',
    value: 'regtest',
  },
];

export function AddNetworkForm() {
  const { handleChange, setFieldValue, values } = useFormikContext<AddNetworkFormValues>();

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
    switch (values.bitcoinNetwork) {
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
  }, [setStacksUrl, setBitcoinUrl, values.bitcoinNetwork]);

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

      <Select.Root
        defaultValue={networks[0].value}
        onValueChange={value => {
          void setFieldValue('bitcoinApi', value);
        }}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Icon>
            <ChevronDownIcon variant="small" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content align="start" position="popper" sideOffset={8}>
            <Select.Viewport>
              {networks.map(item => (
                <Select.Item key={item.label} value={item.value}>
                  <SelectItemLayout
                    contentLeft={
                      <HStack display="flex" gap="space.02" width="100%">
                        <Select.ItemText>
                          <styled.span textStyle="label.02">{item.label}</styled.span>
                        </Select.ItemText>
                        <Select.ItemIndicator>
                          <CheckmarkIcon variant="small" />
                        </Select.ItemIndicator>
                      </HStack>
                    }
                  />
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

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
