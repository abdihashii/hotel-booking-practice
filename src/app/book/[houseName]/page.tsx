import BookingForm from '@/components/BookingForm';

export default function bookHouseNamePage({
  params: { houseName },
}: {
  params: {
    houseName: string;
  };
}) {
  return (
    <main className="flex flex-col items-center gap-8">
      <h1 className="mt-10 text-3xl font-bold text-gray-800 dark:text-gray-100">
        Book &quot;{houseName}&quot;
      </h1>

      <BookingForm />
    </main>
  );
}
