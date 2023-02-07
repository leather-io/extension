import { useQuery } from '@tanstack/react-query';

import { logAndThrow } from '@app/common/utils';

async function fetchCexAddresses() {
  const response = await fetch('https://stacksonchain.com/api/v2/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `select sender_address as address
                from transactions tx
                join stxop.accounts bal on (account = sender_address)
                --where tx_type = 'token transfer'
                where type_id = 0
                group by sender_address
                having count(*) >= 100 
                    and count(distinct token_transfer_recipient_address) >= 10 
                    and count(distinct token_transfer_memo) - 1 > 0
                limit 100
              `,
    }),
  });

  if (!response.ok) logAndThrow('Cannot load exchange addresses');

  const { columns } = await response.json();
  return columns.address;
}

export function useExchangeAddressesQuery() {
  return useQuery({
    queryFn: () => fetchCexAddresses(),
    queryKey: ['exchange-addresses'],
  });
}
