import "./globals.css";
import { Toaster } from 'react-hot-toast';
import ConsoleSuppressionWrapper from './providers';

export const metadata = {
  title: "Thapar EduTube",
  description: "Educational platform for Thapar University students",
  keywords: "education, learning, thapar, university, courses",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
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
              // Suppress console output in production (non-localhost environments)
              if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.hostname !== '[::1]') {
                const noop = () => {};
                window.console = {
                  ...window.console,
                  log: noop,
                  error: noop,
                  warn: noop,
                  info: noop,
                  debug: noop,
                };
              }
              
              // Suppress YouTube postMessage errors
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
        <ConsoleSuppressionWrapper>
          <div id="root" className="page-layout">
            {children}
          </div>
        </ConsoleSuppressionWrapper>
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
