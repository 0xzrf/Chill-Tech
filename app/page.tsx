import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {

  const session = await getServerSession(authConfig)


  return (
    <div className="flex flex-col justify-center items-center">
      <h1>
        The user's email is: {session?.user?.email}
      </h1>
      <h2>
        The user's name is: {session?.user?.name}
      </h2>
    </div>
  );
}
