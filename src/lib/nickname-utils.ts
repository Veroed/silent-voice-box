// Generate consistent nickname from IP address
export const generateNicknameFromIP = async (): Promise<string> => {
  try {
    // Try to get IP from multiple sources
    let ip = '';
    
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ip = data.ip;
    } catch {
      // Fallback: use a combination of browser fingerprinting
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx?.fillText('fingerprint', 2, 2);
      const fingerprint = canvas.toDataURL();
      ip = fingerprint.slice(-10);
    }

    // Generate a consistent nickname from the IP/fingerprint
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Use the hash to select from predefined adjectives and animals
    const adjectives = [
      'Swift', 'Brave', 'Quiet', 'Bright', 'Calm', 'Bold', 'Wise', 'Kind',
      'Sharp', 'Quick', 'Gentle', 'Strong', 'Smart', 'Clear', 'Loyal', 'Cool'
    ];
    
    const animals = [
      'Eagle', 'Tiger', 'Fox', 'Wolf', 'Bear', 'Lion', 'Hawk', 'Owl',
      'Deer', 'Rabbit', 'Falcon', 'Lynx', 'Puma', 'Raven', 'Swan', 'Dove'
    ];

    const adjIndex = parseInt(hashHex.slice(0, 8), 16) % adjectives.length;
    const animalIndex = parseInt(hashHex.slice(8, 16), 16) % animals.length;
    const number = (parseInt(hashHex.slice(16, 20), 16) % 999) + 1;

    return `${adjectives[adjIndex]}${animals[animalIndex]}${number}`;
  } catch (error) {
    // Ultimate fallback
    const randomAdj = ['Anonymous', 'Secret', 'Hidden', 'Mystery'][Math.floor(Math.random() * 4)];
    const randomNum = Math.floor(Math.random() * 999) + 1;
    return `${randomAdj}User${randomNum}`;
  }
};

// Cache the nickname for the session
let cachedNickname: string | null = null;

export const getUserNickname = async (): Promise<string> => {
  if (cachedNickname) {
    return cachedNickname;
  }
  
  cachedNickname = await generateNicknameFromIP();
  return cachedNickname;
};