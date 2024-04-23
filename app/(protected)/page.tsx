import { db } from "@/lib/prisma";
import Image from "next/image";

export default function Home() {
  /* const users = db.user.findMany */
  return (
    <main className="min-h-screen flex flex-col justify-center items-center max-w-6xl mx-auto">
      <h1 className="text-4xl font-semibold uppercase">Slack Board</h1>

      <div className="flex space-x-2">

      </div>
    </main>
  );
}
