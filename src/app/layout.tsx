import "./globals.css";

import { Noto_Sans_Thai } from 'next/font/google';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'], // Thai and Latin character support
  weight: ['400', '700'], // Optional: Specify font weights
  variable: '--font-noto-sans-thai', // Use a CSS variable for the font
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSansThai.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
