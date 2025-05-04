export const buildFullShortUrl = (shortCode: string): string => {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    return `${baseUrl}/${shortCode}`;
  };
  