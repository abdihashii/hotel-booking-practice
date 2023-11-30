import Block from '@/components/Block';

export default function Home() {
  return (
    <main className="w-3/4 mx-auto gap-4 flex flex-col">
      <section className="flex flex-col gap-8">
        <Block blockName="A" />
        <Block blockName="B" />
        <Block blockName="C" />
        <Block blockName="D" />
      </section>
    </main>
  );
}
