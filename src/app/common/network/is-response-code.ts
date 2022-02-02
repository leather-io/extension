export function isResponseCode(responseCode: number) {
  return (response: any) => 'status' in response && response.status === responseCode;
}
