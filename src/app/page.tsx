'use client';

import House from '@/components/House';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { setTheme, theme } = useTheme();

  return (
    <main className="w-screen h-screen gap-4 bg-gray-100 p-4 dark:bg-gray-800 dark:text-gray-100">
      <div className="gap-4 flex flex-col w-3/4 mx-auto">
        <section className="self-end">
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <Sun /> : <Moon />}
          </Button>
        </section>

        <section className="flex flex-col gap-8">
          <House houseName="A" />
          <House houseName="B" />
          <House houseName="C" />
          <House houseName="D" />
        </section>
      </div>
    </main>
  );
}
