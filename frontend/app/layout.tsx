import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Komorebi+',
  description: 'The New Value Based Patient Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}


