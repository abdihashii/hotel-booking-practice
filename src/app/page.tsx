import Block from '@/components/Block';

export default function Home() {
  return (
    <main className="w-3/4 mx-auto">
      <section className="grid grid-cols-2 gap-8 w-full">
        <Block blockName="block-a" />
        <Block blockName="block-b" />
        <Block blockName="block-c" />
        <Block blockName="block-d" />
      </section>
    </main>
  );
}
