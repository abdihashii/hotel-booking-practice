'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format, startOfDay, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { findNearestAvailableDateRange } from '@/lib/utils';

import DateRangePicker from '@/components/DateRangePicker';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useBookings from '@/hooks/useBookings';
import AvailabilityCalendar from './AvailabilityCalendar';

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
        },
      ),

    guests: z.number().min(1, {
      message: 'Number of guests must be at least 1',
    }),
  })
  .required();

const BookingForm = ({ blockName }: { blockName: string }) => {
  const [initialDateRange, setInitialDateRange] = useState<DateRange | null>(
    null,
  );
  const { unavailableDates, isLoading, handleGetBookings, setIsLoading } =
    useBookings({ blockName });

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
        2,
      )}\n\nguests: ${JSON.stringify(formattedValues.guests, null, 2)}`,
    );
  }

  const handleGetValues = () => {
    alert(JSON.stringify(form.getValues(), null, 2));
  };

  useEffect(() => {
    const fetchAndSetInitialDates = async () => {
      const fetchedUnavailableDates = await handleGetBookings(); // Fetch bookings first

      if (fetchedUnavailableDates && fetchedUnavailableDates.length > 0) {
        const nearestAvailableDateRange = findNearestAvailableDateRange(
          fetchedUnavailableDates,
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
          className="w-fit flex flex-col gap-8 rounded-md border border-black dark:border-white p-6 lg:w-fit"
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

          <Button type="submit">Book Now</Button>

          <Button onClick={handleGetValues} type="button" variant={'outline'}>
            {isLoading.values ? 'Loading...' : 'Get Values'}
          </Button>
        </form>
      </Form>

      <AvailabilityCalendar
        isLoading={isLoading}
        unavailableDates={unavailableDates}
        startOfCurrentMonth={startOfCurrentMonth}
      />

      {/* <pre>
        <code>{JSON.stringify(unavailableDates, null, 2)}</code>
      </pre> */}
    </section>
  );
};

export default BookingForm;
