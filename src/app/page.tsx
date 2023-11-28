import House from '@/components/House';

export default function Home() {
  return (
    <main className="gap-4 flex flex-col">
      <section className="flex flex-col gap-8">
        <House houseName="A" />
        <House houseName="B" />
        <House houseName="C" />
        <House houseName="D" />
      </section>
    </main>
  );
}
