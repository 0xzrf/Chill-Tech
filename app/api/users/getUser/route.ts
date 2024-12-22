import { prisma } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.email) {
        return NextResponse.json({
            msg: "Not authenticated",
            success: false
        });
    }

    const user = await prisma.parent.findUnique({
        where: {
            email: session.user.email
        },
        include: {
            children: {
                include: {
                    activities: true
                }
            }
        }
    });

    if (!user) {
        return NextResponse.json({
            msg: "User not found",
            success: false
        });
    }

    return NextResponse.json({
        user,
        success: true
    });
}