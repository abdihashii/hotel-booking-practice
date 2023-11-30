'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { addDays, format, startOfDay, startOfMonth } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { createDateRanges, findNearestAvailableDateRange } from '@/lib/utils';

import DateRangePicker from '@/components/DateRangePicker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Database } from '@/types/database.types';

const startOfCurrentMonth = startOfMonth(new Date());

const formSchema = z
  .object({
    dateRange: z
      .object({
        from: z
          .date({
            required_error: 'Check-in date is required',
          })
          .refine((date) => startOfDay(date) >= startOfDay(new Date()), {
            message: 'Check-in date must be a future date',
          }),
        to: z.date({
          required_error: 'Check-out date is required',
        }),
      })
      .refine(
        function (data) {
          return startOfDay(data.to) > startOfDay(data.from);
        },
        {
          message:
            'Check-out date must be at least one day after the check-in date',
        }
      ),

    guests: z.number().min(1, {
      message: 'Number of guests must be at least 1',
    }),
  })
  .required();

const BookingForm = ({ blockName }: { blockName: string }) => {
  const supabase = createClientComponentClient<Database>();
  const [initialDateRange, setInitialDateRange] = useState<DateRange | null>(
    null
  );
  const [unavailableDates, setUnavailableDates] = useState<
    Array<Date | { from: Date; to: Date }>
  >([]);
  const [isLoading, setIsLoading] = useState({
    bookings: false,
    values: false,
  });

  // 1. Define a form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: initialDateRange || {
        from: new Date(),
        to: addDays(new Date(), 1),
      },
      guests: 1,
    },
  });

  // 2. Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedValues = {
      ...values,
      dateRange: {
        from: format(values.dateRange.from, 'LLL dd, y'),
        to: format(values.dateRange.to, 'LLL dd, y'),
      },
    };

    alert(
      `dateRange: ${JSON.stringify(
        formattedValues.dateRange,
        null,
        2
      )}\n\nguests: ${JSON.stringify(formattedValues.guests, null, 2)}`
    );
  }

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

  const handleGetValues = () => {
    alert(JSON.stringify(form.getValues(), null, 2));
  };

  useEffect(() => {
    const fetchAndSetInitialDates = async () => {
      const fetchedUnavailableDates = await handleGetBookings(); // Fetch bookings first

      if (fetchedUnavailableDates && fetchedUnavailableDates.length > 0) {
        const nearestAvailableDateRange = findNearestAvailableDateRange(
          fetchedUnavailableDates
        );

        // Update the form's default values with the nearest available date range
        form.reset({
          ...form.getValues(),
          dateRange: nearestAvailableDateRange,
        });

        setInitialDateRange(nearestAvailableDateRange);
      } else {
        setInitialDateRange({
          from: new Date(),
          to: addDays(new Date(), 1),
        });
      }
    };

    fetchAndSetInitialDates();
  }, []); // Empty dependency array ensures this runs once on mount

  if (!initialDateRange) return null;

  return (
    <section className="items-center flex flex-col gap-20 w-full border">
      <Form {...form}>
        <form
          className="flex w-1/2 flex-col gap-12 rounded-md border border-black dark:border-white p-6 lg:w-fit"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date range</FormLabel>

                <DateRangePicker
                  field={field}
                  unavailableDates={unavailableDates}
                />

                {error && (error as any).from && (
                  <p className="text-destructive text-sm font-medium">
                    {(error as any).from.message}
                  </p>
                )}
                {error && (error as any).to && (
                  <p className="text-destructive text-sm font-medium">
                    {(error as any).to.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel htmlFor="guests">Guests</FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                    className="dark:border-gray-600 dark:bg-gray-800"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <section className="flex flex-row justify-between gap-4">
            <Button className="w-1/2" type="submit">
              Book Now
            </Button>

            <Link href="/" className="w-1/2">
              <Button
                className="w-full"
                type="button"
                variant={'destructive'}
                color={'secondary'}
              >
                Cancel
              </Button>
            </Link>
          </section>

          <Button
            className="w-full"
            onClick={handleGetValues}
            type="button"
            variant={'outline'}
          >
            {isLoading.values ? 'Loading...' : 'Get Values'}
          </Button>
        </form>
      </Form>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-center">
          Availability Calendar
        </h2>

        {isLoading.bookings ? (
          <p className="self-center">Loading Availability Calendar...</p>
        ) : (
          <Calendar
            className="w-full hover:cursor-default!"
            mode="range"
            numberOfMonths={3}
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

      <pre>
        <code>{JSON.stringify(unavailableDates, null, 2)}</code>
      </pre>
    </section>
  );
};

export default BookingForm;
