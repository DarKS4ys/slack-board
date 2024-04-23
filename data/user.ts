import { db } from '@/lib/prisma';

export const fetchUserById = async (id: string) => {
  const user = await db.user.findFirst({
    where: { id },
  });

  return user;
};

export const fetchUserByExternalId = async (
  externalId: string | undefined | null
) => {
  if (!externalId) {
    return;
  }
  const user = await db.user.findFirst({
    where: { externalId },
  });

  return user;
};

export const findUserWithUsername = async (username: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });

    return user;
  } catch (error) {
    console.error('Error checking username:', error);
    throw new Error('Error checking username');
  }
};
