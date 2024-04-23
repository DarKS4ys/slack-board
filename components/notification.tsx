'use client';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './ui/button';
import { HiOutlineRefresh } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
export default function Notification({
  notify,
  reset,
}: {
  reset: () => void;
  notify: boolean;
}) {
  const router = useRouter();
  const handleRefresh = () => {
    reset();
    router.refresh();
  };
  return (
    <>
      <AnimatePresence>
        {notify && (
          <motion.button
            initial={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffess: 300, damping: 15 }}
            animate={{ y: 25, opacity: 1 }}
            exit={{y: -100, opacity: 0}}
            className="z-[999] absolute top-0 left-0 w-full flex justify-center"
          >
            <Button
              onClick={handleRefresh}
              className="flex gap-x-1.5 active:scale-90 transition"
            >
              <HiOutlineRefresh />
              Refresh?
            </Button>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
