'use client';

import { useState, useEffect } from 'react';
import { addDays, format, startOfDay } from 'date-fns';
import * as React from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DateRange } from 'react-day-picker';

import DateRangePicker from '@/components/DateRangePicker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

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

const BookingForm = () => {
  const [initialDateRange, setInitialDateRange] = useState<DateRange | null>(
    null,
  );

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

  // on component mount, set initial date range
  useEffect(() => {
    setInitialDateRange({
      from: new Date(),
      to: addDays(new Date(), 1),
    });
  }, []);

  const handleGetValues = () => {
    alert(JSON.stringify(form.getValues(), null, 2));
  };

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

  if (!initialDateRange) return null;

  return (
    <Form {...form}>
      <form
        className="flex w-1/2 flex-col gap-12 rounded-md border border-black dark:border-white p-4 lg:w-fit"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date range</FormLabel>

              <DateRangePicker field={field} />

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
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
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
          variant={'secondary'}
        >
          Get Values
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
