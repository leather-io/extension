/* eslint-disable */
// const emilyReqPayload = {
//   bitcoinTxid: txId,
//   bitcoinTxOutputIndex: 0,
//   reclaimScript: reclaimScriptHex,
//   depositScript: depositScriptHexPreHash,
//   url: emilyUrl,
// };

// const response = await fetch('/api/emilyDeposit', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(emilyReqPayload),
// });

// export async function POST(req: NextRequest) {
//   try {
//     const body: CreateDepositRequestBody = await req.json();

//     const paramsBody = {
//       bitcoinTxid: body.bitcoinTxid,
//       bitcoinTxOutputIndex: body.bitcoinTxOutputIndex,
//       reclaimScript: body.reclaimScript,
//       depositScript: body.depositScript,
//     };
//     // Forward the request to the Rust server
//     const response = await fetch(`${body.url}/deposit`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': env.EMILY_API_KEY || '',
//       },
//       body: JSON.stringify(paramsBody),
//     });

//     // If Rust server responds with an error status
//     if (!response.ok) {
//       const errorResponse = await response.json();
//       return NextResponse.json({ error: errorResponse }, { status: response.status });
//     }

//     // Return the success response from Rust server
//     const responseData = await response.json();
//     return NextResponse.json(responseData, { status: 201 });
//   } catch (error) {
//     console.error('Error forwarding request to Rust server:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

const emilyUrl = 'https://beta.sbtc-emily.com/deposit';

export async function notifySbtc({
  depositScript,
  reclaimScript,
  vout = 0,
  ...tx
}: {
  depositScript: string;
  reclaimScript: string;
  /** Optional, output index (defaults to `0`) */
  vout?: number;
} & ({ txid: string } | { transaction: { id: string } })) {
  return (await fetch(emilyUrl, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '',
    },
    method: 'POST',
    body: JSON.stringify({
      bitcoinTxid: 'txid' in tx ? tx.txid : tx.transaction.id,
      bitcoinTxOutputIndex: vout,
      depositScript,
      reclaimScript,
      emilyUrl,
    }),
  }).then(res => res.json())) as {
    bitcoinTxid: string;
    bitcoinTxOutputIndex: number;
    recipient: string;
    amount: number;
    lastUpdateHeight: number;
    lastUpdateBlockHash: string;
    status: string;
    statusMessage: string;
    parameters: {
      maxFee: number;
      lockTime: number;
    };
    reclaimScript: string;
    depositScript: string;
  };
}
