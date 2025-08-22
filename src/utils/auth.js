export function getUserEmailFromJWT() {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('CF_Authorization='));
  
    if (!cookie) return null;
  
    const token = cookie.split('=')[1];
    const payload = token.split('.')[1];
  
    try {
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.email;
    } catch (e) {
      console.error('Failed to decode JWT', e);
      return null;
    }
  }
  