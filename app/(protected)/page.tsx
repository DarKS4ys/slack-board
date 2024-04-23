import Person from '@/components/person';
import { db } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';

export default async function Home() {
  const users = await db.user.findMany({
    where: { status: 'Admin' },
    orderBy: { percentage: 'asc' },
    include: {HistoryItem: true}
  });

  const currUser = await currentUser()
  return (
    <main className="h-screen flex flex-col gap-y-8 justify-center items-center max-w-6xl mx-auto">
      <h1 className="text-5xl font-semibold uppercase">Slack Board</h1>

      <div className="flex space-x-2">
{/*         {users.map((user, i) => (
          <div className=' p-6 rounded-lg' key={i}>
            <Person currUserId={currUser?.id || 'unknown'} users={users} person={user} historyItems={user.HistoryItem} />
          </div>
        ))} */}
      </div>
    </main>
  );
}