import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "Thapar EduTube",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
