"use server"

import { db } from "@/lib/prisma"

export const newHistoryItem = async (userId: string, from: number, to: number, changedById: string) => {
    const newItem = await db.historyItem.create({
        data: {
            from,
            to,
            userId,
            changedById
        }
    });

    return newItem;
};