import { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"

import GoogleProvider from "next-auth/providers/google"
import { redirect } from "next/navigation";

export const authConfig: NextAuthOptions = {
    providers: [
        // CredentialsProvider({
        //     name: "Sign in",
        //     credentials: {
        //         email: {
        //             label: "Email",
        //             type: "email",
        //             placeholder: "johndoe@gmail.com"
        //         },
        //         password: {label: "Password", type:"password"}
        //     },
        //     async authorize(credentials) {
        //         return null
        //     }
        // }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            
        }),
        // Facebook({
        //     clientId: process.env.FACEBOOK_CLIENT_ID as string,
        //     clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string 
        // }),
        // LinkedIn({
        //     clientId: process.env.LINKEDIN_CLIENT_ID as string,
        //     clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string 
        // }),
        
    ]
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