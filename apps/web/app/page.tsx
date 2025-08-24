import { prismaClient } from "db/client";

export default async function Page() {
  const users = await prismaClient.user.findMany()
  return (
    <div className="text-2xl font-semibold flex flex-col gap-2 ml-4 mr-4 mt-4">
      {users.map((usr,index) => <Button key={index} title={usr.firstname}/>)}
      {users.map((usr,index) => <Button key={index} title={usr.username}/>)}
    </div>
  );
}

// export const revalidate = 60

export const dynamic = "force-dynamic";

const Button = ({ title } : { title: string }) => {
  return(
    <div className="bg-neutral-600 p-3 rounded-lg w-fit ">
      {title}
    </div>
  )
}