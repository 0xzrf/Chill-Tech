import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.email) {
        return NextResponse.json({
            msg: "Not authenticated",
            success: false
        });
    }

    const { childId } = await req.json();

    try {
        const user = await prisma.parent.findUnique({
            where: {
                email: session.user.email
            },
            include: {
                children: true
            }
        });

        if (!user) {
            return NextResponse.json({
                msg: "User not found",
                success: false
            });
        }

        // Remove the child
        await prisma.children.delete({
            where: {
                childId: childId
            }
        });

        return NextResponse.json({
            msg: "Child removed successfully",
            success: true
        });
    } catch (error) {
        console.error("Error removing child:", error);
        return NextResponse.json({
            msg: "Error removing child",
            success: false
        });
    }
};
