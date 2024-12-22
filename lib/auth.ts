import { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

import GoogleProvider from "next-auth/providers/google"
import { redirect } from "next/navigation";

export const authConfig: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],

}

export async function loginServerSideRestricted() {
    const session = await getServerSession(authConfig);
    if (!session) return redirect("/api/auth/signin")
}

// export function loginClientSide() {
//     if (typeof window !== "undefined") {
//         const session = useSession()
//         const router = useRouter()

//         if(!session) router.push("/api/auth/signin")
//     }
// }