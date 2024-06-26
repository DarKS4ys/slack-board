'use client';
import type { HistoryItem, User } from '@prisma/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DefaultPfp from '@/public/default_pfp.svg';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { cn, formatDate } from '@/lib/utils';
import { Slider } from './ui/slider';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { updateUserDB } from '@/actions/user';
import { FiLoader } from 'react-icons/fi';
import Notification from './notification';
import { newHistoryItem } from '@/actions/history';
import {BsArrowRight} from 'react-icons/bs'

export default function Person({
  users,
  person,
  historyItems,
  currUserId,
}: {
  users: User[];
  person: User;
  historyItems: HistoryItem[];
  currUserId: string | undefined;
}) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState(false);
  const [percentage, setPercentage] = useState<number | null>(20);

  const resetNotify = () => {
    setNotify(false);
  };

  const findUserByExternalId = (externalId: string) => {
    return users.find((user) => user.externalId === externalId);
  };

  useEffect(() => {
    setPercentage(person.percentage);
  }, [person.percentage]);

  const handleValueCommit = async (value: number) => {
    if (!value) {
      console.error('No value returned from slider component');
      return;
    }

    try {
      setLoading(true);
  
      const adminUsers = users.filter(user => user.status === 'Admin');
      const totalAdmins = adminUsers.length;
  
      const diff = value - (person.percentage || 20);
  
      const adjustmentFactor = diff / totalAdmins;
      
      await Promise.all([
        updateUserDB(person.externalId, { percentage: value }),
        newHistoryItem(
          person.id,
          person.percentage || 20,
          value,
          currUserId || 'unknown'
        ),
      ]);
  
      for (const user of adminUsers) {
        if (user.externalId !== person.externalId) {
          const userDiff = (user.percentage || 20) - 20;
          const newPercentage = 20 + userDiff - adjustmentFactor;
          await updateUserDB(user.externalId, { percentage: newPercentage });
        }
      }
  
      setNotify(true);
  
      toast({
        title: `Adjusted the percentages for ${person.first_name} ${person.last_name}`,
        description: `Percentage changed from ${person.percentage}% to ${value}%`,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer>
      <Notification reset={resetNotify} notify={notify} />
      <DrawerTrigger asChild>
        <button className="flex flex-col gap-y-2 hover:bg-border w-60 transition hover:shadow-[0_0px_20px_rgba(255,_255,_255,_0.15)] hover:scale-110 duration-300 rounded-lg border p-8 items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden relative">
            <Image
              quality={95}
              src={person.image ? person.image : DefaultPfp}
              fill
              alt={`${person.first_name}'s profile picture`}
            />
          </div>
          <h1 className="text-xl font-medium line-clamp-1">{`${person.first_name} ${person.last_name}`}</h1>
          {person.percentage ? (
            <h2
              className={cn(
                'text-lg',
                person.percentage >= 20 && 'text-green-500',
                person.percentage > 15 &&
                  person.percentage < 20 &&
                  'text-primary',
                person.percentage >= 10 &&
                  person.percentage <= 15 &&
                  'text-red-500',
                person.percentage >= 5 &&
                  person.percentage < 10 &&
                  'text-red-600',
                person.percentage > 0 &&
                  person.percentage < 5 &&
                  'text-red-700',
                person.percentage === 0 && 'text-red-800'
              )}
            >
              {person.percentage + '%'}
            </h2>
          ) : (
            '?%'
          )}
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-w-6xl mx-auto">
        <div className="p-8 flex flex-col gap-y-8 items-center justify-center text-center">
          <DrawerTitle>
            {`Edit ${person.first_name} ${person.last_name}`}
          </DrawerTitle>

          <div className="w-full max-w-2xl mx-auto gap-y-4 flex flex-col">
            <h1 className="text-5xl font-semibold">{percentage}%</h1>
            <div className="flex gap-x-2">
              <button
                disabled={loading}
                className="disabled:opacity-50 active:scale-90 transition hover:scale-110 hover:opacity-90"
              >
                <PlusIcon />
              </button>
              <Slider
                disabled={loading}
                onValueChange={(value) => setPercentage(value[0])}
                onValueCommit={(value) => handleValueCommit(value[0])}
                defaultValue={[percentage || 20]}
                max={100}
                step={1}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                disabled={loading}
                className="disabled:opacity-50 active:scale-90 transition hover:scale-110 hover:opacity-90"
              >
                <MinusIcon />
              </button>
            </div>
            {loading && (
              <div className="gap-x-1.5 mx-auto flex items-center">
                <FiLoader className="animate-spin" />
                Loading...
              </div>
            )}
          </div>

          <div className="flex flex-col gap-y-4">
            <h1 className="text-xl font-semibold mt-4">History</h1>
            {historyItems && historyItems.length > 0 ? (
              <div className="w-full overflow-y-scroll z-[50] max-h-64 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {historyItems.map((item, i) => (
                  <div key={i} className="border min-w-1/3 items-center flex flex-col gap-y-2 rounded-lg p-4">
                    <div className="flex gap-x-2 items-center">
                    <h2 className="text-xl font-medium">
                      {item.from.toFixed(1)}%
                    </h2>
                    <BsArrowRight size={24}/>
                    <h2 className="text-xl font-medium">
                      {item.to.toFixed(1)}%
                    </h2>
                    </div>
                    <div className="flex gap-x-1 items-center">
                      <h1 className='text-sm'>Change by: </h1>
                    <Image src={findUserByExternalId(item.changedById)?.image || DefaultPfp} alt='User Image' width={64} height={64} className='h-5 w-5 aspect-square rounded-full'/>
                    <h1 className="text-sm">{`${
                      findUserByExternalId(item.changedById)?.first_name
                    } ${
                      findUserByExternalId(item.changedById)?.last_name
                    }`}</h1></div>
                    <p className="mt-2 text-sm font-light text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </p>
                    
                  </div>
                ))}
              </div>
            ) : (
              <h3 className="text-muted-foreground">
                There&apos;s nothing to show here 😉
              </h3>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
