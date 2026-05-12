import './globals.css';

export const metadata = {
  title: 'PhotoDrop Sports Cards',
  description: 'Scan, pay, upload, and create custom sports trading cards.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
