import Link from 'next/link';
import React from 'react';

const Block = ({ blockName }: { blockName: string }) => {
  return (
    <section className="rounded flex flex-col gap-4 border border-black dark:border-white p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Block {blockName}
      </h2>

      <Link
        href={`/book/block-${blockName.toLowerCase()}`}
        className="w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Book Now
      </Link>
    </section>
  );
};

export default Block;
