import BookingForm from '@/components/BookingForm';

export default function bookingPage({
  params: { blockName },
}: {
  params: {
    blockName: string;
  };
}) {
  const sanitizeBlockName = (bN: string) => {
    // split between the dash
    let [block, name] = bN.split('-');

    // set block to title case
    block = block.charAt(0).toUpperCase() + block.slice(1);

    return `${block}-${name.toUpperCase()}`;
  };

  return (
    <main className="flex flex-col items-center gap-8">
      <h1 className="mt-10 text-3xl text-center font-bold text-gray-800 dark:text-gray-100">
        Book: {sanitizeBlockName(blockName)}
      </h1>

      <BookingForm blockName={blockName} />
    </main>
  );
}
