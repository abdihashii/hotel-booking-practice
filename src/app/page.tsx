import House from '@/components/House';

export default function Home() {
  return (
    <main className="h-screen items-center gap-4 bg-gray-100 p-4 dark:bg-gray-800 dark:text-gray-100">
      <div className="flex flex-col gap-8">
        <House houseName="A" />
        <House houseName="B" />
        <House houseName="C" />
        <House houseName="D" />
      </div>
    </main>
  );
}
