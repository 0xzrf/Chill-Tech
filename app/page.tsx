import { authConfig, loginServerSideRestricted } from "@/lib/auth";
import { getServerSession } from "next-auth";
import axios from "axios"
import { redirect } from "next/navigation";
export default async function Home() {

  const session = await getServerSession(authConfig)

  await loginServerSideRestricted()

  if (session) {
    const response = await axios.post("http://localhost:3000/api/users/createUser", {
      email: session?.user?.email,
      username: session?.user?.name
    })

    if (!response.data.success) {
      alert(response.data.msg)
      return
    }

    redirect("/home")    
  }
  
  return (
    <div className="flex flex-col justify-center items-center">
    </div>
  );
}
