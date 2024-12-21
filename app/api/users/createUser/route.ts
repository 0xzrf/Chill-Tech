import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/auth"

export const POST = async (req: NextRequest) => {

    const {email, username}: {email: string, username: string} = await req.json();

    if (!email || !username) {
        return NextResponse.json({
            msg: "Email or username not provided",
            success: false
        })
    }

    const user = await prisma.parent.findFirst({
        where: {
            email,
            username
        }
    })

    if (!user) {
        await prisma.parent.create({
            data: {
                email,
                username
            }
        })
    }

    return NextResponse.json({
        user,
        success: true
    })

}