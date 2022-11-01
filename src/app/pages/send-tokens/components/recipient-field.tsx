import { memo, useCallback } from 'react';
import { useState } from 'react';
import { FiCopy, FiInfo } from 'react-icons/fi';

import { Box, Input, InputGroup, Stack, StackProps, Text, useClipboard } from '@stacks/ui';
import { color, truncateMiddle } from '@stacks/ui-utils';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import { useFormikContext } from 'formik';

import { SendFormValues } from '@shared/models/form.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { ErrorLabel } from '@app/components/error-label';
import { Tooltip } from '@app/components/tooltip';
import { Caption } from '@app/components/typography';
import { useStacksClient } from '@app/store/common/api-clients.hooks';

interface RecipientField extends StackProps {
  error?: string;
  value: string;
}

// TODO: this should use a new "Field" component (with inline label like in figma)
function RecipientFieldBase(props: RecipientField) {
  const { error, value, ...rest } = props;
  const { handleChange, values, setFieldValue } = useFormikContext<SendFormValues>();
  const client = useStacksClient();
  const [resolvedBnsAddress, setResolvedBnsAddress] = useState('');
  const { onCopy, hasCopied } = useClipboard(resolvedBnsAddress);
  const analytics = useAnalytics();

  const copyToClipboard = () => {
    void analytics.track('copy_resolved_address_to_clipboard');
    onCopy();
  };

  const onHover = useCallback(
    () => analytics.track('view_resolved_recipient_address'),
    [analytics]
  );

  return (
    <Stack width="100%" {...rest}>
      <InputGroup flexDirection="column">
        <Text
          as="label"
          display="block"
          mb="tight"
          fontSize={1}
          fontWeight="500"
          htmlFor="recipientAddressOrBnsName"
        >
          Recipient
        </Text>
        <Input
          display="block"
          type="string"
          width="100%"
          name="recipientAddressOrBnsName"
          value={value}
          onChange={handleChange}
          onBlur={async () => {
            setResolvedBnsAddress('');
            try {
              const res = await client.namesApi.getNameInfo({ name: value ?? '' });
              if (res.address) {
                setFieldValue('recipient', res.address);
                setResolvedBnsAddress(res.address);
              } else {
                setFieldValue('recipient', values.recipientAddressOrBnsName);
              }
              return;
            } catch {
              setFieldValue('recipient', values.recipientAddressOrBnsName);
            }
          }}
          placeholder="Enter an address or BNS name"
          autoComplete="off"
          data-testid={SendFormSelectors.InputRecipientField}
        />
      </InputGroup>
      {Boolean(resolvedBnsAddress) && (
        <Stack isInline spacing="tight">
          <Caption display="inline">{truncateMiddle(resolvedBnsAddress, 4)}</Caption>
          <Tooltip label={resolvedBnsAddress} placement="bottom">
            <Stack display="inline-flex">
              <Box
                _hover={{ cursor: 'pointer' }}
                onMouseOver={onHover}
                as={FiInfo}
                color={color('text-caption')}
                size="14px"
              />
            </Stack>
          </Tooltip>
          <Tooltip placement="right" label={hasCopied ? 'Copied!' : 'Copy address'}>
            <Stack>
              <Box
                _hover={{ cursor: 'pointer' }}
                onClick={copyToClipboard}
                size="12px"
                color={color('text-caption')}
                as={FiCopy}
              />
            </Stack>
          </Tooltip>
        </Stack>
      )}
      {error && (
        <ErrorLabel data-testid={SendFormSelectors.InputRecipientFieldErrorLabel}>
          <Text textStyle="caption">{error}</Text>
        </ErrorLabel>
      )}
    </Stack>
  );
}

export const RecipientField = memo(RecipientFieldBase);
