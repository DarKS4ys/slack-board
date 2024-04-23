'use server';

import {
  fetchUserByExternalId,
  fetchUserById,
  findUserWithUsername,
} from '@/data/user';
import { db } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';

export const updateUser = async (userId: string, params: any) => {
  await clerkClient.users.updateUser(userId, params);
};

export const updateUserMetadata = async (userId: string, params: any) => {
  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...params,
    },
  });
};

export const updateUserDB = async (externalId: string, params: any) => {
  try {
     console.log(params); 
    await db.user.update({
      where: { externalId },
      data: params,
    });
  } catch (err) {
    console.log(err);
  }
};

export const ServerFetchUserByExternalId = async (externalId: string) => {
  const user = await fetchUserByExternalId(externalId);

  return user;
};

export const ServerFetchUserById = async (id: string) => {
  const user = await fetchUserById(id);

  return user;
};

export const ServerGetUserWithUsername = async (username: string) => {
  const fetchedUser = await findUserWithUsername(username);

  return fetchedUser;
};
