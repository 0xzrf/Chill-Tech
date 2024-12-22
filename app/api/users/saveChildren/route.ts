import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authConfig);
        
        if (!session?.user?.email) {
            return NextResponse.json({
                msg: "Not authenticated",
                success: false
            });
        }

        const body = await req.json();
        const { children } = body;

        if (!children || !Array.isArray(children)) {
            return NextResponse.json({
                msg: "Invalid children data",
                success: false
            });
        }

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

        // Delete existing children
        await prisma.children.deleteMany({
            where: {
                parentId: user.userId
            }
        });

        // Create new children
        await prisma.parent.update({
            where: {
                email: session.user.email
            },
            data: {
                children: {
                    create: children.map((child: { name: string; age: number }) => ({
                        name: child.name,
                        age: child.age,
                        totalPoints: 0
                    }))
                }
            }
        });

        return NextResponse.json({
            msg: "Children saved successfully",
            success: true
        });
    } catch (error) {
        console.error("Error saving children:", error);
        return NextResponse.json({
            msg: "Error saving children",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}
