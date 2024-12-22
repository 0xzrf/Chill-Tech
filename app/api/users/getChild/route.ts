import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authConfig);
        
        if (!session?.user?.email) {
            return NextResponse.json({
                msg: "Not authenticated",
                success: false
            });
        }

        const { searchParams } = new URL(req.url);
        const childId = searchParams.get('childId');

        if (!childId) {
            return NextResponse.json({
                msg: "Child ID is required",
                success: false
            });
        }

        const child = await prisma.children.findFirst({
            where: {
                childId: childId,
                parent: {
                    email: session.user.email
                }
            },
        });

        if (!child) {
            return NextResponse.json({
                msg: "Child not found",
                success: false
            });
        }

        return NextResponse.json({
            success: true,
            child
        });
    } catch (error) {
        console.error("Error fetching child:", error);
        return NextResponse.json({
            msg: "Error fetching child",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}
