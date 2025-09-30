// utils/toolAccess.ts
export const TOOL_ACCESS_COOKIE = 'synq_tool_access';
export const COOKIE_EXPIRY_DAYS = 90;

export const setToolAccess = (userInfo: { name: string; email: string }) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
  
  const cookieValue = JSON.stringify({
    ...userInfo,
    timestamp: new Date().toISOString(),
    expires: expiryDate.toISOString()
  });
  
  document.cookie = `${TOOL_ACCESS_COOKIE}=${encodeURIComponent(cookieValue)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
};

export const getToolAccess = (): { name: string; email: string } | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const accessCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${TOOL_ACCESS_COOKIE}=`)
  );
  
  if (!accessCookie) return null;
  
  try {
    const cookieValue = decodeURIComponent(accessCookie.split('=')[1]);
    const accessData = JSON.parse(cookieValue);
    
    // Check if cookie is expired
    const expiryDate = new Date(accessData.expires);
    if (new Date() > expiryDate) {
      clearToolAccess();
      return null;
    }
    
    return {
      name: accessData.name,
      email: accessData.email
    };
  } catch (error) {
    console.error('Error parsing tool access cookie:', error);
    clearToolAccess();
    return null;
  }
};

export const clearToolAccess = () => {
  document.cookie = `${TOOL_ACCESS_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};