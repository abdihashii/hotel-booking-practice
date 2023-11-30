import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import DarkModeToggle from '@/components/DarkModeToggle';
import BackButton from '@/components/BackButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hotel Booking App',
  description: 'Created using Next.js, TypeScript, Tailwind CSS, and Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <body
          className={`${inter.className} pt-8 w-screen h-screen bg-gray-100 dark:bg-gray-800 dark:text-gray-100`}
        >
          <header className="mb-8 w-3/4 mx-auto flex flex-row items-center justify-between">
            <BackButton className="mr-auto" />

            <DarkModeToggle className="ml-auto" />
          </header>

          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
