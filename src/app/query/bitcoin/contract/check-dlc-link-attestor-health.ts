export async function checkDlcLinkAttestorHealth(attestorUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${attestorUrl}/health`, {
      method: 'get',
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}
