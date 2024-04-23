import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider, currentUser } from '@clerk/nextjs';
import { fetchUserByExternalId } from '@/data/user';
import { db } from '@/lib/prisma';
import Menu from '@/components/menu';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Slack Board',
  description: 'L sphe for slacking',
};

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
      ['melihyardim1057@gmail.com', 'melihyardim@gmail.com'].includes(
        email.emailAddress
      )
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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* <Menu user={user}/> */}
          {children}
          <Toaster/>
        </body>
      </html>
    </ClerkProvider>
  );
}
