import { createDateRanges, findNearestAvailableDateRange } from '@/lib/utils';
import { Database } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  useState,
  // useEffect
} from 'react';

export default function useBookings({ blockName }: { blockName: string }) {
  const supabase = createClientComponentClient<Database>();

  const [unavailableDates, setUnavailableDates] = useState<
    Array<Date | { from: Date; to: Date }>
  >([]);
  const [isLoading, setIsLoading] = useState({
    bookings: false,
    values: false,
  });

  const handleGetBookings = async () => {
    setIsLoading({ ...isLoading, bookings: true });

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select()
        .eq('block_name', blockName)
        .order('check_in_date', { ascending: true });

      if (error) throw error;

      // Process the booking dates to create an array of unavailable dates
      const uD = data.map((booking) => {
        // Create a range of dates between the check-in and check-out dates
        return createDateRanges(
          new Date(booking.check_in_date),
          new Date(booking.check_out_date)
        );
      });

      setUnavailableDates(uD);

      return uD; // return the fetched unavailable dates
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading({ ...isLoading, bookings: false });
    }
  };

  // useEffect(() => {
  //   handleGetBookings();
  // }, []);

  return {
    unavailableDates,
    isLoading,
    setIsLoading,
    handleGetBookings,
  };
}
