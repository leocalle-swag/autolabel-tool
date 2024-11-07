const STORAGE_KEY = 'openai_api_key';

// Encryption/decryption functions (versione semplificata)
function encrypt(text: string): string {
  return btoa(text); // Semplice encoding in base64
}

function decrypt(text: string): string {
  return atob(text); // Decodifica base64
}

export const storage = {
  saveApiKey: (apiKey: string) => {
    const encrypted = encrypt(apiKey);
    localStorage.setItem(STORAGE_KEY, encrypted);
  },
  
  getApiKey: (): string | null => {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) return null;
    return decrypt(encrypted);
  },
  
  removeApiKey: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};