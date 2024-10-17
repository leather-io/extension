import { useCallback } from 'react';

import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { useFormikContext } from 'formik';
import { HStack, styled } from 'leather-styles/jsx';

import {
  BITCOIN_API_BASE_URL_MAINNET,
  BITCOIN_API_BASE_URL_TESTNET3,
  BITCOIN_API_BASE_URL_TESTNET4,
  type BitcoinNetwork,
} from '@leather.io/models';
import {
  CheckmarkIcon,
  ChevronDownIcon,
  Input,
  Select,
  SelectItemLayout,
  Title,
} from '@leather.io/ui';

import { useOnMount } from '@app/common/hooks/use-on-mount';

import { type AddNetworkFormValues } from './use-add-network';

const networks: {
  label: string;
  value: BitcoinNetwork;
}[] = [
  {
    label: 'Mainnet',
    value: 'mainnet',
  },
  {
    label: 'Testnet3',
    value: 'testnet3',
  },
  {
    label: 'Testnet4',
    value: 'testnet4',
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

interface NetworkFormFieldsProps {
  isEditNetworkMode?: boolean;
}

export function NetworkFormFields({ isEditNetworkMode }: NetworkFormFieldsProps) {
  const { handleChange, setFieldValue, values, initialValues } =
    useFormikContext<AddNetworkFormValues>();

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

  function setNetworkUrls(value: BitcoinNetwork) {
    switch (value) {
      case 'mainnet':
        setStacksUrl('https://api.hiro.so');
        setBitcoinUrl(BITCOIN_API_BASE_URL_MAINNET);
        break;
      case 'testnet3':
        setStacksUrl('https://api.testnet.hiro.so');
        setBitcoinUrl(BITCOIN_API_BASE_URL_TESTNET3);
        break;
      case 'testnet4':
        setStacksUrl('https://api.testnet.hiro.so');
        setBitcoinUrl(BITCOIN_API_BASE_URL_TESTNET4);
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
  }

  useOnMount(() => {
    if (isEditNetworkMode) {
      return;
    }

    setNetworkUrls(values.bitcoinNetwork);
  });

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
        defaultValue={initialValues.bitcoinNetwork || networks[0].value}
        onValueChange={(value: BitcoinNetwork) => {
          setNetworkUrls(value);
          void setFieldValue('bitcoinNetwork', value);
        }}
      >
        <Select.Trigger data-testid={NetworkSelectors.AddNetworkBitcoinAPISelector}>
          <Select.Value />
          <Select.Icon>
            <ChevronDownIcon variant="small" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content align="start" position="popper" sideOffset={8}>
            <Select.Viewport>
              {networks.map(item => (
                <Select.Item
                  key={item.label}
                  value={item.value}
                  data-testid={`bitcoin-api-option-${item.value}`}
                >
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
    </>
  );
}
