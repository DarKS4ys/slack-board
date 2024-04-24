'use client';
import React, { useEffect, useState } from 'react';
import { SignOutButton, UserButton, UserProfile } from '@clerk/nextjs';
import { BiLogOut } from 'react-icons/bi';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { BsGearFill } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import { FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Menu({
  username,
  firstName,
  lastName,
  imageUrl,
}: {
  username: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  imageUrl: string | null | undefined;
}) {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInitialized(true);
    }
  }, []);
  const router = useRouter();
  return (
    <div className="items-center justify-center flex fixed w-full -bottom-4">
      <p className="text-xs md:text-sm text-muted-foreground absolute md:bottom-10 md:left-10 bottom-[20svh]">
        Built using <span className="font-medium text-sm md:text-base">CSS VARIABLES</span>
      </p>
      <motion.div
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        initial={{ y: 100, opacity: 0, scale: 0.75 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-background flex items-center justify-between px-6 py-4 border h-24 w-96 rounded-2xl "
      >
        <div className="flex gap-x-2 items-center">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              !initialized && 'bg-border animate-pulse'
            )}
          >
            {initialized ? (
              <UserButton />
            ) : (
              <FiLoader className="animate-spin opacity-95" />
            )}
          </div>
          <div>
            <h1 className="font-medium leading-tight">{`${firstName} ${lastName}`}</h1>
            <h2 className="text-sm font-light text-muted-foreground leading-tight">
              #{`${username}`}
            </h2>
          </div>
        </div>

        <div className="flex gap-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <button className="active:scale-90 p-1.5 rounded-lg bg-primary-foreground hover:bg-border border border-border transition">
                <BsGearFill />
              </button>
            </DialogTrigger>
            <DialogContent className="w-fit items-center justify-center max-w-none overflow-y-scroll h-[80%]">
              <h1 className="text-xl text-center font-semibold">Manage</h1>
              <UserProfile />
            </DialogContent>
          </Dialog>
          {initialized ? (
            <SignOutButton signOutCallback={() => router.push('/sign-in')}>
              <button
                className="active:scale-90 p-1.5 rounded-lg bg-primary-foreground hover:bg-border border border-border transition"
              >
                <BiLogOut />
              </button>
            </SignOutButton>
          ) : (
            <button className="active:scale-90 p-1.5 rounded-lg bg-primary-foreground hover:bg-border border border-border transition">
              <FiLoader className="animate-spin opacity-95" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
