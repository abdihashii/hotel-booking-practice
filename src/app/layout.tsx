import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import DarkModeToggle from '@/components/DarkModeToggle';

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
      <body
        className={`${inter.className} w-screen h-screen bg-gray-100 p-4 dark:bg-gray-800 dark:text-gray-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mx-auto w-3/4 gap-4 flex flex-col">
            <header className="self-end">
              <DarkModeToggle />
            </header>

            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
