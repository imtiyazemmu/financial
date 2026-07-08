export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  
  // अगर पहले से full URL है (http:// या https://) तो वापस करें
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // अन्यथा, API_BASE_URL (Flask Backend) से जोड़ें
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
  
  // path को सही format में लाएँ
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}