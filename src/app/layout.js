import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "Thapar EduTube",
  description: "Educational platform for Thapar University students",
  keywords: "education, learning, thapar, university, courses",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress YouTube postMessage errors in development
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('postMessage') && e.message.includes('youtube.com')) {
                  e.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <div id="root" className="page-layout">
          {children}
        </div>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1a202c',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              fontSize: '0.875rem',
              fontWeight: '500',
              padding: '1rem 1.25rem',
            },
            success: {
              iconTheme: {
                primary: '#38a169',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#e53e3e',
                secondary: '#ffffff',
              },
            },
            loading: {
              iconTheme: {
                primary: '#4a5568',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
