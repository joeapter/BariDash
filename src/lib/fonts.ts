import { Assistant, David_Libre } from 'next/font/google';

export const bodyFont = Assistant({
  subsets: ['latin', 'hebrew'],
  variable: '--font-body',
  display: 'swap'
});

export const displayFont = David_Libre({
  subsets: ['latin', 'hebrew'],
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap'
});
