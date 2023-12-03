import { createServerSupabaseClient } from '@/lib/supabaseServerClient';
import { sanitizeBlockName } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Block = async ({ blockName }: { blockName: string }) => {
  const supabase = createServerSupabaseClient();

  const { data: block, error } = await supabase
    .from('blocks')
    .select()
    .eq('block_name', blockName)
    .single();

  if (error) {
    console.error(error);
    return <p>{error.message}</p>;
  }

  if (!block) {
    return <p>Block not found</p>;
  }

  return (
    <section className="items-center rounded flex flex-col gap-8 border border-black dark:border-white p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        {sanitizeBlockName(blockName)}
      </h2>

      <Image
        src={block.image_url as string}
        alt={block.image_alt as string}
        width={500}
        height={500}
      />

      <Link
        href={`/book/${blockName.toLowerCase()}`}
        className="w-full text-center rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Book Now
      </Link>
    </section>
  );
};

export default Block;
