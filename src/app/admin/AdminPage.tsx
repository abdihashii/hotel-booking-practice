'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Blocks } from '@/types';
import { Database } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import useBookings from '@/hooks/useBookings';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

const startOfCurrentMonth = new Date(new Date().setDate(1));

const AdminPage = () => {
  const supabase = createClientComponentClient<Database>();

  const [blocks, setBlocks] = useState<Array<Blocks>>([]);
  const [selectBlock, setSelectBlock] = useState<Blocks | null>(null);

  const { unavailableDates, handleGetBookings, isLoading } = useBookings({
    blockName: selectBlock?.block_name ?? '',
  });

  const getAllBlocks = async () => {
    try {
      const { data: blocks, error } = await supabase
        .from('blocks')
        .select('*')
        .order('block_name', { ascending: true });
      if (error) throw error;

      return blocks;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllBlocks().then((b) => setBlocks(b ?? []));
  }, []);

  useEffect(() => {
    handleGetBookings();
  }, [selectBlock]);

  return (
    <section className="space-y-8">
      <h1 className="text-3xl text-center font-bold text-gray-800 dark:text-gray-100">
        Admin Page
      </h1>

      <div className="p-8 w-full border border-white space-y-12 min-h-[521px]">
        <div className="flex flex-row gap-8 w-fit mx-auto">
          {blocks.map((block) => {
            return (
              <Button
                key={block.id}
                className={`text-xl font-semibold
                  ${
                    selectBlock?.id === block.id
                      ? 'bg-green-300 hover:bg-green-500'
                      : ''
                  }
                `}
                onClick={() => setSelectBlock(block)}
              >
                {block.block_name}
              </Button>
            );
          })}
        </div>

        <AvailabilityCalendar
          className="w-fit mx-auto"
          isLoading={isLoading}
          unavailableDates={unavailableDates}
          startOfCurrentMonth={startOfCurrentMonth}
          numberOfMonths={3}
        />
      </div>
    </section>
  );
};

export default AdminPage;
