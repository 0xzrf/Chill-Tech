'use client'

import { useSession } from "next-auth/react";
import {useEffect, useState} from "react"
import { redirect } from "next/navigation";
import axios from "axios";

export default function Home() {
    const [user, setUser] = useState<any>()
    const session = useSession()

    useEffect(() => {
        if(!session){
             redirect("/api/auth/signin")
        }

        (async () => {

            console.log(session)
            const response = await axios.post("http://localhost:3000/api/users/getUser", {
                email: session?.data?.user?.email
            })

            if (!response.data.success) {
                alert (response.data.msg)
                return (
                    <div>
                        <h1>Error</h1>
                    </div>
                )
            }

            setUser(response.data.user)
        })() 
        
    }, [session])

  return (
    <div className="flex flex-col justify-center items-center">

        {
            user && (
                <h1>
                    {user.username}
                </h1>
            )
        }
    </div>
  );
}
