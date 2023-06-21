import { Box } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { Money } from '@shared/models/money.model';
import { isUndefined } from '@shared/utils';

import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';
import { InscriptionPreview } from '@app/components/inscription-preview-card/components/inscription-preview';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useInscription } from '@app/query/bitcoin/ordinals/inscription.hooks';

import { PsbtDecodedNodeLayout } from '../../psbt-decoded-request-node/psbt-decoded-node.layout';

interface PsbtUnsignedInputWithInscriptionProps {
  address: string;
  path: string;
  value: Money;
}
export function PsbtUnsignedInputWithInscription({
  address,
  value,
  path,
}: PsbtUnsignedInputWithInscriptionProps) {
  const {
    isLoading,
    isError,
    data: inscription,
  } = useInscription(path.replace('/inscription/', ''));

  if (isLoading)
    return (
      <Box my="loose">
        <LoadingSpinner />
      </Box>
    );
  if (isError || isUndefined(inscription))
    return (
      <PsbtDecodedNodeLayout
        hoverLabel={address}
        image={<OrdinalIcon />}
        subtitle={truncateMiddle(address)}
        subValue="# Unknown"
        title="No data"
        value={`-${formatMoneyWithoutSymbol(value)}`}
      />
    );

  return (
    <PsbtDecodedNodeLayout
      hoverLabel={address}
      image={<InscriptionPreview inscription={inscription} height="40px" width="40px" />}
      subtitle={truncateMiddle(address)}
      subValue={`#${inscription.number}`}
      subValueAction={() => openInNewTab(inscription.infoUrl)}
      title="Ordinal inscription"
      value={`-${formatMoneyWithoutSymbol(value)}`}
    />
  );
}
