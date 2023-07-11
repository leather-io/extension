// LocalStorage keys kept across sign-in/signout sessions
const PERSISTENT_LOCAL_DATA: string[] = [];

export function partiallyClearLocalStorage() {
  const backup = PERSISTENT_LOCAL_DATA.map((key: string) => [key, localStorage.getItem(key)]);

  localStorage.clear();

  // Store the backup in localStorage
  backup.forEach(([key, value]) => {
    if (key === null || value === null) return;
    localStorage.setItem(key, value);
  });
  return localStorage;
}
