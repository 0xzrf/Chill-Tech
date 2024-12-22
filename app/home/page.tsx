import { useSession } from "next-auth/react";
import {useEffect} from "react"
import { redirect } from "next/navigation";

export default async function Home() {

    useEffect(() => {
        const session = useSession()
        if(!session) redirect("/api/auth/signin")

        
    }, [])

  return (
    <div className="flex flex-col justify-center items-center">
    </div>
  );
}
