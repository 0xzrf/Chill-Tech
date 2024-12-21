import { NextAuthOptions } from "next-auth"

import  CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import LinkedIn from "next-auth/providers/linkedin"

export const authConfig: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "johndoe@gmail.com"
                },
                password: {label: "Password", type:"password"}
            },
            async authorize(credentials) {
                return null
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
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