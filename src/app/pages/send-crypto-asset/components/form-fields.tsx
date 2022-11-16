import { useNavigate } from 'react-router-dom';

import { Flex } from '@stacks/ui';

import { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';

import { DividerSeparator } from '@app/components/divider-separator';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';

import { MemoField } from './memo-field';
import { RecipientField } from './recipient-field';
import { SelectedAssetField } from './selected-asset-field';

interface FormFieldsProps {
  assetBalance: AllTransferableCryptoAssetBalances;
  icon: JSX.Element;
}
export function FormFields({ assetBalance, icon }: FormFieldsProps) {
  const navigate = useNavigate();

  const onClickAssetGoBack = () => {
    navigate(RouteUrls.SendCryptoAsset);
  };

  return (
    <Flex
      border="1px solid"
      borderColor="#DCDDE2"
      borderRadius="16px"
      flexDirection="column"
      mt="loose"
      py="loose"
      textAlign="left"
      minWidth={['344px', CENTERED_FULL_PAGE_MAX_WIDTH]}
    >
      <DividerSeparator>
        <SelectedAssetField
          icon={icon}
          name={assetBalance.asset.name}
          onClickAssetGoBack={onClickAssetGoBack}
          symbol={assetBalance.asset.symbol}
        />
        <RecipientField />
        <MemoField />
      </DividerSeparator>
    </Flex>
  );
}
