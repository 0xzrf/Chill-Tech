import { prisma } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server"


export const POST = async (req: NextRequest) => {

    const {email}: {email: string} = await req.json();

    if (!email) {
        return NextResponse.json({
            msg: "Email not provided",
            success: false
        })
    }

    const user = await prisma.parent.findFirst({
        where: {
            email
        }
    })

    return NextResponse.json({
        user,
        success: true
    })
}