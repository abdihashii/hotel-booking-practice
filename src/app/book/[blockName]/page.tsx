import BookingForm from '@/components/BookingForm';
import { sanitizeBlockName } from '@/lib/utils';

export default function bookingPage({
  params: { blockName },
}: {
  params: {
    blockName: string;
  };
}) {
  return (
    <main className="py-10 flex flex-col items-center gap-8 w-3/4 mx-auto border-2 border-black dark:border-white rounded-md">
      <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-gray-100">
        Book: {sanitizeBlockName(blockName)}
      </h1>

      <BookingForm blockName={blockName} />
    </main>
  );
}
