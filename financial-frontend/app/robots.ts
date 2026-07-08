export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',     // एडमिन पैनल को गूगल से छिपाओ (सुरक्षा)
        '/api/',       // बैकएंड API को छिपाओ
        '/session-status',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}