import { addDays } from 'date-fns';
import { Calendar } from './ui/calendar';

const AvailabilityCalendar = ({
  isLoading,
  unavailableDates,
  startOfCurrentMonth,
}: {
  isLoading: {
    bookings: boolean;
  };
  unavailableDates: Array<
    | Date
    | {
        from: Date;
        to: Date;
      }
  >;
  startOfCurrentMonth: Date;
}) => {
  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-3xl font-bold text-center">Availability Calendar</h2>

      {isLoading.bookings ? (
        <p className="self-center">Loading Availability Calendar...</p>
      ) : (
        <Calendar
          className="w-full hover:cursor-default!"
          mode="range"
          numberOfMonths={1}
          fromMonth={startOfCurrentMonth}
          toMonth={addDays(startOfCurrentMonth, 365)}
          showOutsideDays={false}
          modifiers={{
            unavailable: unavailableDates,
          }}
          modifiersClassNames={{
            unavailable:
              'bg-gray-300 hover:bg-gray-300 font-semibold text-gray-500 hover:text-gray-500 rounded',
          }}
        />
      )}
    </section>
  );
};

export default AvailabilityCalendar;
