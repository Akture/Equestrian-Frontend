import Script from 'next/script';
import { Instrument_Serif, Inter, Outfit } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const label = Outfit({
  subsets: ['latin'],
  variable: '--font-label',
  display: 'swap',
});

export const metadata = {
  title: 'Akture Equestrian — every ride, from three angles',
  description:
    'Cameras in the ring at your barn record every lesson and every round. Pick the time you rode and watch it from every angle.',
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: '#08150F',
};

// The parent Akture site follows the system colour scheme with no manual switch.
// This mockup keeps that default but adds a toggle so reviewers can see both grounds.
const themeBootstrap = `
(function () {
  try {
    var stored = localStorage.getItem('aq-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (stored !== 'light' && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the bootstrap below adds `dark` to <html> before
    // React hydrates, so the class list legitimately differs from the server's.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${label.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css"
        />
        <Script id="aq-theme" strategy="beforeInteractive">
          {themeBootstrap}
        </Script>
      </head>
      <body className="bg-oat text-ink dark:bg-ink dark:text-oat">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
