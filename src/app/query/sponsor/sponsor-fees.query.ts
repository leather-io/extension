import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
};

export async function verifySponsorTransaction(apiUrl: string, tx: string): Promise<boolean> {
  const resp = await axios.post(`${apiUrl}/verify`, { tx }, { headers });
  return resp.data;
}

export async function submitSponsorTransaction(
  apiUrl: string,
  tx: string
): Promise<{ txid: string }> {
  const resp = await axios.post(`${apiUrl}/submit`, { tx }, { headers });
  return resp.data;
}
