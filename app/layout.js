/* eslint-disable */
'use client';

import { SessionProvider } from 'next-auth/react';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Link to Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
