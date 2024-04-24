import { currentUser } from '@clerk/nextjs';
import { fetchUserByExternalId } from '@/data/user';
import { db } from '@/lib/prisma';
import Menu from '@/components/menu';
import { Toaster } from '@/components/ui/toaster';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  const dbUser = await fetchUserByExternalId(user?.id);

  if (
    dbUser &&
    dbUser?.status != 'Admin' &&
    user?.emailAddresses.some((email) =>
      process.env.ADMIN_EMAILS!.includes(email.emailAddress)
    )
  ) {
    await db.user.update({
      where: { externalId: dbUser.externalId },
      data: {
        status: 'Admin',
      },
    });
  }

  return (
    <div>
      <Menu
        username={user?.username}
        firstName={user?.firstName}
        lastName={user?.lastName}
        imageUrl={user?.imageUrl}
      />
      {children}
      <Toaster />
    </div>
  );
}
