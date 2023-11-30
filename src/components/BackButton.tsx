'use client';

import { useState } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter, usePathname } from 'next/navigation';

const BackButton = ({ className }: { className?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.back();
    setIsLoading(false);
  };

  return pathname !== '/' ? (
    <Button className={`${className}`} onClick={handleClick}>
      {isLoading ? <Loader2 className="animate-spin" /> : <ChevronLeft />}
    </Button>
  ) : null;
};

export default BackButton;
