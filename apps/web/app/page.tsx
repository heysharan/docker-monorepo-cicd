import { prismaClient } from "db/client";

export default async function Page() {
  const users = await prismaClient.user.findMany()
  return (
    <div className="text-2xl font-semibold">
      {JSON.stringify(users)}
    </div>
  );
}

// export const revalidate = 60

export const dynamic = "force-dynamic";